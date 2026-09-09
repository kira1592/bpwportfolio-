import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import {
  checkRateLimit,
  recordLoginFailure,
  recordLoginSuccess,
  verifyAdminPassword,
  generateSessionToken,
  requireAdminAuth,
} from './server/auth';
import {
  getAllProjects,
  getProjectBySlug,
  getProjectById,
  validateProject,
  addProject,
  updateProject,
  deleteProject,
  saveBase64Image,
} from './server/projectsService';
import { isGitHubConfigured, getGitHubConfig, commitProjectsToGitHub } from './server/githubService';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Increase payload limit for image uploads
  app.use(express.json({ limit: '20mb' }));
  app.use(express.urlencoded({ extended: true, limit: '20mb' }));

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Public API: Get all projects
  app.get('/api/projects', (req, res) => {
    const projects = getAllProjects();
    res.json(projects);
  });

  // Public API: Get project by slug
  app.get('/api/projects/:slug', (req, res) => {
    const project = getProjectBySlug(req.params.slug);
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }
    res.json(project);
  });

  // =================== ADMIN API ===================

  // Status check
  app.get('/api/admin/status', (req, res) => {
    const ghConfig = getGitHubConfig();
    const hasPasswordHash = Boolean(process.env.ADMIN_PASSWORD_HASH && process.env.ADMIN_PASSWORD_HASH.trim().length > 0);

    res.json({
      githubConfigured: isGitHubConfigured(),
      githubOwner: ghConfig.owner || null,
      githubRepo: ghConfig.repo || null,
      githubBranch: ghConfig.branch,
      passwordHashConfigured: hasPasswordHash,
    });
  });

  // Admin Login
  app.post('/api/admin/login', (req, res) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const rateCheck = checkRateLimit(ip);

    if (!rateCheck.allowed) {
      res.status(429).json({
        error: `Too many failed login attempts. Please try again in ${rateCheck.waitSeconds} seconds.`,
        lockoutSeconds: rateCheck.waitSeconds,
      });
      return;
    }

    const { password } = req.body;
    if (!password || typeof password !== 'string') {
      res.status(400).json({ error: 'Password is required' });
      return;
    }

    const isValid = verifyAdminPassword(password);
    if (!isValid) {
      recordLoginFailure(ip);
      res.status(401).json({ error: 'Invalid admin password' });
      return;
    }

    recordLoginSuccess(ip);
    const token = generateSessionToken();
    res.json({
      success: true,
      token,
      message: 'Authentication successful',
    });
  });

  // Verify Session Token
  app.get('/api/admin/verify', requireAdminAuth, (req, res) => {
    res.json({ authenticated: true });
  });

  // Admin: Get all projects for editor
  app.get('/api/admin/projects', requireAdminAuth, (req, res) => {
    const projects = getAllProjects();
    res.json(projects);
  });

  // Admin: Add Project
  app.post('/api/admin/projects', requireAdminAuth, async (req, res) => {
    const newProjectData = req.body;
    const validation = validateProject(newProjectData, true);

    if (!validation.valid) {
      res.status(400).json({ error: 'Validation failed', errors: validation.errors });
      return;
    }

    const project = {
      ...newProjectData,
      id: newProjectData.id || newProjectData.slug,
      company: newProjectData.company && newProjectData.company.trim().length > 0 ? newProjectData.company.trim() : undefined,
    };

    const created = addProject(project);

    // Auto-sync to GitHub if configured
    let githubResult = null;
    if (isGitHubConfigured()) {
      githubResult = await commitProjectsToGitHub(`Add project: ${project.title}`);
    }

    res.status(201).json({
      success: true,
      project: created,
      githubSynced: githubResult?.success || false,
      githubCommitUrl: githubResult?.commitUrl,
      githubError: githubResult?.error,
    });
  });

  // Admin: Update Project
  app.put('/api/admin/projects/:id', requireAdminAuth, async (req, res) => {
    const { id } = req.params;
    const existing = getProjectById(id);

    if (!existing) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    const updateData = req.body;
    const validation = validateProject(updateData, false, id);

    if (!validation.valid) {
      res.status(400).json({ error: 'Validation failed', errors: validation.errors });
      return;
    }

    const updated = updateProject(id, updateData);
    if (!updated) {
      res.status(500).json({ error: 'Failed to update project' });
      return;
    }

    // Auto-sync to GitHub if configured
    let githubResult = null;
    if (isGitHubConfigured()) {
      githubResult = await commitProjectsToGitHub(`Update project: ${updated.title}`);
    }

    res.json({
      success: true,
      project: updated,
      githubSynced: githubResult?.success || false,
      githubCommitUrl: githubResult?.commitUrl,
      githubError: githubResult?.error,
    });
  });

  // Admin: Delete Project
  app.delete('/api/admin/projects/:id', requireAdminAuth, async (req, res) => {
    const { id } = req.params;
    const existing = getProjectById(id);

    if (!existing) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    const deleted = deleteProject(id);
    if (!deleted) {
      res.status(500).json({ error: 'Failed to delete project' });
      return;
    }

    // Auto-sync to GitHub if configured
    let githubResult = null;
    if (isGitHubConfigured()) {
      githubResult = await commitProjectsToGitHub(`Delete project: ${existing.title}`);
    }

    res.json({
      success: true,
      githubSynced: githubResult?.success || false,
      githubCommitUrl: githubResult?.commitUrl,
      githubError: githubResult?.error,
    });
  });

  // Admin: Upload image
  app.post('/api/admin/upload', requireAdminAuth, (req, res) => {
    const { slug, fileName, base64Data } = req.body;

    if (!slug || !fileName || !base64Data) {
      res.status(400).json({ error: 'Missing required parameters: slug, fileName, base64Data' });
      return;
    }

    // Validate mime type
    const mimeMatch = base64Data.match(/^data:(image\/(jpeg|png|webp|svg\+xml));base64,/);
    if (!mimeMatch && !base64Data.startsWith('data:image/')) {
      res.status(400).json({ error: 'Invalid image format. Supported formats: JPG, PNG, WEBP, SVG.' });
      return;
    }

    try {
      const relativePath = saveBase64Image(slug, fileName, base64Data);
      res.json({ success: true, url: relativePath });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to save uploaded image' });
    }
  });

  // Admin: Manual GitHub Publish
  app.post('/api/admin/publish-github', requireAdminAuth, async (req, res) => {
    const result = await commitProjectsToGitHub(req.body.message || 'Manual publish from Admin Editor');
    if (!result.success) {
      res.status(500).json({ error: result.error || 'Failed to commit to GitHub' });
      return;
    }
    res.json({ success: true, commitUrl: result.commitUrl });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Portfolio & Admin Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});

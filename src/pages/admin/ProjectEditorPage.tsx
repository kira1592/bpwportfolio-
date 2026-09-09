import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  Upload,
  Check,
  AlertCircle,
  FolderGit2,
  Image as ImageIcon,
  ExternalLink,
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Project, ProjectType, ProjectStatus, ProjectImage } from '../../types';
import {
  adminGetProjects,
  adminAddProject,
  adminUpdateProject,
  adminUploadImage,
} from '../../services/adminApi';

const PROJECT_TYPES: ProjectType[] = [
  'Web App',
  'Mobile App',
  'Desktop App',
  'Automation',
  'IT Solution',
  'Other',
];

const PROJECT_STATUSES: ProjectStatus[] = [
  'Completed',
  'In Progress',
  'Maintenance',
  'Archived',
];

export const ProjectEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [company, setCompany] = useState('');
  const [type, setType] = useState<ProjectType>('Web App');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [status, setStatus] = useState<ProjectStatus>('In Progress');
  const [description, setDescription] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');

  // Details
  const [purpose, setPurpose] = useState('');
  const [mainFunctions, setMainFunctions] = useState<string[]>(['']);
  const [workflow, setWorkflow] = useState('');
  const [practicalBenefit, setPracticalBenefit] = useState('');

  // Technologies
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [newTechInput, setNewTechInput] = useState('');

  // Images
  const [coverImage, setCoverImage] = useState('');
  const [screenshots, setScreenshots] = useState<ProjectImage[]>([]);

  // Track if slug was manually modified
  const [slugTouched, setSlugTouched] = useState(isEditing);

  // Fetch project data if editing
  useEffect(() => {
    if (!isEditing || !id) return;

    async function loadProject() {
      setIsLoading(true);
      try {
        const projects = await adminGetProjects();
        const found = projects.find((p) => p.id === id || p.slug === id);
        if (!found) {
          setGeneralError(`Project "${id}" not found.`);
          setIsLoading(false);
          return;
        }

        setTitle(found.title);
        setSlug(found.slug);
        setCompany(found.company || '');
        setType(found.type);
        setYear(found.year);
        setStatus(found.status);
        setDescription(found.description);
        setLiveUrl(found.liveUrl || '');
        setGithubUrl(found.githubUrl || '');

        setPurpose(found.details?.purpose || '');
        setMainFunctions(found.details?.mainFunctions?.length ? found.details.mainFunctions : ['']);
        setWorkflow(found.details?.workflow || '');
        setPracticalBenefit(found.details?.practicalBenefit || '');

        setTechnologies(found.technologies || []);
        setCoverImage(found.coverImage || '');
        setScreenshots(found.screenshots || []);
      } catch (err: any) {
        setGeneralError(err.message || 'Failed to load project');
      } finally {
        setIsLoading(false);
      }
    }

    loadProject();
  }, [id, isEditing]);

  // Auto-generate slug from title for new projects
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (!slugTouched && !isEditing) {
      const generatedSlug = newTitle
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setSlug(generatedSlug);
    }
  };

  // Technologies handling
  const handleAddTech = () => {
    const trimmed = newTechInput.trim();
    if (trimmed && !technologies.includes(trimmed)) {
      setTechnologies([...technologies, trimmed]);
      setNewTechInput('');
    }
  };

  const handleRemoveTech = (index: number) => {
    setTechnologies(technologies.filter((_, i) => i !== index));
  };

  // Main functions handling
  const handleFunctionChange = (index: number, val: string) => {
    const updated = [...mainFunctions];
    updated[index] = val;
    setMainFunctions(updated);
  };

  const handleAddFunction = () => {
    setMainFunctions([...mainFunctions, '']);
  };

  const handleRemoveFunction = (index: number) => {
    setMainFunctions(mainFunctions.filter((_, i) => i !== index));
  };

  // Screenshot handling
  const handleScreenshotChange = (index: number, field: keyof ProjectImage, val: string) => {
    const updated = [...screenshots];
    updated[index] = { ...updated[index], [field]: val };
    setScreenshots(updated);
  };

  const handleMoveScreenshot = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === screenshots.length - 1)
    ) {
      return;
    }
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...screenshots];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setScreenshots(updated);
  };

  const handleRemoveScreenshot = (index: number) => {
    setScreenshots(screenshots.filter((_, i) => i !== index));
  };

  const handleAddScreenshot = () => {
    setScreenshots([...screenshots, { url: '', caption: '' }]);
  };

  // File Upload Helper
  const handleFileUpload = async (
    file: File,
    onSuccess: (url: string) => void,
    defaultNamePrefix: string
  ) => {
    const currentSlug = slug || 'temp-project';
    const reader = new FileReader();

    reader.onload = async () => {
      const base64 = reader.result as string;
      const ext = file.name.split('.').pop() || 'webp';
      const cleanFileName = `${defaultNamePrefix}_${Date.now()}.${ext}`;

      const res = await adminUploadImage(currentSlug, cleanFileName, base64);
      if (res.success && res.url) {
        onSuccess(res.url);
      } else {
        alert(res.error || 'Failed to upload image');
      }
    };

    reader.readAsDataURL(file);
  };

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});
    setGeneralError(null);
    setSaveSuccess(null);

    // Filter empty function lines
    const cleanedFunctions = mainFunctions.map((f) => f.trim()).filter(Boolean);

    const projectPayload: Partial<Project> = {
      id: id || slug,
      slug: slug.trim(),
      title: title.trim(),
      company: company.trim() ? company.trim() : undefined,
      type,
      year: year.trim(),
      status,
      description: description.trim(),
      liveUrl: liveUrl.trim() || undefined,
      githubUrl: githubUrl.trim() || undefined,
      coverImage: coverImage.trim(),
      technologies,
      details: {
        purpose: purpose.trim(),
        mainFunctions: cleanedFunctions,
        workflow: workflow.trim(),
        practicalBenefit: practicalBenefit.trim(),
      },
      screenshots: screenshots.filter((s) => s.url.trim().length > 0),
    };

    setIsSaving(true);

    try {
      let res;
      if (isEditing && id) {
        res = await adminUpdateProject(id, projectPayload);
      } else {
        res = await adminAddProject(projectPayload);
      }

      setIsSaving(false);

      if (res.success) {
        setSaveSuccess(
          res.githubSynced
            ? 'Project saved and published to GitHub repository!'
            : 'Project saved successfully in database!'
        );
        setTimeout(() => {
          navigate('/admin/projects');
        }, 1200);
      } else {
        if (res.errors) {
          setFormErrors(res.errors);
        }
        setGeneralError(res.error || 'Failed to save project');
      }
    } catch (err: any) {
      setIsSaving(false);
      setGeneralError(err.message || 'Unexpected error while saving project');
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="py-16 text-center space-y-3">
          <div className="w-6 h-6 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-neutral-500 font-medium">Loading project details...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout activeSection="projects">
      <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-200/80 pb-4">
          <div className="space-y-1">
            <Link
              to="/admin/projects"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Projects</span>
            </Link>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
              {isEditing ? `Edit Project: ${title || id}` : 'Add New Project'}
            </h1>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              to="/admin/projects"
              className="px-4 py-2 text-xs font-medium text-neutral-600 hover:text-neutral-900 bg-white border border-neutral-200 rounded-xl transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-5 py-2 bg-neutral-900 hover:bg-black text-white text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-sm disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Project</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {saveSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs sm:text-sm text-emerald-800 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{saveSuccess}</span>
          </div>
        )}

        {generalError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs sm:text-sm text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{generalError}</span>
          </div>
        )}

        {/* SECTION 1: Basic Information */}
        <section className="bg-white border border-neutral-200/90 rounded-2xl p-5 sm:p-6 space-y-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-100 pb-2.5">
            1. Basic Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {/* Project Title */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="block text-xs font-semibold text-neutral-700">
                Project Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={handleTitleChange}
                placeholder="e.g. AI Windows Technician"
                required
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:bg-white focus:border-neutral-900 focus:outline-none"
              />
              {formErrors.title && <p className="text-xs text-red-600">{formErrors.title}</p>}
            </div>

            {/* Slug */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-neutral-700">
                URL Slug <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setSlugTouched(true);
                }}
                placeholder="e.g. ai-windows-technician"
                required
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-mono focus:bg-white focus:border-neutral-900 focus:outline-none"
              />
              {formErrors.slug && <p className="text-xs text-red-600">{formErrors.slug}</p>}
            </div>

            {/* Company / Organization */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-neutral-700">
                Company / Organization <span className="text-neutral-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Studio - A Photography Services (leave empty if independent)"
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:bg-white focus:border-neutral-900 focus:outline-none"
              />
            </div>

            {/* Type */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-neutral-700">
                Project Type <span className="text-red-500">*</span>
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as ProjectType)}
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:bg-white focus:border-neutral-900 focus:outline-none"
              >
                {PROJECT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Year & Status */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-neutral-700">
                  Year <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="2025"
                  required
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-mono focus:bg-white focus:border-neutral-900 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-neutral-700">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:bg-white focus:border-neutral-900 focus:outline-none"
                >
                  {PROJECT_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Short Description */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="block text-xs font-semibold text-neutral-700">
                Short Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Concise overview of what this project is and does..."
                required
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:bg-white focus:border-neutral-900 focus:outline-none"
              />
              {formErrors.description && (
                <p className="text-xs text-red-600">{formErrors.description}</p>
              )}
            </div>

            {/* Optional Links */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-neutral-700">
                Live URL <span className="text-neutral-400 font-normal">(Optional)</span>
              </label>
              <input
                type="url"
                value={liveUrl}
                onChange={(e) => setLiveUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:bg-white focus:border-neutral-900 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-neutral-700">
                GitHub Repository URL <span className="text-neutral-400 font-normal">(Optional)</span>
              </label>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/username/repo"
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:bg-white focus:border-neutral-900 focus:outline-none"
              />
            </div>
          </div>
        </section>

        {/* SECTION 2: Project Details */}
        <section className="bg-white border border-neutral-200/90 rounded-2xl p-5 sm:p-6 space-y-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-100 pb-2.5">
            2. Detailed Specifications
          </h2>

          {/* Purpose */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-neutral-700">
              Purpose
            </label>
            <textarea
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              rows={3}
              placeholder="Why this project was created and what problem it solves..."
              className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:bg-white focus:border-neutral-900 focus:outline-none"
            />
          </div>

          {/* Main Functions (What it can do) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-neutral-700">
                Main Functions / Capabilities ("What it can do")
              </label>
              <button
                type="button"
                onClick={handleAddFunction}
                className="inline-flex items-center gap-1 text-xs font-medium text-neutral-700 hover:text-black bg-neutral-100 hover:bg-neutral-200/80 px-2.5 py-1 rounded-lg transition-colors"
              >
                <Plus className="w-3 h-3" />
                <span>Add Function</span>
              </button>
            </div>

            <div className="space-y-2">
              {mainFunctions.map((fn, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-xs font-mono text-neutral-400 w-6 text-right">
                    {idx + 1}.
                  </span>
                  <input
                    type="text"
                    value={fn}
                    onChange={(e) => handleFunctionChange(idx, e.target.value)}
                    placeholder="e.g. Diagnostic Questioning: Inquires about recent system changes..."
                    className="flex-1 px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs sm:text-sm focus:bg-white focus:border-neutral-900 focus:outline-none"
                  />
                  {mainFunctions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveFunction(idx)}
                      className="p-2 text-neutral-400 hover:text-red-600 transition-colors"
                      title="Remove line"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Workflow */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-neutral-700">
              Workflow
            </label>
            <textarea
              value={workflow}
              onChange={(e) => setWorkflow(e.target.value)}
              rows={3}
              placeholder="Step-by-step user or system flow..."
              className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:bg-white focus:border-neutral-900 focus:outline-none"
            />
          </div>

          {/* Practical Benefit */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-neutral-700">
              Practical Benefit
            </label>
            <textarea
              value={practicalBenefit}
              onChange={(e) => setPracticalBenefit(e.target.value)}
              rows={2}
              placeholder="Tangible real-world outcome and business value..."
              className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:bg-white focus:border-neutral-900 focus:outline-none"
            />
          </div>
        </section>

        {/* SECTION 3: Technologies */}
        <section className="bg-white border border-neutral-200/90 rounded-2xl p-5 sm:p-6 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-100 pb-2.5">
            3. Technologies &amp; Tools
          </h2>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newTechInput}
              onChange={(e) => setNewTechInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTech();
                }
              }}
              placeholder="Type technology (e.g. React, Python, SQLite) and press Add"
              className="flex-1 px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:bg-white focus:border-neutral-900 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleAddTech}
              className="px-4 py-2 bg-neutral-900 hover:bg-black text-white text-xs font-semibold rounded-xl transition-colors"
            >
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {technologies.map((tech, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-100 border border-neutral-200 rounded-lg text-xs font-medium text-neutral-800"
              >
                <span>{tech}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTech(idx)}
                  className="text-neutral-400 hover:text-red-600 transition-colors"
                >
                  ×
                </button>
              </span>
            ))}
            {technologies.length === 0 && (
              <p className="text-xs text-neutral-400">No technologies added yet.</p>
            )}
          </div>
        </section>

        {/* SECTION 4: Cover Image & Gallery */}
        <section className="bg-white border border-neutral-200/90 rounded-2xl p-5 sm:p-6 space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-100 pb-2.5">
            4. Cover Image &amp; Screenshot Gallery
          </h2>

          {/* Cover Image Upload & Preview */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-neutral-700">
              Cover Image <span className="text-red-500">*</span>
            </label>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* Preview Thumbnail */}
              <div className="w-32 h-20 bg-neutral-100 border border-neutral-200 rounded-xl overflow-hidden shrink-0 flex items-center justify-center">
                {coverImage ? (
                  <img
                    src={coverImage}
                    alt="Cover preview"
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <ImageIcon className="w-6 h-6 text-neutral-300" />
                )}
              </div>

              {/* Upload & Path Controls */}
              <div className="flex-1 space-y-2 w-full">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    placeholder="./images/projects/my-slug/cover.webp or URL"
                    required
                    className="flex-1 px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm font-mono focus:bg-white focus:border-neutral-900 focus:outline-none"
                  />
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 bg-neutral-100 hover:bg-neutral-200/80 border border-neutral-200 text-xs font-semibold text-neutral-800 rounded-xl transition-colors shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload File</span>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/svg+xml"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleFileUpload(file, (url) => setCoverImage(url), 'cover');
                        }
                      }}
                    />
                  </label>
                </div>
                <p className="text-[11px] text-neutral-400">
                  Supported formats: WEBP, PNG, JPG, SVG. Compressed under 5MB.
                </p>
                {formErrors.coverImage && (
                  <p className="text-xs text-red-600">{formErrors.coverImage}</p>
                )}
              </div>
            </div>
          </div>

          {/* Screenshots Gallery Reorder & Upload */}
          <div className="space-y-4 pt-4 border-t border-neutral-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-700">
                  Screenshot Gallery Images
                </h3>
                <p className="text-[11px] text-neutral-400">
                  Reorder screenshots using the arrow buttons
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddScreenshot}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-800 bg-neutral-100 hover:bg-neutral-200/80 px-3 py-1.5 rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Screenshot</span>
              </button>
            </div>

            {screenshots.length === 0 ? (
              <p className="text-xs text-neutral-400 py-4 text-center border border-dashed border-neutral-200 rounded-xl">
                No screenshots added. Click "Add Screenshot" to include gallery images.
              </p>
            ) : (
              <div className="space-y-3">
                {screenshots.map((s, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-neutral-50 border border-neutral-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center gap-3"
                  >
                    {/* Reorder Buttons */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleMoveScreenshot(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1.5 text-neutral-500 hover:text-neutral-900 disabled:opacity-20 hover:bg-neutral-200/60 rounded"
                        title="Move Up"
                      >
                        <MoveUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveScreenshot(idx, 'down')}
                        disabled={idx === screenshots.length - 1}
                        className="p-1.5 text-neutral-500 hover:text-neutral-900 disabled:opacity-20 hover:bg-neutral-200/60 rounded"
                        title="Move Down"
                      >
                        <MoveDown className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-mono text-neutral-400 w-4 text-center">
                        {idx + 1}
                      </span>
                    </div>

                    {/* Thumbnail Preview */}
                    <div className="w-16 h-12 bg-white border border-neutral-200 rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                      {s.url ? (
                        <img
                          src={s.url}
                          alt={`Screenshot ${idx + 1}`}
                          className="w-full h-full object-cover object-top"
                        />
                      ) : (
                        <ImageIcon className="w-4 h-4 text-neutral-300" />
                      )}
                    </div>

                    {/* Image URL & Caption Inputs */}
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={s.url}
                          onChange={(e) => handleScreenshotChange(idx, 'url', e.target.value)}
                          placeholder="Image Path / URL"
                          className="flex-1 px-2.5 py-1.5 bg-white border border-neutral-200 rounded-lg text-xs font-mono focus:border-neutral-900 focus:outline-none"
                        />
                        <label className="cursor-pointer p-1.5 bg-white border border-neutral-200 hover:border-neutral-900 rounded-lg text-neutral-600 transition-colors" title="Upload image file">
                          <Upload className="w-3.5 h-3.5" />
                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/webp,image/svg+xml"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleFileUpload(
                                  file,
                                  (url) => handleScreenshotChange(idx, 'url', url),
                                  `screen${idx + 1}`
                                );
                              }
                            }}
                          />
                        </label>
                      </div>

                      <input
                        type="text"
                        value={s.caption || ''}
                        onChange={(e) => handleScreenshotChange(idx, 'caption', e.target.value)}
                        placeholder="Caption description..."
                        className="px-2.5 py-1.5 bg-white border border-neutral-200 rounded-lg text-xs focus:border-neutral-900 focus:outline-none"
                      />
                    </div>

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => handleRemoveScreenshot(idx)}
                      className="p-1.5 text-neutral-400 hover:text-red-600 transition-colors self-end sm:self-center"
                      title="Remove Screenshot"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Bottom Action Bar */}
        <div className="flex items-center justify-between border-t border-neutral-200/80 pt-6 pb-12">
          <Link
            to="/admin/projects"
            className="px-4 py-2 text-xs font-medium text-neutral-600 hover:text-neutral-900 bg-white border border-neutral-200 rounded-xl transition-colors"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-neutral-900 hover:bg-black text-white text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-sm disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving Project...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Project</span>
              </>
            )}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
};

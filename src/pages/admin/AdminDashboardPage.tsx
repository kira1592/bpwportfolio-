import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, ExternalLink, RefreshCw, FolderGit2, AlertTriangle, Check, ArrowUpRight } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Project } from '../../types';
import { adminGetProjects, adminDeleteProject, adminPublishToGitHub } from '../../services/adminApi';
import { useAdminAuth } from '../../context/AdminAuthContext';

export const AdminDashboardPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishFeedback, setPublishFeedback] = useState<{ success: boolean; message: string; url?: string } | null>(null);

  // Delete modal state
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { adminStatus } = useAdminAuth();
  const navigate = useNavigate();

  const fetchProjects = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await adminGetProjects();
      setProjects(data);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to load projects');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async () => {
    if (!projectToDelete) return;
    setIsDeleting(true);
    const res = await adminDeleteProject(projectToDelete.id);
    setIsDeleting(false);

    if (res.success) {
      setProjects((prev) => prev.filter((p) => p.id !== projectToDelete.id));
      setProjectToDelete(null);
      if (res.githubSynced) {
        setPublishFeedback({
          success: true,
          message: 'Project deleted and synced to GitHub repository.',
        });
      }
    } else {
      alert(res.error || 'Failed to delete project');
    }
  };

  const handleManualPublish = async () => {
    setIsPublishing(true);
    setPublishFeedback(null);
    const res = await adminPublishToGitHub('Manual sync from Portfolio Admin Dashboard');
    setIsPublishing(false);

    if (res.success) {
      setPublishFeedback({
        success: true,
        message: 'Successfully published updates to GitHub repository!',
        url: res.commitUrl,
      });
    } else {
      setPublishFeedback({
        success: false,
        message: res.error || 'Failed to publish to GitHub',
      });
    }
  };

  return (
    <AdminLayout activeSection="projects">
      <div className="space-y-6">
        {/* Top Header & Action Row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-200/80 pb-5">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
                Projects Manager
              </h1>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700 border border-neutral-200">
                {projects.length} Total
              </span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              Add, edit, reorder, or publish portfolio projects
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {/* GitHub Publish Button */}
            {adminStatus?.githubConfigured && (
              <button
                type="button"
                onClick={handleManualPublish}
                disabled={isPublishing}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-neutral-700 bg-white hover:bg-neutral-50 border border-neutral-300 rounded-xl transition-colors disabled:opacity-50"
                title="Commit all latest project changes to GitHub repository"
              >
                <FolderGit2 className={`w-3.5 h-3.5 ${isPublishing ? 'animate-spin' : ''}`} />
                <span>{isPublishing ? 'Publishing...' : 'Sync to GitHub'}</span>
              </button>
            )}

            {/* Add Project Button */}
            <Link
              to="/admin/projects/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-black text-white text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
            >
              <Plus className="w-4 h-4" />
              <span>Add Project</span>
            </Link>
          </div>
        </div>

        {/* GitHub Publish Feedback Banner */}
        {publishFeedback && (
          <div
            className={`p-4 rounded-xl border flex items-start justify-between gap-3 text-xs sm:text-sm ${
              publishFeedback.success
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            <div className="flex items-center gap-2">
              {publishFeedback.success ? (
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              )}
              <span>{publishFeedback.message}</span>
            </div>
            {publishFeedback.url && (
              <a
                href={publishFeedback.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-semibold underline text-emerald-900"
              >
                <span>View Commit</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
            )}
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs sm:text-sm text-red-700 flex items-center justify-between">
            <span>{errorMessage}</span>
            <button
              onClick={fetchProjects}
              className="font-medium underline hover:text-red-900"
            >
              Retry
            </button>
          </div>
        )}

        {/* Projects List */}
        {isLoading ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-6 h-6 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-neutral-500 font-medium">Loading project records...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-white border border-neutral-200/90 rounded-2xl p-12 text-center space-y-4">
            <p className="text-sm text-neutral-500 font-medium">No projects found in database.</p>
            <Link
              to="/admin/projects/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white text-xs font-semibold rounded-xl hover:bg-black transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create First Project</span>
            </Link>
          </div>
        ) : (
          <div className="bg-white border border-neutral-200/90 rounded-2xl overflow-hidden divide-y divide-neutral-200/80">
            {projects.map((project, index) => (
              <div
                key={project.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-neutral-50/50 transition-colors"
              >
                {/* Project Info & Thumbnail */}
                <div className="flex items-start sm:items-center gap-3.5 sm:gap-4 flex-1 min-w-0">
                  {/* Thumbnail */}
                  <div className="w-16 h-12 sm:w-20 sm:h-14 rounded-lg bg-neutral-100 border border-neutral-200 overflow-hidden shrink-0">
                    <img
                      src={project.coverImage}
                      alt={project.title}
                      className="w-full h-full object-cover object-top"
                      loading="lazy"
                    />
                  </div>

                  {/* Title & Metadata */}
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm sm:text-base font-semibold text-neutral-900 truncate">
                        {project.title}
                      </h3>
                      <span className="text-[11px] font-mono text-neutral-400">
                        /{project.slug}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-neutral-500 flex-wrap">
                      {project.company ? (
                        <span className="font-medium text-neutral-700">
                          For: {project.company}
                        </span>
                      ) : (
                        <span className="text-neutral-400">Independent</span>
                      )}
                      <span>•</span>
                      <span className="px-2 py-0.5 text-[10px] font-medium bg-neutral-100 text-neutral-700 rounded-md">
                        {project.type}
                      </span>
                      <span>•</span>
                      <span className="font-mono text-neutral-600">{project.year}</span>
                      <span>•</span>
                      <span className="px-2 py-0.5 text-[10px] font-medium border border-neutral-200 bg-neutral-50 text-neutral-800 rounded-md">
                        {project.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions: Edit, Delete, View Detail */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <Link
                    to={`/project/${project.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                    title="View public detail page"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>

                  <Link
                    to={`/admin/projects/edit/${project.id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:text-neutral-950 bg-neutral-100 hover:bg-neutral-200/80 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => setProjectToDelete(project)}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {projectToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white border border-neutral-200 rounded-2xl max-w-md w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-neutral-900">
                  Delete Project
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Are you sure you want to delete{' '}
                  <strong className="text-neutral-900">{projectToDelete.title}</strong>? This will remove it from the public portfolio.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => setProjectToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-medium text-neutral-600 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200/70 rounded-xl transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Confirm Delete</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

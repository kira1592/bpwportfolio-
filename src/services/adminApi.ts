import { Project } from '../types';

const TOKEN_STORAGE_KEY = 'portfolio_admin_token';

export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setStoredToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } catch {}
}

export function removeStoredToken(): void {
  try {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch {}
}

function getAuthHeaders(): HeadersInit {
  const token = getStoredToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export interface AdminStatus {
  githubConfigured: boolean;
  githubOwner: string | null;
  githubRepo: string | null;
  githubBranch: string;
  passwordHashConfigured: boolean;
}

export async function adminLogin(password: string): Promise<{ success: boolean; token?: string; error?: string; lockoutSeconds?: number }> {
  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    const data = await res.json();
    if (!res.ok) {
      return {
        success: false,
        error: data.error || 'Authentication failed',
        lockoutSeconds: data.lockoutSeconds,
      };
    }

    if (data.token) {
      setStoredToken(data.token);
    }

    return { success: true, token: data.token };
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error during login' };
  }
}

export async function adminVerifySession(): Promise<boolean> {
  const token = getStoredToken();
  if (!token) return false;

  try {
    const res = await fetch('/api/admin/verify', {
      headers: getAuthHeaders(),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function adminGetStatus(): Promise<AdminStatus | null> {
  try {
    const res = await fetch('/api/admin/status');
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function adminGetProjects(): Promise<Project[]> {
  const res = await fetch('/api/admin/projects', {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    throw new Error('Failed to load projects');
  }
  return await res.json();
}

export async function adminAddProject(project: Partial<Project>): Promise<{ success: boolean; project?: Project; error?: string; errors?: Record<string, string>; githubSynced?: boolean; githubError?: string }> {
  try {
    const res = await fetch('/api/admin/projects', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(project),
    });

    const data = await res.json();
    if (!res.ok) {
      return {
        success: false,
        error: data.error || 'Failed to create project',
        errors: data.errors,
      };
    }

    return {
      success: true,
      project: data.project,
      githubSynced: data.githubSynced,
      githubError: data.githubError,
    };
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error' };
  }
}

export async function adminUpdateProject(id: string, project: Partial<Project>): Promise<{ success: boolean; project?: Project; error?: string; errors?: Record<string, string>; githubSynced?: boolean; githubError?: string }> {
  try {
    const res = await fetch(`/api/admin/projects/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(project),
    });

    const data = await res.json();
    if (!res.ok) {
      return {
        success: false,
        error: data.error || 'Failed to update project',
        errors: data.errors,
      };
    }

    return {
      success: true,
      project: data.project,
      githubSynced: data.githubSynced,
      githubError: data.githubError,
    };
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error' };
  }
}

export async function adminDeleteProject(id: string): Promise<{ success: boolean; error?: string; githubSynced?: boolean; githubError?: string }> {
  try {
    const res = await fetch(`/api/admin/projects/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    const data = await res.json();
    if (!res.ok) {
      return {
        success: false,
        error: data.error || 'Failed to delete project',
      };
    }

    return {
      success: true,
      githubSynced: data.githubSynced,
      githubError: data.githubError,
    };
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error' };
  }
}

export async function adminUploadImage(slug: string, fileName: string, base64Data: string): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const res = await fetch('/api/admin/upload', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ slug, fileName, base64Data }),
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error || 'Image upload failed' };
    }

    return { success: true, url: data.url };
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error during upload' };
  }
}

export async function adminPublishToGitHub(message?: string): Promise<{ success: boolean; commitUrl?: string; error?: string }> {
  try {
    const res = await fetch('/api/admin/publish-github', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ message }),
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error || 'GitHub publish failed' };
    }

    return { success: true, commitUrl: data.commitUrl };
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error' };
  }
}

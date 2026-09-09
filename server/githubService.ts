import fs from 'fs';
import path from 'path';

interface GitHubConfig {
  token?: string;
  owner?: string;
  repo?: string;
  branch: string;
}

export function getGitHubConfig(): GitHubConfig {
  return {
    token: process.env.GITHUB_TOKEN,
    owner: process.env.GITHUB_OWNER,
    repo: process.env.GITHUB_REPO,
    branch: process.env.GITHUB_BRANCH || 'main',
  };
}

export function isGitHubConfigured(): boolean {
  const config = getGitHubConfig();
  return Boolean(config.token && config.owner && config.repo);
}

/**
 * Commits src/data/projects.ts to the configured GitHub repository.
 */
export async function commitProjectsToGitHub(commitMessage: string = 'Update portfolio projects via Admin Editor'): Promise<{ success: boolean; commitUrl?: string; error?: string }> {
  const config = getGitHubConfig();

  if (!config.token || !config.owner || !config.repo) {
    return {
      success: false,
      error: 'GitHub credentials not configured. Please set GITHUB_TOKEN, GITHUB_OWNER, and GITHUB_REPO in server environment.',
    };
  }

  try {
    const projectsFilePath = path.join(process.cwd(), 'src', 'data', 'projects.ts');
    const fileContent = fs.readFileSync(projectsFilePath, 'utf-8');
    const contentBase64 = Buffer.from(fileContent, 'utf-8').toString('base64');
    const targetPath = 'src/data/projects.ts';

    // 1. Get current file SHA on GitHub
    const getFileUrl = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${targetPath}?ref=${config.branch}`;
    const getRes = await fetch(getFileUrl, {
      headers: {
        Authorization: `Bearer ${config.token}`,
        Accept: 'application/vnd.github+json',
        'User-Agent': 'Portfolio-Admin-Editor',
      },
    });

    let sha: string | undefined = undefined;
    if (getRes.ok) {
      const data = (await getRes.json()) as { sha: string };
      sha = data.sha;
    }

    // 2. Put file to commit update
    const putFileUrl = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${targetPath}`;
    const putRes = await fetch(putFileUrl, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${config.token}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'User-Agent': 'Portfolio-Admin-Editor',
      },
      body: JSON.stringify({
        message: commitMessage,
        content: contentBase64,
        branch: config.branch,
        ...(sha ? { sha } : {}),
      }),
    });

    if (!putRes.ok) {
      const errData = await putRes.json();
      return {
        success: false,
        error: `GitHub API error (${putRes.status}): ${JSON.stringify(errData)}`,
      };
    }

    const resData = (await putRes.json()) as { commit?: { html_url?: string } };
    return {
      success: true,
      commitUrl: resData.commit?.html_url,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Failed to communicate with GitHub API',
    };
  }
}

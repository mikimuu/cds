export interface GitHubCommit {
  sha?: string
  url?: string
  author?: {
    date?: string
    name?: string
    email?: string
  }
  committer?: {
    date?: string
    name?: string
    email?: string
  }
  message?: string
}

export interface GitHubFile {
  name: string
  path: string
  sha: string
  size: number
  url: string
  html_url: string
  git_url: string
  download_url: string | null
  type: 'file' | 'dir'
  content?: string
  encoding?: 'base64' | 'utf-8'
  _links: {
    self: string
    git: string
    html: string
  }
}

export interface GitHubContent {
  content: string
  sha: string
  encoding: 'base64' | 'utf-8'
  path: string
  name: string
  size: number
}

export interface CreateFileRequest {
  path: string
  content: string
  message: string
  branch?: string
  committer?: {
    name: string
    email: string
    date?: string
  }
  author?: {
    name: string
    email: string
    date?: string
  }
}

export interface UpdateFileRequest extends CreateFileRequest {
  sha: string
}

export interface GitHubAPIConfig {
  owner: string
  repo: string
  branch: string
  appId: number
  privateKey: string
  installationId: number
}

export interface GitHubAPIResponse<T = any> {
  data: T
  status: number
  headers: Record<string, string>
}

export interface GitHubError extends Error {
  status: number
  response?: {
    data: any
    headers: Record<string, string>
  }
}
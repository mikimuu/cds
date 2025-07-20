import { Octokit } from '@octokit/rest'
import { createAppAuth } from '@octokit/auth-app'
import {
  GitHubAPIConfig,
  GitHubFile,
  GitHubContent,
  CreateFileRequest,
  UpdateFileRequest,
  GitHubCommit,
  GitHubError
} from '@/types/github'

export class GitHubClient {
  private octokit: Octokit
  private config: GitHubAPIConfig

  constructor(config: GitHubAPIConfig) {
    this.config = config
    
    // GitHub App認証を設定
    const authStrategy = createAppAuth({
      appId: config.appId,
      privateKey: config.privateKey,
      installationId: config.installationId,
    })

    this.octokit = new Octokit({
      authStrategy,
    })
  }

  /**
   * ファイルの内容を取得
   */
  async getFileContent(path: string): Promise<GitHubContent> {
    try {
      const response = await this.octokit.rest.repos.getContent({
        owner: this.config.owner,
        repo: this.config.repo,
        path,
        ref: this.config.branch,
      })

      const data = response.data as GitHubFile
      
      if (data.type !== 'file') {
        throw new Error(`Path ${path} is not a file`)
      }

      if (!data.content || !data.encoding) {
        throw new Error(`File ${path} has no content`)
      }

      // Base64エンコードされたコンテンツをデコード
      const content = data.encoding === 'base64' 
        ? Buffer.from(data.content, 'base64').toString('utf-8')
        : data.content

      return {
        content,
        sha: data.sha,
        encoding: data.encoding,
        path: data.path,
        name: data.name,
        size: data.size,
      }
    } catch (error) {
      throw this.handleError(error, `Failed to get file content: ${path}`)
    }
  }

  /**
   * 新しいファイルを作成
   */
  async createFile(request: CreateFileRequest): Promise<GitHubCommit> {
    try {
      // コンテンツをBase64エンコード
      const content = Buffer.from(request.content, 'utf-8').toString('base64')

      const response = await this.octokit.rest.repos.createOrUpdateFileContents({
        owner: this.config.owner,
        repo: this.config.repo,
        path: request.path,
        message: request.message,
        content,
        branch: request.branch || this.config.branch,
        committer: request.committer,
        author: request.author,
      })

      return response.data.commit
    } catch (error) {
      throw this.handleError(error, `Failed to create file: ${request.path}`)
    }
  }

  /**
   * 既存ファイルを更新
   */
  async updateFile(request: UpdateFileRequest): Promise<GitHubCommit> {
    try {
      // コンテンツをBase64エンコード
      const content = Buffer.from(request.content, 'utf-8').toString('base64')

      const response = await this.octokit.rest.repos.createOrUpdateFileContents({
        owner: this.config.owner,
        repo: this.config.repo,
        path: request.path,
        message: request.message,
        content,
        sha: request.sha,
        branch: request.branch || this.config.branch,
        committer: request.committer,
        author: request.author,
      })

      return response.data.commit
    } catch (error) {
      throw this.handleError(error, `Failed to update file: ${request.path}`)
    }
  }

  /**
   * ディレクトリ内のファイル一覧を取得
   */
  async listFiles(directory: string = ''): Promise<GitHubFile[]> {
    try {
      const response = await this.octokit.rest.repos.getContent({
        owner: this.config.owner,
        repo: this.config.repo,
        path: directory,
        ref: this.config.branch,
      })

      const data = response.data
      
      if (!Array.isArray(data)) {
        throw new Error(`Path ${directory} is not a directory`)
      }

      return data as GitHubFile[]
    } catch (error) {
      throw this.handleError(error, `Failed to list files in directory: ${directory}`)
    }
  }

  /**
   * ファイルが存在するかチェック
   */
  async fileExists(path: string): Promise<boolean> {
    try {
      await this.getFileContent(path)
      return true
    } catch (error) {
      const githubError = error as GitHubError
      if (githubError.status === 404) {
        return false
      }
      throw error
    }
  }

  /**
   * ファイルを削除
   */
  async deleteFile(path: string, message: string): Promise<GitHubCommit> {
    try {
      // まずファイルのSHAを取得
      const fileContent = await this.getFileContent(path)

      const response = await this.octokit.rest.repos.deleteFile({
        owner: this.config.owner,
        repo: this.config.repo,
        path,
        message,
        sha: fileContent.sha,
        branch: this.config.branch,
      })

      return response.data.commit
    } catch (error) {
      throw this.handleError(error, `Failed to delete file: ${path}`)
    }
  }

  /**
   * 画像ファイルをアップロード
   */
  async uploadImage(
    buffer: Buffer,
    filename: string,
    directory: string = 'public/static/images'
  ): Promise<{ url: string; path: string; commit: GitHubCommit }> {
    try {
      // ファイル名にタイムスタンプを追加してユニークにする
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const uniqueFilename = `${timestamp}-${filename}`
      const path = `${directory}/${uniqueFilename}`
      
      // 画像をBase64エンコード
      const content = buffer.toString('base64')

      const response = await this.octokit.rest.repos.createOrUpdateFileContents({
        owner: this.config.owner,
        repo: this.config.repo,
        path,
        message: `Upload image: ${uniqueFilename}`,
        content,
        branch: this.config.branch,
      })

      // 公開URLを生成
      const url = `/static/images/${uniqueFilename}`

      return {
        url,
        path,
        commit: response.data.commit,
      }
    } catch (error) {
      throw this.handleError(error, `Failed to upload image: ${filename}`)
    }
  }

  /**
   * Rate limit情報を取得
   */
  async getRateLimit() {
    try {
      const response = await this.octokit.rest.rateLimit.get()
      return response.data
    } catch (error) {
      throw this.handleError(error, 'Failed to get rate limit')
    }
  }

  /**
   * エラーハンドリング
   */
  private handleError(error: any, message: string): GitHubError {
    const githubError = new Error(message) as GitHubError
    
    if (error.status) {
      githubError.status = error.status
    }
    
    if (error.response) {
      githubError.response = {
        data: error.response.data,
        headers: error.response.headers,
      }
    }

    // Rate limit エラーの場合は特別な処理
    if (error.status === 403 && error.response?.headers?.['x-ratelimit-remaining'] === '0') {
      githubError.message = `${message} (Rate limit exceeded)`
    }

    return githubError
  }
}

/**
 * 環境変数からGitHub APIクライアントを作成
 */
export function createGitHubClient(): GitHubClient {
  const config: GitHubAPIConfig = {
    owner: process.env.GITHUB_OWNER || '',
    repo: process.env.GITHUB_REPO || '',
    branch: process.env.GITHUB_BRANCH || 'main',
    appId: parseInt(process.env.GITHUB_APP_ID || '0'),
    privateKey: process.env.GITHUB_PRIVATE_KEY || '',
    installationId: parseInt(process.env.GITHUB_INSTALLATION_ID || '0'),
  }

  // 必要な環境変数の検証
  const requiredEnvVars = ['GITHUB_OWNER', 'GITHUB_REPO', 'GITHUB_APP_ID', 'GITHUB_PRIVATE_KEY', 'GITHUB_INSTALLATION_ID']
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName])
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`)
  }

  return new GitHubClient(config)
}
const BaseViewModel = require('./base/BaseViewModel.js')
const Response = require('./base/Response.js')
const ServiceFactory = require('../services/ServiceFactory.js')
const githubHelper = require('../utils/githubHelper.js')
const GitHubRepo = require('../models/GitHubRepo.js')

/**
 * GitHub ViewModel
 * 封装 GitHub 相关的业务逻辑
 */
class GitHubViewModel extends BaseViewModel {
  constructor() {
    super()
    this.gitHubService = ServiceFactory.getGitHubService()
  }

  /**
   * 搜索 GitHub 仓库
   * @param {string} keyword - 搜索关键词
   * @param {number} page - 页码
   * @returns {Promise<Response>}
   */
  async searchGitHub(keyword, page) {
    try {
      const data = await githubHelper.searchGitHub(keyword, page)
      return Response.success(data)
    } catch (error) {
      const message = this.handleError(error, '搜索失败')
      return Response.error(message)
    }
  }

  /**
   * 获取 GitHub 仓库详情
   * @param {string} fullName - 仓库全名 (owner/repo)
   * @returns {Promise<Response>}
   */
  async getGitHubRepo(fullName) {
    try {
      const data = await githubHelper.getGitHubRepo(fullName)
      const repo = this._convertToGitHubRepo(data)
      return Response.success(repo ? repo.toDetail() : null)
    } catch (error) {
      const message = this.handleError(error, '获取仓库详情失败')
      return Response.error(message)
    }
  }

  /**
   * 获取 GitHub 仓库 README
   * @param {string} fullName - 仓库全名 (owner/repo)
   * @returns {Promise<Response>}
   */
  async getGitHubReadme(fullName) {
    try {
      const readme = await githubHelper.getGitHubReadme(fullName)
      return Response.success(readme)
    } catch (error) {
      const message = this.handleError(error, '获取README失败')
      return Response.error(message)
    }
  }

  /**
   * 获取 GitHub 仓库内容
   * @param {string} fullName - 仓库全名 (owner/repo)
   * @param {string} path - 文件路径
   * @param {string} ref - 分支名
   * @returns {Promise<Response>}
   */
  async getGitHubContents(fullName, path, ref) {
    try {
      const data = await githubHelper.getGitHubContents(fullName, path, ref)
      return Response.success(data)
    } catch (error) {
      const message = this.handleError(error, '获取仓库内容失败')
      return Response.error(message)
    }
  }

  /**
   * 获取 GitHub 仓库分支列表
   * @param {string} fullName - 仓库全名 (owner/repo)
   * @returns {Promise<Response>}
   */
  async getGitHubBranches(fullName) {
    try {
      const data = await githubHelper.getGitHubBranches(fullName)
      return Response.success(data)
    } catch (error) {
      const message = this.handleError(error, '获取分支列表失败')
      return Response.error(message)
    }
  }

  /**
   * 获取 GitHub 仓库 Issues
   * @param {string} fullName - 仓库全名 (owner/repo)
   * @param {string} state - 状态 (open/closed)
   * @param {number} page - 页码
   * @returns {Promise<Response>}
   */
  async getGitHubIssues(fullName, state, page) {
    try {
      const data = await githubHelper.getGitHubIssues(fullName, state, page)
      return Response.success(data)
    } catch (error) {
      const message = this.handleError(error, '获取Issues失败')
      return Response.error(message)
    }
  }

  /**
   * 手动同步文章
   * @param {string} articleUrl - 文章URL
   * @param {string} defaultImageUrl - 默认图片URL
   * @returns {Promise<Response>}
   */
  async manualSyncArticle(articleUrl, defaultImageUrl) {
    try {
      // 涉及数据库操作，依然使用云服务
      const result = await this.gitHubService.manualSyncArticle(articleUrl, defaultImageUrl)
      return result
    } catch (error) {
      const message = this.handleError(error, '同步文章失败')
      return Response.error(message)
    }
  }

  /**
   * 将 GitHub API 数据转换为 GitHubRepo 对象
   * @private
   */
  _convertToGitHubRepo(apiData) {
    if (!apiData) return null
    
    return new GitHubRepo({
      id: apiData.id,
      name: apiData.name,
      fullName: apiData.full_name,
      description: apiData.description || '',
      stars: apiData.stargazers_count || 0,
      forks: apiData.forks_count || 0,
      watchers: apiData.watchers_count || 0,
      language: apiData.language || '',
      owner: {
        login: apiData.owner?.login || '',
        avatarUrl: apiData.owner?.avatar_url || ''
      },
      htmlUrl: apiData.html_url || '',
      createdAt: apiData.created_at || '',
      updatedAt: apiData.updated_at || ''
    })
  }
}

module.exports = GitHubViewModel


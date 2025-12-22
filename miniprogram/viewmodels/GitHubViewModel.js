const BaseViewModel = require('./base/BaseViewModel.js')
const Response = require('./base/Response.js')
const ServiceFactory = require('../services/ServiceFactory.js')

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
      // Service 直接返回 Response 对象，包含原始的 items 和 total_count
      return await this.gitHubService.searchGitHub(keyword, page)
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
      const repo = await this.gitHubService.getGitHubRepo(fullName)
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
      const result = await this.gitHubService.getGitHubReadme(fullName)
      // Service 已经返回 Response 对象
      return result
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
      const result = await this.gitHubService.getGitHubContents(fullName, path, ref)
      // Service 已经返回 Response 对象
      return result
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
      const result = await this.gitHubService.getGitHubBranches(fullName)
      // Service 已经返回 Response 对象
      return result
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
      const result = await this.gitHubService.getGitHubIssues(fullName, state, page)
      // Service 已经返回 Response 对象
      return result
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
      const result = await this.gitHubService.manualSyncArticle(articleUrl, defaultImageUrl)
      // Service 已经返回 Response 对象
      return result
    } catch (error) {
      const message = this.handleError(error, '同步文章失败')
      return Response.error(message)
    }
  }
}

module.exports = GitHubViewModel


const IGitHubService = require('../interfaces/IGitHubService.js')
const BaseCloudService = require('./BaseCloudService.js')
const GitHubRepo = require('../../models/GitHubRepo.js')
const Response = require('../../viewmodels/base/Response.js')

/**
 * GitHub 服务 - 云开发实现
 */
class CloudGitHubService extends BaseCloudService {
  constructor() {
    super()
  }

  /**
   * 搜索 GitHub 仓库
   * 直接返回原始数据，因为 GitHub API 字段名与 WXML 绑定一致
   */
  async searchGitHub(keyword, page) {
    return await this.callFunction('syncService', {
      action: 'searchGitHub',
      keyword: keyword,
      page: page
    })
  }

  /**
   * 获取 GitHub 仓库详情
   */
  async getGitHubRepo(fullName) {
    const response = await this.callFunction('syncService', {
      action: 'getGitHubRepo',
      fullName: fullName
    })

    if (response.success && response.data) {
      return this._convertToGitHubRepo(response.data)
    }
    return null
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

  /**
   * 获取 GitHub 仓库 README
   */
  async getGitHubReadme(fullName) {
    return await this.callFunction('syncService', {
      action: 'getGitHubReadme',
      fullName: fullName
    })
  }

  /**
   * 获取 GitHub 仓库内容
   */
  async getGitHubContents(fullName, path, ref) {
    return await this.callFunction('syncService', {
      action: 'getGitHubContents',
      fullName: fullName,
      path: path,
      ref: ref
    })
  }

  /**
   * 获取 GitHub 仓库分支列表
   */
  async getGitHubBranches(fullName) {
    return await this.callFunction('syncService', {
      action: 'getGitHubBranches',
      fullName: fullName
    })
  }

  /**
   * 获取 GitHub 仓库 Issues
   */
  async getGitHubIssues(fullName, state, page) {
    return await this.callFunction('syncService', {
      action: 'getGitHubIssues',
      fullName: fullName,
      state: state,
      page: page
    })
  }

  /**
   * 手动同步文章
   */
  async manualSyncArticle(articleUrl, defaultImageUrl) {
    return await this.callFunction('syncService', {
      action: 'manualSyncArticle',
      articleUrl: articleUrl,
      defaultImageUrl: defaultImageUrl
    })
  }
}

module.exports = CloudGitHubService


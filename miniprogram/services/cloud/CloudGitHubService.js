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


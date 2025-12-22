/**
 * GitHub 仓库数据模型
 * 纯粹的数据结构定义，不绑定特定数据源
 * 数据转换逻辑由各个 Service 实现负责
 */
class GitHubRepo {
  constructor(data = {}) {
    this.id = data.id || ''
    this.name = data.name || ''
    this.fullName = data.fullName || ''
    this.description = data.description || ''
    this.stars = data.stars || 0
    this.forks = data.forks || 0
    this.watchers = data.watchers || 0
    this.language = data.language || ''
    this.owner = data.owner || {}
    this.htmlUrl = data.htmlUrl || ''
    this.createdAt = data.createdAt || ''
    this.updatedAt = data.updatedAt || ''
  }

  /**
   * 转换为列表项格式
   * @returns {Object}
   */
  toListItem() {
    return {
      id: this.id,
      name: this.name,
      fullName: this.fullName,
      description: this.description,
      stars: this.stars,
      language: this.language,
      owner: this.owner
    }
  }

  /**
   * 转换为详情格式
   * @returns {Object}
   */
  toDetail() {
    return {
      id: this.id,
      name: this.name,
      fullName: this.fullName,
      description: this.description,
      stars: this.stars,
      forks: this.forks,
      watchers: this.watchers,
      language: this.language,
      owner: this.owner,
      htmlUrl: this.htmlUrl,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }
  }
}

module.exports = GitHubRepo

/**
 * GitHub 服务接口
 * 所有 GitHub 相关的服务实现都必须实现此接口
 */
class IGitHubService {
  /**
   * 搜索 GitHub 仓库
   * @param {string} keyword - 搜索关键词
   * @param {number} page - 页码
   * @returns {Promise<Array<GitHubRepo>>}
   */
  async searchGitHub(keyword, page) {
    throw new Error('Method not implemented: searchGitHub')
  }

  /**
   * 获取 GitHub 仓库详情
   * @param {string} fullName - 仓库全名 (owner/repo)
   * @returns {Promise<GitHubRepo>}
   */
  async getGitHubRepo(fullName) {
    throw new Error('Method not implemented: getGitHubRepo')
  }

  /**
   * 获取 GitHub 仓库 README
   * @param {string} fullName - 仓库全名 (owner/repo)
   * @returns {Promise<Object>}
   */
  async getGitHubReadme(fullName) {
    throw new Error('Method not implemented: getGitHubReadme')
  }

  /**
   * 获取 GitHub 仓库内容
   * @param {string} fullName - 仓库全名 (owner/repo)
   * @param {string} path - 文件路径
   * @param {string} ref - 分支名
   * @returns {Promise<Object>}
   */
  async getGitHubContents(fullName, path, ref) {
    throw new Error('Method not implemented: getGitHubContents')
  }

  /**
   * 获取 GitHub 仓库分支列表
   * @param {string} fullName - 仓库全名 (owner/repo)
   * @returns {Promise<Array>}
   */
  async getGitHubBranches(fullName) {
    throw new Error('Method not implemented: getGitHubBranches')
  }

  /**
   * 获取 GitHub 仓库 Issues
   * @param {string} fullName - 仓库全名 (owner/repo)
   * @param {string} state - 状态 (open/closed)
   * @param {number} page - 页码
   * @returns {Promise<Array>}
   */
  async getGitHubIssues(fullName, state, page) {
    throw new Error('Method not implemented: getGitHubIssues')
  }

  /**
   * 手动同步文章
   * @param {string} articleUrl - 文章URL
   * @param {string} defaultImageUrl - 默认图片URL
   * @returns {Promise<Object>}
   */
  async manualSyncArticle(articleUrl, defaultImageUrl) {
    throw new Error('Method not implemented: manualSyncArticle')
  }
}

module.exports = IGitHubService


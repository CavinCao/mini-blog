const IGitHubService = require('../interfaces/IGitHubService.js')
const BaseMockService = require('./BaseMockService.js')
const GitHubRepo = require('../../models/GitHubRepo.js')

/**
 * GitHub 服务 - Mock 实现
 */
class MockGitHubService extends BaseMockService {
  constructor() {
    super()
    this.repos = this._generateMockRepos()
  }

  _generateMockRepos() {
    const repos = []
    for (let i = 1; i <= 10; i++) {
      repos.push({
        id: i,
        name: `mini-blog-${i}`,
        full_name: `Cavin/mini-blog-${i}`,
        description: `这是第 ${i} 个模拟的 GitHub 仓库，是一个基于微信小程序云开发的博客系统实现。`,
        html_url: 'https://github.com/Cavin/mini-blog',
        stargazers_count: Math.floor(Math.random() * 1000),
        forks_count: Math.floor(Math.random() * 200),
        language: 'JavaScript',
        owner: {
          login: 'Cavin',
          avatar_url: 'https://i.pravatar.cc/150?u=cavin'
        }
      })
    }
    return repos
  }

  async searchGitHub(keyword, page) {
    await this._simulateDelay()
    const filtered = keyword ? this.repos.filter(r => r.name.includes(keyword)) : this.repos
    return filtered.map(r => new GitHubRepo(r))
  }

  async getGitHubRepo(fullName) {
    await this._simulateDelay()
    const repo = this.repos.find(r => r.full_name === fullName)
    return repo ? new GitHubRepo(repo) : null
  }

  async getGitHubReadme(fullName) {
    await this._simulateDelay()
    return {
      content: 'IyBNb2NrIFJFQURNRQoK5pys6aG555uu5piv5LiA5Liq5qih5ouf5pWw5o2u...' // Base64 for "# Mock README"
    }
  }

  async getGitHubContents(fullName, path, ref) {
    await this._simulateDelay()
    return []
  }

  async getGitHubBranches(fullName) {
    await this._simulateDelay()
    return [{ name: 'master' }, { name: 'dev' }]
  }

  async getGitHubIssues(fullName, state, page) {
    await this._simulateDelay()
    return [
      { id: 1, title: 'Mock Issue 1', state: 'open', user: { login: 'user1' } }
    ]
  }

  async manualSyncArticle(articleUrl, defaultImageUrl) {
    await this._simulateDelay()
    return this._success({
      id: 'post_sync_' + Date.now(),
      title: '同步的文章'
    })
  }
}

module.exports = MockGitHubService


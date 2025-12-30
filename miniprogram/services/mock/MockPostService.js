const IPostService = require('../interfaces/IPostService.js')
const BaseMockService = require('./BaseMockService.js')
const Post = require('../../models/Post.js')

/**
 * 文章服务 - Mock 实现
 */
class MockPostService extends BaseMockService {
  constructor() {
    super()
    this.posts = this._generateMockPosts()
    this.relatedPosts = []
  }

  _generateMockPosts() {
    const posts = []
    const classifies = ['技术', '生活']
    const labels = [['JavaScript', '小程序'], ['Vue']]

    for (let i = 1; i <= 25; i++) {
      posts.push({
        _id: `post_${i}`,
        title: `Mock 文章标题 ${i}: 深入理解 MVVM 架构在小程序中的应用`,
        author: 'Cavin',
        digest: `这是第 ${i} 篇文章的摘要，详细介绍了如何通过解耦 Page 和 Service 来实现更健壮的小程序开发模式...`,
        content: `# Mock 文章正文 ${i}\n\n## 什么是 MVVM\n\nMVVM (Model-View-ViewModel) 是一种软件架构模式...\n\n### 优势\n\n1. 职责清晰\n2. 易于测试\n3. 更好的复用性\n\n> 本文由 Mock Service 自动生成。`,
        defaultImageUrl: 'https://picsum.photos/400/200?random=' + i,
        classify: classifies[i % classifies.length],
        label: labels[i % labels.length],
        isShow: 1,
        createTime: new Date(Date.now() - i * 86400000).getTime(),
        updateTime: new Date().getTime(),
        totalVisits: Math.floor(Math.random() * 1000),
        totalComments: Math.floor(Math.random() * 50),
        totalZans: Math.floor(Math.random() * 100),
        totalCollection: Math.floor(Math.random() * 80)
      })
    }
    return posts
  }

  async getPostsList(params) {
    await this._simulateDelay()
    const { page = 1, filter = '', isShow = 1, label = '', limit = 10 } = params
    
    let filtered = this.posts
    
    // 处理过滤条件
    if (typeof filter === 'string' && filter !== '') {
      filtered = filtered.filter(p => p.title.includes(filter))
    } else if (typeof filter === 'object' && filter !== null) {
      if (filter.title) {
        filtered = filtered.filter(p => p.title.includes(filter.title))
      }
      if (filter.classify) {
        filtered = filtered.filter(p => p.classify === filter.classify)
      }
      if (filter.isShow !== undefined) {
        filtered = filtered.filter(p => p.isShow === filter.isShow)
      }
    }

    if (isShow !== -1 && (typeof filter !== 'object' || filter.isShow === undefined)) {
      filtered = filtered.filter(p => p.isShow === isShow)
    }
    
    if (label) {
      filtered = filtered.filter(p => p.label.includes(label))
    }

    const start = (page - 1) * limit
    const result = filtered.slice(start, start + limit)
    return result.map(p => new Post({
      id: p._id,
      ...p
    }))
  }

  async getNewPostsList(params) {
    return this.getPostsList(params)
  }

  async getPostsById(id) {
    await this._simulateDelay()
    const post = this.posts.find(p => p._id === id)
    return post ? new Post({ id: post._id, ...post }) : null
  }

  async getPostDetail(id) {
    await this._simulateDelay()
    const post = this.posts.find(p => p._id === id)
    if (!post) return null
    return new Post({ id: post._id, ...post })
  }

  async upsertPost(id, postData) {
    await this._simulateDelay()
    if (id) {
      const index = this.posts.findIndex(p => p._id === id)
      if (index > -1) {
        this.posts[index] = { ...this.posts[index], ...postData, updateTime: Date.now() }
        return this._success(id)
      }
    } else {
      const newId = 'post_' + Date.now()
      this.posts.unshift({ _id: newId, ...postData, createTime: Date.now(), updateTime: Date.now() })
      return this._success(newId)
    }
    return this._error('更新失败')
  }

  async deletePost(id) {
    await this._simulateDelay()
    this.posts = this.posts.filter(p => p._id !== id)
    return this._success()
  }

  async updatePostStatus(id, isShow) {
    await this._simulateDelay()
    const post = this.posts.find(p => p._id === id)
    if (post) {
      post.isShow = isShow
      return this._success()
    }
    return this._error()
  }

  async updatePostClassify(id, classify) {
    await this._simulateDelay()
    const post = this.posts.find(p => p._id === id)
    if (post) {
      post.classify = classify
      return this._success()
    }
    return this._error()
  }

  async updatePostLabel(id, label) {
    await this._simulateDelay()
    const post = this.posts.find(p => p._id === id)
    if (post) {
      post.label = label
      return this._success()
    }
    return this._error()
  }

  async updateBatchPostsClassify(classify, operate, posts) {
    await this._simulateDelay()
    posts.forEach(id => {
      const post = this.posts.find(p => p._id === id)
      if (post) post.classify = classify
    })
    return this._success()
  }

  async updateBatchPostsLabel(label, operate, posts) {
    await this._simulateDelay()
    posts.forEach(id => {
      const post = this.posts.find(p => p._id === id)
      if (post) post.label = [label]
    })
    return this._success()
  }

  async getPostRelated(where, page) {
    await this._simulateDelay()
    return this.relatedPosts.slice((page - 1) * 10, page * 10)
  }

  async addPostCollection(data) {
    await this._simulateDelay()
    this.relatedPosts.unshift({ ...data, createTime: Date.now(), type: 1 })
    return this._success()
  }

  async addPostZan(data) {
    await this._simulateDelay()
    this.relatedPosts.unshift({ ...data, createTime: Date.now(), type: 2 })
    return this._success()
  }

  async deletePostCollectionOrZan(postId, type) {
    await this._simulateDelay()
    this.relatedPosts = this.relatedPosts.filter(p => !(p.postId === postId && p.type === type))
    return this._success()
  }

  async addPostQrCode(postId, timestamp) {
    await this._simulateDelay()
    return this._success({
      fileID: 'mock_qr_code_' + postId
    })
  }

  async getQrCode() {
    await this._simulateDelay()
    return {
      fileList: [{
        tempFileURL: 'https://via.placeholder.com/200x200?text=Mock+Reward+QR'
      }]
    }
  }

  async getReportQrCodeUrl(id) {
    await this._simulateDelay()
    return {
      fileList: [{
        tempFileURL: 'https://via.placeholder.com/200x200?text=Mock+Report+QR'
      }]
    }
  }
}

module.exports = MockPostService


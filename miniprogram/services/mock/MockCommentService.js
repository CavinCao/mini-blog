const ICommentService = require('../interfaces/ICommentService.js')
const BaseMockService = require('./BaseMockService.js')
const Comment = require('../../models/Comment.js')

/**
 * 评论服务 - Mock 实现
 */
class MockCommentService extends BaseMockService {
  constructor() {
    super()
    this.comments = this._generateMockComments()
  }

  _generateMockComments() {
    const comments = []
    for (let i = 1; i <= 20; i++) {
      comments.push({
        _id: `comment_${i}`,
        postId: `post_${Math.floor(i / 5) + 1}`,
        nickName: `用户 ${i}`,
        avatarUrl: `https://i.pravatar.cc/150?u=${i}`,
        content: `这是一条 Mock 评论 ${i}。架构很清晰，学习了！`,
        timestamp: new Date(Date.now() - i * 3600000).getTime(),
        flag: 0,
        childComments: i % 3 === 0 ? [
          {
            _id: `child_${i}`,
            nickName: '作者',
            avatarUrl: 'https://i.pravatar.cc/150?u=author',
            content: `谢谢支持，欢迎交流！`,
            timestamp: Date.now()
          }
        ] : []
      })
    }
    return comments
  }

  async getPostComments(page, postId) {
    await this._simulateDelay()
    const filtered = this.comments.filter(c => c.postId === postId)
    const start = (page - 1) * 10
    const result = filtered.slice(start, start + 10)
    return result.map(c => new Comment({
      id: c._id,
      ...c
    }))
  }

  async getCommentsList(page, flag) {
    await this._simulateDelay()
    let filtered = this.comments
    if (flag !== -1) {
      filtered = filtered.filter(c => c.flag === flag)
    }
    const start = (page - 1) * 10
    const result = filtered.slice(start, start + 10)
    return result.map(c => new Comment({
      id: c._id,
      ...c
    }))
  }

  async addPostComment(content, accept) {
    await this._simulateDelay()
    const newComment = {
      _id: 'comment_' + Date.now(),
      content,
      nickName: 'Mock User',
      avatarUrl: 'https://i.pravatar.cc/150?u=mock',
      timestamp: Date.now(),
      flag: 0,
      childComments: []
    }
    this.comments.unshift(newComment)
    return this._success(newComment)
  }

  async addPostChildComment(id, postId, comments, accept) {
    await this._simulateDelay()
    const parent = this.comments.find(c => c._id === id)
    if (parent) {
      const child = {
        _id: 'child_' + Date.now(),
        ...comments,
        timestamp: Date.now()
      }
      parent.childComments.push(child)
      return this._success(child)
    }
    return this._error('父评论不存在')
  }

  async checkPostComment(content) {
    await this._simulateDelay()
    return this._success({
      pass: true
    })
  }

  async changeCommentFlag(id, flag, postId, count) {
    await this._simulateDelay()
    const comment = this.comments.find(c => c._id === id)
    if (comment) {
      comment.flag = flag
      return this._success()
    }
    return this._error()
  }
}

module.exports = MockCommentService


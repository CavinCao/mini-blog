const BaseViewModel = require('./base/BaseViewModel.js')
const Response = require('./base/Response.js')
const ServiceFactory = require('../services/ServiceFactory.js')

/**
 * 评论 ViewModel
 * 封装评论相关的业务逻辑
 */
class CommentViewModel extends BaseViewModel {
  constructor() {
    super()
    this.commentService = ServiceFactory.getCommentService()
  }

  /**
   * 获取文章评论列表
   * @param {number} page - 页码
   * @param {string} postId - 文章ID
   * @returns {Promise<Response>}
   */
  async getPostComments(page, postId) {
    try {
      const comments = await this.commentService.getPostComments(page, postId)
      
      return Response.success({
        list: comments.map(comment => comment.toListItem()),
        hasMore: comments.length >= 10,
        isEmpty: comments.length === 0 && page === 1
      })
    } catch (error) {
      const message = this.handleError(error, '获取评论列表失败')
      return Response.error(message)
    }
  }

  /**
   * 获取评论列表（管理后台）
   * @param {number} page - 页码
   * @param {number} flag - 状态标记
   * @returns {Promise<Response>}
   */
  async getCommentsList(page, flag) {
    try {
      const comments = await this.commentService.getCommentsList(page, flag)
      
      return Response.success({
        list: comments.map(comment => comment.toDetail()),
        hasMore: comments.length >= 10,
        isEmpty: comments.length === 0 && page === 1
      })
    } catch (error) {
      const message = this.handleError(error, '获取评论列表失败')
      return Response.error(message)
    }
  }

  /**
   * 新增评论
   * @param {string} commentContent - 评论内容
   * @param {Object} accept - 接收人信息
   * @returns {Promise<Response>}
   */
  async addPostComment(commentContent, accept) {
    try {
      const result = await this.commentService.addPostComment(commentContent, accept)
      // Service 已经返回 Response 对象
      return result
    } catch (error) {
      const message = this.handleError(error, '评论失败')
      return Response.error(message)
    }
  }

  /**
   * 新增子评论
   * @param {string} id - 父评论ID
   * @param {string} postId - 文章ID
   * @param {Object} comments - 子评论内容
   * @param {Object} accept - 接收人信息
   * @returns {Promise<Response>}
   */
  async addPostChildComment(id, postId, comments, accept) {
    try {
      const result = await this.commentService.addPostChildComment(id, postId, comments, accept)
      // Service 已经返回 Response 对象
      return result
    } catch (error) {
      const message = this.handleError(error, '回复失败')
      return Response.error(message)
    }
  }

  /**
   * 检查评论内容
   * @param {string} content - 评论内容
   * @returns {Promise<Response>}
   */
  async checkPostComment(content) {
    try {
      const result = await this.commentService.checkPostComment(content)
      // Service 已经返回 Response 对象
      return result
    } catch (error) {
      const message = this.handleError(error, '内容检查失败')
      return Response.error(message)
    }
  }

  /**
   * 更改评论状态
   * @param {string} id - 评论ID
   * @param {number} flag - 状态标记
   * @param {string} postId - 文章ID
   * @param {number} count - 评论数变化
   * @returns {Promise<Response>}
   */
  async changeCommentFlag(id, flag, postId, count) {
    try {
      const result = await this.commentService.changeCommentFlag(id, flag, postId, count)
      // Service 已经返回 Response 对象
      return result
    } catch (error) {
      const message = this.handleError(error, '更新评论状态失败')
      return Response.error(message)
    }
  }
}

module.exports = CommentViewModel


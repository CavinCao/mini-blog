/**
 * 评论服务接口
 * 所有评论相关的服务实现都必须实现此接口
 */
class ICommentService {
  /**
   * 获取文章评论列表
   * @param {number} page - 页码
   * @param {string} postId - 文章ID
   * @returns {Promise<Array<Comment>>}
   */
  async getPostComments(page, postId) {
    throw new Error('Method not implemented: getPostComments')
  }

  /**
   * 获取评论列表（管理后台）
   * @param {number} page - 页码
   * @param {number} flag - 状态标记
   * @returns {Promise<Array<Comment>>}
   */
  async getCommentsList(page, flag) {
    throw new Error('Method not implemented: getCommentsList')
  }

  /**
   * 新增评论
   * @param {string} commentContent - 评论内容
   * @param {Object} accept - 接收人信息
   * @returns {Promise<Object>}
   */
  async addPostComment(commentContent, accept) {
    throw new Error('Method not implemented: addPostComment')
  }

  /**
   * 新增子评论
   * @param {string} id - 父评论ID
   * @param {string} postId - 文章ID
   * @param {Object} comments - 子评论内容
   * @param {Object} accept - 接收人信息
   * @returns {Promise<Object>}
   */
  async addPostChildComment(id, postId, comments, accept) {
    throw new Error('Method not implemented: addPostChildComment')
  }

  /**
   * 检查评论内容
   * @param {string} content - 评论内容
   * @returns {Promise<Object>}
   */
  async checkPostComment(content) {
    throw new Error('Method not implemented: checkPostComment')
  }

  /**
   * 更改评论状态
   * @param {string} id - 评论ID
   * @param {number} flag - 状态标记
   * @param {string} postId - 文章ID
   * @param {number} count - 评论数变化
   * @returns {Promise<Object>}
   */
  async changeCommentFlag(id, flag, postId, count) {
    throw new Error('Method not implemented: changeCommentFlag')
  }
}

module.exports = ICommentService


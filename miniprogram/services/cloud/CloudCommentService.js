const ICommentService = require('../interfaces/ICommentService.js')
const BaseCloudService = require('./BaseCloudService.js')
const Comment = require('../../models/Comment.js')

/**
 * 评论服务 - 云开发实现
 */
class CloudCommentService extends BaseCloudService {
  constructor() {
    super()
  }

  /**
   * 获取文章评论列表
   */
  async getPostComments(page, postId) {
    const result = await this.db.collection('mini_comments')
      .where({
        postId: postId,
        flag: 0
      })
      .orderBy('timestamp', 'desc')
      .skip((page - 1) * 10)
      .limit(10)
      .get()

    // 在 Service 层将云数据转换为 Comment 对象
    return result.data.map(cloudData => this._convertToComment(cloudData))
  }

  /**
   * 将云数据库数据转换为 Comment 对象
   * @private
   */
  _convertToComment(cloudData) {
    if (!cloudData) return null
    
    // 云数据库中评论字段带 c 前缀：cNickName, cAvatarUrl, cOpenId
    return new Comment({
      id: cloudData._id,
      postId: cloudData.postId,
      openId: cloudData.cOpenId || cloudData.openId,
      nickName: cloudData.cNickName || cloudData.nickName,
      avatarUrl: cloudData.cAvatarUrl || cloudData.avatarUrl,
      content: cloudData.comment || cloudData.content,
      timestamp: cloudData.timestamp,
      createDate: cloudData.createDate,
      isVip: cloudData.isVip,
      flag: cloudData.flag !== undefined ? cloudData.flag : 0,
      childComments: cloudData.childComment || cloudData.childComments || []
    })
  }

  /**
   * 获取评论列表（管理后台）
   */
  async getCommentsList(page, flag) {
    const result = await this.db.collection('mini_comments')
      .where({
        flag: flag
      })
      .orderBy('timestamp', 'desc')
      .skip((page - 1) * 10)
      .limit(10)
      .get()

    return result.data.map(cloudData => this._convertToComment(cloudData))
  }

  /**
   * 新增评论
   */
  async addPostComment(commentContent, accept) {
    const config = require('../../utils/config.js')
    return await wx.cloud.callFunction({
      name: 'postsService',
      data: {
        action: "addPostComment",
        commentContent: commentContent,
        accept: accept,
        pushTemplateId: config.subcributeTemplateId
      }
    })
  }

  /**
   * 新增子评论
   */
  async addPostChildComment(id, postId, comments, accept) {
    return await wx.cloud.callFunction({
      name: 'postsService',
      data: {
        action: "addPostChildComment",
        id: id,
        comments: comments,
        postId: postId,
        accept: accept
      }
    })
  }

  /**
   * 检查评论内容
   */
  async checkPostComment(content) {
    return await wx.cloud.callFunction({
      name: 'postsService',
      data: {
        action: "checkPostComment",
        content: content
      }
    })
  }

  /**
   * 更改评论状态
   */
  async changeCommentFlag(id, flag, postId, count) {
    return await wx.cloud.callFunction({
      name: 'adminService',
      data: {
        action: "changeCommentFlagById",
        id: id,
        flag: flag,
        postId: postId,
        count: count
      }
    })
  }
}

module.exports = CloudCommentService


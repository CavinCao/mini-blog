/**
 * 评论数据模型
 * 纯粹的数据结构定义，不绑定特定数据源
 * 数据转换逻辑由各个 Service 实现负责
 */
class Comment {
  constructor(data = {}) {
    this.id = data.id || ''
    this.postId = data.postId || ''
    this.openId = data.openId || ''
    this.nickName = data.nickName || ''
    this.avatarUrl = data.avatarUrl || ''
    this.content = data.content || ''
    this.timestamp = data.timestamp || 0
    this.createDate = data.createDate || ''
    this.isVip = data.isVip || false
    this.flag = data.flag !== undefined ? data.flag : 0
    this.childComments = data.childComments || []
  }

  /**
   * 转换为列表项格式（匹配 WXML 中的字段名）
   * @returns {Object}
   */
  toListItem() {
    return {
      id: this.id,
      postId: this.postId,
      cOpenId: this.openId,        // WXML 使用 cOpenId
      cNickName: this.nickName,    // WXML 使用 cNickName
      cAvatarUrl: this.avatarUrl,  // WXML 使用 cAvatarUrl
      comment: this.content,       // WXML 使用 comment
      timestamp: this.timestamp,
      createDate: this.createDate,
      isVip: this.isVip,
      flag: this.flag,
      childComment: this.childComments  // WXML 使用 childComment（单数）
    }
  }

  /**
   * 转换为详情格式（匹配 WXML 中的字段名）
   * @returns {Object}
   */
  toDetail() {
    return {
      id: this.id,
      postId: this.postId,
      cOpenId: this.openId,        // WXML 使用 cOpenId
      cNickName: this.nickName,    // WXML 使用 cNickName
      cAvatarUrl: this.avatarUrl,  // WXML 使用 cAvatarUrl
      comment: this.content,       // WXML 使用 comment
      timestamp: this.timestamp,
      createDate: this.createDate,
      isVip: this.isVip,
      flag: this.flag,
      childComment: this.childComments  // WXML 使用 childComment（单数）
    }
  }

  /**
   * 是否已审核通过
   * @returns {boolean}
   */
  isApproved() {
    return this.flag === 0
  }
}

module.exports = Comment

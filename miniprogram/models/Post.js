/**
 * 文章数据模型
 * 纯粹的数据结构定义，不绑定特定数据源
 * 数据转换逻辑由各个 Service 实现负责
 */
class Post {
  constructor(data = {}) {
    this.id = data.id || ''
    this.title = data.title || ''
    this.author = data.author || ''
    this.content = data.content || ''
    this.digest = data.digest || ''
    this.defaultImageUrl = data.defaultImageUrl || ''
    this.classify = data.classify || ''
    this.label = data.label || []
    this.isShow = data.isShow !== undefined ? data.isShow : 1
    this.createTime = data.createTime || 0
    this.updateTime = data.updateTime || 0
    this.totalVisits = data.totalVisits || 0
    this.totalComments = data.totalComments || 0
    this.totalZans = data.totalZans || 0
    this.totalCollection = data.totalCollection || 0
  }

  /**
   * 转换为列表项格式 (用于列表展示)
   * @returns {Object}
   */
  toListItem() {
    return {
      id: this.id,
      title: this.title,
      author: this.author,
      digest: this.digest,
      defaultImageUrl: this.defaultImageUrl,
      classify: this.classify,
      label: this.label,
      createTime: this.createTime,
      totalVisits: this.totalVisits,
      totalComments: this.totalComments,
      totalZans: this.totalZans,
      totalCollection: this.totalCollection,
      isShow: this.isShow
    }
  }

  /**
   * 转换为详情格式 (用于详情展示)
   * @returns {Object}
   */
  toDetail() {
    return {
      id: this.id,
      title: this.title,
      author: this.author,
      content: this.content,
      digest: this.digest,
      defaultImageUrl: this.defaultImageUrl,
      classify: this.classify,
      label: this.label,
      createTime: this.createTime,
      updateTime: this.updateTime,
      totalVisits: this.totalVisits,
      totalComments: this.totalComments,
      totalZans: this.totalZans,
      totalCollection: this.totalCollection,
      isShow: this.isShow
    }
  }
}

module.exports = Post

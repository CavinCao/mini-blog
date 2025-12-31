const IPostService = require('../interfaces/IPostService.js')
const BaseCloudService = require('./BaseCloudService.js')
const Post = require('../../models/Post.js')

/**
 * 文章服务 - 云开发实现
 */
class CloudPostService extends BaseCloudService {
  constructor() {
    super()
    this._ = this.db.command
  }

  /**
   * 获取文章列表
   */
  async getPostsList(params) {
    const { page = 1, filter = '', isShow = 1, orderBy = 'createTime', label = '', limit = 10 } = params
    
    let where = {}
    
    if (filter !== '') {
      where.title = this.db.RegExp({
        regexp: filter,
        options: 'i',
      })
    }
    if (isShow !== -1) {
      where.isShow = isShow
    }
    if (label !== undefined && label !== '') {
      where.label = this.db.RegExp({
        regexp: label,
        options: 'i',
      })
    }

    const result = await this.db.collection('mini_posts')
      .where(where)
      .orderBy(orderBy, 'desc')
      .skip((page - 1) * limit)
      .limit(limit)
      .field({
        _id: true,
        author: true,
        createTime: true,
        defaultImageUrl: true,
        title: true,
        totalComments: true,
        totalVisits: true,
        totalZans: true,
        isShow: true,
        classify: true,
        label: true,
        digest: true
      })
      .get()

    // 在 Service 层将云数据转换为 Post 对象
    return result.data.map(cloudData => this._convertToPost(cloudData))
  }

  /**
   * 将云数据库数据转换为 Post 对象
   * @private
   */
  _convertToPost(cloudData) {
    if (!cloudData) return null
    
    return new Post({
      id: cloudData._id,
      title: cloudData.title,
      author: cloudData.author,
      content: cloudData.content,
      digest: cloudData.digest,
      defaultImageUrl: cloudData.defaultImageUrl,
      classify: cloudData.classify,
      label: cloudData.label,
      isShow: cloudData.isShow,
      createTime: cloudData.createTime,
      updateTime: cloudData.updateTime,
      totalVisits: cloudData.totalVisits || 0,
      totalComments: cloudData.totalComments || 0,
      totalZans: cloudData.totalZans || 0,
      totalCollection: cloudData.totalCollection || 0
    })
  }

  /**
   * 获取文章列表（新版）
   */
  async getNewPostsList(params) {
    const { page = 1, filter = {}, orderBy = 'createTime' } = params
    
    let where = {}
    
    if (filter.title !== undefined) {
      where.title = this.db.RegExp({
        regexp: filter.title,
        options: 'i',
      })
    }
    if (filter.isShow !== undefined) {
      where.isShow = filter.isShow
    }
    if (filter.classify !== undefined) {
      where.classify = filter.classify
    }

    if (filter.hasClassify == 1) {
      where.classify = this._.nin(["", 0, undefined])
    }

    if (filter.hasClassify == 2) {
      where.classify = this._.in(["", 0, undefined])
    }

    if (filter.hasLabel == 1) {
      where.label = this._.neq([])
    }

    if (filter.hasLabel == 2) {
      where.label = this._.eq([])
    }

    //不包含某个标签
    if (filter.containLabel == 2) {
      where.label = this._.nin([filter.label])
    }

    //包含某个标签
    if (filter.containLabel == 1) {
      where.label = this.db.RegExp({
        regexp: filter.label,
        options: 'i',
      })
    }

    //不包含某个主题
    if (filter.containClassify == 2) {
      where.classify = this._.neq(filter.classify)
    }

    //包含某个主题
    if (filter.containClassify == 1) {
      where.classify = this._.eq(filter.classify)
    }

    const result = await this.db.collection('mini_posts')
      .where(where)
      .orderBy(orderBy, 'desc')
      .skip((page - 1) * 10)
      .limit(10)
      .field({
        _id: true,
        author: true,
        createTime: true,
        defaultImageUrl: true,
        title: true,
        totalComments: true,
        totalVisits: true,
        totalZans: true,
        isShow: true,
        classify: true,
        label: true,
        digest: true
      })
      .get()

    return result.data.map(cloudData => this._convertToPost(cloudData))
  }

  /**
   * 根据ID获取文章
   */
  async getPostsById(id) {
    const result = await this.db.collection('mini_posts')
      .doc(id)
      .get()

    return this._convertToPost(result.data)
  }

  /**
   * 获取文章详情
   */
  async getPostDetail(id) {
    // 参数校验
    if (!id || typeof id !== 'string' || id.trim() === '') {
      console.error('CloudPostService.getPostDetail: 文章ID无效', id)
      throw new Error('文章ID不能为空')
    }
    
    const response = await this.callFunction('postsService', {
      action: "getPostsDetail",
      id: id.trim(),
      type: 1
    })

    if (response.success && response.data) {
      return this._convertToPost(response.data)
    }
    
    return null
  }

  /**
   * 新增/更新文章
   */
  async upsertPost(id, post) {
    return await this.callFunction('adminService', {
      action: "upsertPosts",
      id: id,
      post: post
    })
  }

  /**
   * 删除文章
   */
  async deletePost(id) {
    return await this.callFunction('adminService', {
      action: "deletePostById",
      id: id
    })
  }

  /**
   * 更新文章状态
   */
  async updatePostStatus(id, isShow) {
    return await this.callFunction('adminService', {
      action: "updatePostsShowStatus",
      id: id,
      isShow: isShow
    })
  }

  /**
   * 更新文章分类
   */
  async updatePostClassify(id, classify) {
    return await this.callFunction('adminService', {
      action: "updatePostsClassify",
      id: id,
      classify: classify
    })
  }

  /**
   * 更新文章标签
   */
  async updatePostLabel(id, label) {
    return await this.callFunction('adminService', {
      action: "updatePostsLabel",
      id: id,
      label: label
    })
  }

  /**
   * 批量更新文章分类
   */
  async updateBatchPostsClassify(classify, operate, posts) {
    return await this.callFunction('adminService', {
      action: "updateBatchPostsClassify",
      posts: posts,
      operate: operate,
      classify: classify
    })
  }

  /**
   * 批量更新文章标签
   */
  async updateBatchPostsLabel(label, operate, posts) {
    return await this.callFunction('adminService', {
      action: "updateBatchPostsLabel",
      posts: posts,
      operate: operate,
      label: label
    })
  }

  /**
   * 获取文章相关（收藏/点赞）
   */
  async getPostRelated(where, page) {
    const result = await this.db.collection('mini_posts_related')
      .where(where)
      .orderBy('createTime', 'desc')
      .skip((page - 1) * 10)
      .limit(10)
      .get()
    
    // 返回数据数组，而不是整个查询结果对象
    return result.data || []
  }

  /**
   * 新增文章收藏
   */
  async addPostCollection(data) {
    return await this.callFunction('postsService', {
      action: "addPostCollection",
      postId: data.postId,
      postTitle: data.postTitle,
      postUrl: data.postUrl,
      postDigest: data.postDigest,
      type: data.type
    })
  }

  /**
   * 新增文章点赞
   */
  async addPostZan(data) {
    return await this.callFunction('postsService', {
      action: "addPostZan",
      postId: data.postId,
      postTitle: data.postTitle,
      postUrl: data.postUrl,
      postDigest: data.postDigest,
      type: data.type
    })
  }

  /**
   * 取消收藏或点赞
   */
  async deletePostCollectionOrZan(postId, type) {
    return await this.callFunction('postsService', {
      action: "deletePostCollectionOrZan",
      postId: postId,
      type: type
    })
  }

  /**
   * 生成文章二维码
   */
  async addPostQrCode(postId, timestamp) {
    return await this.callFunction('postsService', {
      action: "addPostQrCode",
      timestamp: timestamp,
      postId: postId
    })
  }

  /**
   * 获取打赏码
   */
  async getQrCode() {
    return await wx.cloud.getTempFileURL({
      fileList: [{
        fileID: 'cloud://test-91f3af.54ec-test-91f3af/common/1556347401340.jpg'
      }]
    })
  }

  /**
   * 获取海报二维码URL
   */
  async getReportQrCodeUrl(id) {
    return await wx.cloud.getTempFileURL({
      fileList: [{
        fileID: id,
        maxAge: 60 * 60, // one hour
      }]
    })
  }
}

module.exports = CloudPostService


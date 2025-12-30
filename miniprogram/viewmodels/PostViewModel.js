const BaseViewModel = require('./base/BaseViewModel.js')
const Response = require('./base/Response.js')
const ServiceFactory = require('../services/ServiceFactory.js')

/**
 * 文章 ViewModel
 * 封装文章相关的业务逻辑
 */
class PostViewModel extends BaseViewModel {
  constructor() {
    super()
    this.postService = ServiceFactory.getPostService()
  }

  /**
   * 获取文章列表
   * @param {Object} params - 查询参数
   * @returns {Promise<Response>}
   */
  async getPostsList(params) {
    try {
      const posts = await this.postService.getPostsList(params)
      const limit = params.limit || 10
      
      return Response.success({
        list: posts.map(post => post.toListItem()),
        hasMore: posts.length >= limit,
        isEmpty: posts.length === 0 && params.page === 1
      })
    } catch (error) {
      const message = this.handleError(error, '获取文章列表失败')
      return Response.error(message)
    }
  }

  /**
   * 获取文章列表（新版）
   * @param {Object} params - 查询参数
   * @returns {Promise<Response>}
   */
  async getNewPostsList(params) {
    try {
      const posts = await this.postService.getNewPostsList(params)
      
      return Response.success({
        list: posts.map(post => post.toListItem()),
        hasMore: posts.length >= 10,
        isEmpty: posts.length === 0 && params.page === 1
      })
    } catch (error) {
      const message = this.handleError(error, '获取文章列表失败')
      return Response.error(message)
    }
  }

  /**
   * 根据ID获取文章
   * @param {string} id - 文章ID
   * @returns {Promise<Response>}
   */
  async getPostsById(id) {
    try {
      const post = await this.postService.getPostsById(id)
      return Response.success(post ? post.toDetail() : null)
    } catch (error) {
      const message = this.handleError(error, '获取文章失败')
      return Response.error(message)
    }
  }

  /**
   * 获取文章详情
   * @param {string} id - 文章ID
   * @returns {Promise<Response>}
   */
  async getPostDetail(id) {
    try {
      // 参数校验
      if (!id || typeof id !== 'string' || id.trim() === '') {
        console.error('文章ID无效:', id)
        return Response.error('文章ID不能为空')
      }
      
      const post = await this.postService.getPostDetail(id)
      
      if (!post) {
        return Response.error('文章不存在')
      }
      
      return Response.success(post.toDetail())
    } catch (error) {
      const message = this.handleError(error, '获取文章详情失败')
      return Response.error(message)
    }
  }

  /**
   * 保存文章
   * @param {string} id - 文章ID
   * @param {Object} postData - 文章数据
   * @returns {Promise<Response>}
   */
  async savePost(id, postData) {
    try {
      const result = await this.postService.upsertPost(id, postData)
      // Service 已经返回 Response 对象
      return result
    } catch (error) {
      const message = this.handleError(error, '保存文章失败')
      return Response.error(message)
    }
  }

  /**
   * 删除文章
   * @param {string} id - 文章ID
   * @returns {Promise<Response>}
   */
  async deletePost(id) {
    try {
      const result = await this.postService.deletePost(id)
      // Service 已经返回 Response 对象
      return result
    } catch (error) {
      const message = this.handleError(error, '删除文章失败')
      return Response.error(message)
    }
  }

  /**
   * 更新文章状态
   * @param {string} id - 文章ID
   * @param {number} isShow - 是否显示
   * @returns {Promise<Response>}
   */
  async updatePostStatus(id, isShow) {
    try {
      const result = await this.postService.updatePostStatus(id, isShow)
      // Service 已经返回 Response 对象
      return result
    } catch (error) {
      const message = this.handleError(error, '更新文章状态失败')
      return Response.error(message)
    }
  }

  /**
   * 更新文章分类
   * @param {string} id - 文章ID
   * @param {string} classify - 分类
   * @returns {Promise<Response>}
   */
  async updatePostClassify(id, classify) {
    try {
      const result = await this.postService.updatePostClassify(id, classify)
      // Service 已经返回 Response 对象
      return result
    } catch (error) {
      const message = this.handleError(error, '更新文章分类失败')
      return Response.error(message)
    }
  }

  /**
   * 更新文章标签
   * @param {string} id - 文章ID
   * @param {Array<string>} label - 标签数组
   * @returns {Promise<Response>}
   */
  async updatePostLabel(id, label) {
    try {
      const result = await this.postService.updatePostLabel(id, label)
      // Service 已经返回 Response 对象
      return result
    } catch (error) {
      const message = this.handleError(error, '更新文章标签失败')
      return Response.error(message)
    }
  }

  /**
   * 批量更新文章分类
   * @param {string} classify - 分类
   * @param {string} operate - 操作类型
   * @param {Array<string>} posts - 文章ID数组
   * @returns {Promise<Response>}
   */
  async updateBatchPostsClassify(classify, operate, posts) {
    try {
      const result = await this.postService.updateBatchPostsClassify(classify, operate, posts)
      // Service 已经返回 Response 对象
      return result
    } catch (error) {
      const message = this.handleError(error, '批量更新文章分类失败')
      return Response.error(message)
    }
  }

  /**
   * 批量更新文章标签
   * @param {string} label - 标签
   * @param {string} operate - 操作类型
   * @param {Array<string>} posts - 文章ID数组
   * @returns {Promise<Response>}
   */
  async updateBatchPostsLabel(label, operate, posts) {
    try {
      const result = await this.postService.updateBatchPostsLabel(label, operate, posts)
      // Service 已经返回 Response 对象
      return result
    } catch (error) {
      const message = this.handleError(error, '批量更新文章标签失败')
      return Response.error(message)
    }
  }

  /**
   * 获取文章相关（收藏/点赞）
   * @param {Object} where - 查询条件
   * @param {number} page - 页码
   * @returns {Promise<Response>}
   */
  async getPostRelated(where, page) {
    try {
      const result = await this.postService.getPostRelated(where, page)
      return Response.success(result)
    } catch (error) {
      const message = this.handleError(error, '获取文章相关信息失败')
      return Response.error(message)
    }
  }

  /**
   * 新增文章收藏
   * @param {Object} data - 收藏数据
   * @returns {Promise<Response>}
   */
  async addPostCollection(data) {
    try {
      const result = await this.postService.addPostCollection(data)
      // Service 已经返回 Response 对象
      return result
    } catch (error) {
      const message = this.handleError(error, '收藏失败')
      return Response.error(message)
    }
  }

  /**
   * 新增文章点赞
   * @param {Object} data - 点赞数据
   * @returns {Promise<Response>}
   */
  async addPostZan(data) {
    try {
      const result = await this.postService.addPostZan(data)
      // Service 已经返回 Response 对象
      return result
    } catch (error) {
      const message = this.handleError(error, '点赞失败')
      return Response.error(message)
    }
  }

  /**
   * 取消收藏或点赞
   * @param {string} postId - 文章ID
   * @param {number} type - 类型
   * @returns {Promise<Response>}
   */
  async deletePostCollectionOrZan(postId, type) {
    try {
      const result = await this.postService.deletePostCollectionOrZan(postId, type)
      // Service 已经返回 Response 对象
      return result
    } catch (error) {
      const message = this.handleError(error, '取消失败')
      return Response.error(message)
    }
  }

  /**
   * 生成文章二维码
   * @param {string} postId - 文章ID
   * @param {number} timestamp - 时间戳
   * @returns {Promise<Response>}
   */
  async addPostQrCode(postId, timestamp) {
    try {
      const result = await this.postService.addPostQrCode(postId, timestamp)
      // Service 已经返回 Response 对象
      return result
    } catch (error) {
      const message = this.handleError(error, '生成二维码失败')
      return Response.error(message)
    }
  }

  /**
   * 获取打赏码
   * @returns {Promise<Response>}
   */
  async getQrCode() {
    try {
      const result = await this.postService.getQrCode()
      return Response.success(result)
    } catch (error) {
      const message = this.handleError(error, '获取打赏码失败')
      return Response.error(message)
    }
  }

  /**
   * 获取海报二维码URL
   * @param {string} id - 文件ID
   * @returns {Promise<Response>}
   */
  async getReportQrCodeUrl(id) {
    try {
      const result = await this.postService.getReportQrCodeUrl(id)
      return Response.success(result)
    } catch (error) {
      const message = this.handleError(error, '获取二维码URL失败')
      return Response.error(message)
    }
  }

  /**
   * 批量更新文章标签
   * @param {string} label - 标签名
   * @param {string} operate - 操作类型 (add/delete)
   * @param {Array} posts - 文章ID数组
   * @returns {Promise<Response>}
   */
  async updateBatchPostsLabel(label, operate, posts) {
    try {
      const result = await this.postService.updateBatchPostsLabel(label, operate, posts)
      // Service 已经返回 Response 对象
      return result
    } catch (error) {
      const message = this.handleError(error, '批量更新标签失败')
      return Response.error(message)
    }
  }
}

module.exports = PostViewModel


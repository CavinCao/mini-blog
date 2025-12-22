/**
 * 文章服务接口
 * 所有文章相关的服务实现都必须实现此接口
 */
class IPostService {
  /**
   * 获取文章列表
   * @param {Object} params - 查询参数
   * @param {number} params.page - 页码
   * @param {string} params.filter - 搜索关键词
   * @param {number} params.isShow - 是否显示 (1显示 0隐藏 -1全部)
   * @param {string} params.orderBy - 排序字段
   * @param {string} params.label - 标签筛选
   * @returns {Promise<Array<Post>>}
   */
  async getPostsList(params) {
    throw new Error('Method not implemented: getPostsList')
  }

  /**
   * 获取文章列表（新版，支持更多筛选条件）
   * @param {Object} params - 查询参数
   * @param {number} params.page - 页码
   * @param {Object} params.filter - 筛选条件
   * @param {string} params.orderBy - 排序字段
   * @returns {Promise<Array<Post>>}
   */
  async getNewPostsList(params) {
    throw new Error('Method not implemented: getNewPostsList')
  }

  /**
   * 根据 ID 获取文章
   * @param {string} id - 文章ID
   * @returns {Promise<Post>}
   */
  async getPostsById(id) {
    throw new Error('Method not implemented: getPostsById')
  }

  /**
   * 获取文章详情
   * @param {string} id - 文章ID
   * @returns {Promise<Post>}
   */
  async getPostDetail(id) {
    throw new Error('Method not implemented: getPostDetail')
  }

  /**
   * 新增/更新文章
   * @param {string} id - 文章ID (为空则新增)
   * @param {Object} post - 文章数据
   * @returns {Promise<Object>}
   */
  async upsertPost(id, post) {
    throw new Error('Method not implemented: upsertPost')
  }

  /**
   * 删除文章
   * @param {string} id - 文章ID
   * @returns {Promise<Object>}
   */
  async deletePost(id) {
    throw new Error('Method not implemented: deletePost')
  }

  /**
   * 更新文章状态
   * @param {string} id - 文章ID
   * @param {number} isShow - 是否显示
   * @returns {Promise<Object>}
   */
  async updatePostStatus(id, isShow) {
    throw new Error('Method not implemented: updatePostStatus')
  }

  /**
   * 更新文章分类
   * @param {string} id - 文章ID
   * @param {string} classify - 分类
   * @returns {Promise<Object>}
   */
  async updatePostClassify(id, classify) {
    throw new Error('Method not implemented: updatePostClassify')
  }

  /**
   * 更新文章标签
   * @param {string} id - 文章ID
   * @param {Array<string>} label - 标签数组
   * @returns {Promise<Object>}
   */
  async updatePostLabel(id, label) {
    throw new Error('Method not implemented: updatePostLabel')
  }

  /**
   * 批量更新文章分类
   * @param {string} classify - 分类
   * @param {string} operate - 操作类型
   * @param {Array<string>} posts - 文章ID数组
   * @returns {Promise<Object>}
   */
  async updateBatchPostsClassify(classify, operate, posts) {
    throw new Error('Method not implemented: updateBatchPostsClassify')
  }

  /**
   * 批量更新文章标签
   * @param {string} label - 标签
   * @param {string} operate - 操作类型
   * @param {Array<string>} posts - 文章ID数组
   * @returns {Promise<Object>}
   */
  async updateBatchPostsLabel(label, operate, posts) {
    throw new Error('Method not implemented: updateBatchPostsLabel')
  }

  /**
   * 获取文章相关（收藏/点赞）
   * @param {Object} where - 查询条件
   * @param {number} page - 页码
   * @returns {Promise<Array>}
   */
  async getPostRelated(where, page) {
    throw new Error('Method not implemented: getPostRelated')
  }

  /**
   * 新增文章收藏
   * @param {Object} data - 收藏数据
   * @returns {Promise<Object>}
   */
  async addPostCollection(data) {
    throw new Error('Method not implemented: addPostCollection')
  }

  /**
   * 新增文章点赞
   * @param {Object} data - 点赞数据
   * @returns {Promise<Object>}
   */
  async addPostZan(data) {
    throw new Error('Method not implemented: addPostZan')
  }

  /**
   * 取消收藏或点赞
   * @param {string} postId - 文章ID
   * @param {number} type - 类型
   * @returns {Promise<Object>}
   */
  async deletePostCollectionOrZan(postId, type) {
    throw new Error('Method not implemented: deletePostCollectionOrZan')
  }

  /**
   * 生成文章二维码
   * @param {string} postId - 文章ID
   * @param {number} timestamp - 时间戳
   * @returns {Promise<Object>}
   */
  async addPostQrCode(postId, timestamp) {
    throw new Error('Method not implemented: addPostQrCode')
  }

  /**
   * 获取打赏码
   * @returns {Promise<Object>}
   */
  async getQrCode() {
    throw new Error('Method not implemented: getQrCode')
  }

  /**
   * 获取海报二维码URL
   * @param {string} id - 文件ID
   * @returns {Promise<Object>}
   */
  async getReportQrCodeUrl(id) {
    throw new Error('Method not implemented: getReportQrCodeUrl')
  }
}

module.exports = IPostService


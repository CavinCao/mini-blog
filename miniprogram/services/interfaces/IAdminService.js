/**
 * 管理员服务接口
 * 所有管理员相关的服务实现都必须实现此接口
 */
class IAdminService {
  /**
   * 验证是否是管理员
   * @returns {Promise<Object>}
   */
  async checkAuthor() {
    throw new Error('Method not implemented: checkAuthor')
  }

  /**
   * 新增版本日志
   * @param {string} log - 日志内容
   * @param {string} title - 日志标题
   * @returns {Promise<Object>}
   */
  async addReleaseLog(log, title) {
    throw new Error('Method not implemented: addReleaseLog')
  }

  /**
   * 获取版本发布日志列表
   * @param {number} page - 页码
   * @returns {Promise<Array>}
   */
  async getReleaseLogsList(page) {
    throw new Error('Method not implemented: getReleaseLogsList')
  }

  /**
   * 获取通知日志列表
   * @param {number} page - 页码
   * @param {string} openId - 用户openId
   * @returns {Promise<Array>}
   */
  async getNoticeLogsList(page, openId) {
    throw new Error('Method not implemented: getNoticeLogsList')
  }

  /**
   * 获取标签列表
   * @returns {Promise<Array<Label>>}
   */
  async getLabelList() {
    throw new Error('Method not implemented: getLabelList')
  }

  /**
   * 新增标签
   * @param {string} labelName - 标签名称
   * @returns {Promise<Object>}
   */
  async addBaseLabel(labelName) {
    throw new Error('Method not implemented: addBaseLabel')
  }

  /**
   * 获取分类列表
   * @returns {Promise<Array<Classify>>}
   */
  async getClassifyList() {
    throw new Error('Method not implemented: getClassifyList')
  }

  /**
   * 新增分类
   * @param {string} classifyName - 分类名称
   * @param {string} classifyDesc - 分类描述
   * @returns {Promise<Object>}
   */
  async addBaseClassify(classifyName, classifyDesc) {
    throw new Error('Method not implemented: addBaseClassify')
  }

  /**
   * 根据ID删除配置
   * @param {string} id - 配置ID
   * @returns {Promise<Object>}
   */
  async deleteConfigById(id) {
    throw new Error('Method not implemented: deleteConfigById')
  }

  /**
   * 审核VIP申请
   * @param {string} id - 申请ID
   * @param {number} apply - 审核结果
   * @param {string} openId - 用户openId
   * @returns {Promise<Object>}
   */
  async approveApplyVip(id, apply, openId) {
    throw new Error('Method not implemented: approveApplyVip')
  }

  /**
   * 获取广告配置
   * @returns {Promise<Object>}
   */
  async getAdvertConfig() {
    throw new Error('Method not implemented: getAdvertConfig')
  }

  /**
   * 保存/更新广告配置
   * @param {Object} advert - 广告配置
   * @returns {Promise<Object>}
   */
  async upsertAdvertConfig(advert) {
    throw new Error('Method not implemented: upsertAdvertConfig')
  }

  /**
   * 更新文章
   * @param {string} id - 文章ID
   * @param {Object} data - 文章数据
   * @returns {Promise<Object>}
   */
  async upsertPosts(id, data) {
    throw new Error('Method not implemented: upsertPosts')
  }

  /**
   * 更新文章显示状态
   * @param {string} id - 文章ID
   * @param {number} isShow - 显示状态 (1:显示, 0:隐藏)
   * @returns {Promise<Object>}
   */
  async updatePostsShowStatus(id, isShow) {
    throw new Error('Method not implemented: updatePostsShowStatus')
  }

  /**
   * 删除文章
   * @param {string} id - 文章ID
   * @returns {Promise<Object>}
   */
  async deletePostById(id) {
    throw new Error('Method not implemented: deletePostById')
  }
}

module.exports = IAdminService


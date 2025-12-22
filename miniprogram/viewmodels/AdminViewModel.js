const BaseViewModel = require('./base/BaseViewModel.js')
const Response = require('./base/Response.js')
const ServiceFactory = require('../services/ServiceFactory.js')

/**
 * 管理员 ViewModel
 * 封装管理员相关的业务逻辑
 */
class AdminViewModel extends BaseViewModel {
  constructor() {
    super()
    this.adminService = ServiceFactory.getAdminService()
  }

  /**
   * 验证是否是管理员
   * @returns {Promise<Response>}
   */
  async checkAuthor() {
    try {
      const result = await this.adminService.checkAuthor()
      // Service 已经返回 Response 对象
      return result
    } catch (error) {
      const message = this.handleError(error, '权限验证失败')
      return Response.error(message)
    }
  }

  /**
   * 新增版本日志
   * @param {string} log - 日志内容
   * @param {string} title - 日志标题
   * @returns {Promise<Response>}
   */
  async addReleaseLog(log, title) {
    try {
      const result = await this.adminService.addReleaseLog(log, title)
      // Service 已经返回 Response 对象
      return result
    } catch (error) {
      const message = this.handleError(error, '新增日志失败')
      return Response.error(message)
    }
  }

  /**
   * 获取版本发布日志列表
   * @param {number} page - 页码
   * @returns {Promise<Response>}
   */
  async getReleaseLogsList(page) {
    try {
      const result = await this.adminService.getReleaseLogsList(page)
      return Response.success({
        list: result.data || [],
        hasMore: result.data && result.data.length >= 10,
        isEmpty: result.data && result.data.length === 0 && page === 1
      })
    } catch (error) {
      const message = this.handleError(error, '获取日志列表失败')
      return Response.error(message)
    }
  }

  /**
   * 获取通知日志列表
   * @param {number} page - 页码
   * @param {string} openId - 用户openId
   * @returns {Promise<Response>}
   */
  async getNoticeLogsList(page, openId) {
    try {
      const result = await this.adminService.getNoticeLogsList(page, openId)
      return Response.success({
        list: result.data || [],
        hasMore: result.data && result.data.length >= 10,
        isEmpty: result.data && result.data.length === 0 && page === 1
      })
    } catch (error) {
      const message = this.handleError(error, '获取通知列表失败')
      return Response.error(message)
    }
  }

  /**
   * 获取标签列表
   * @returns {Promise<Response>}
   */
  async getLabelList() {
    try {
      const labels = await this.adminService.getLabelList()
      return Response.success(labels.map(label => label.toSimple()))
    } catch (error) {
      const message = this.handleError(error, '获取标签列表失败')
      return Response.error(message)
    }
  }

  /**
   * 新增标签
   * @param {string} labelName - 标签名称
   * @returns {Promise<Response>}
   */
  async addBaseLabel(labelName) {
    try {
      const result = await this.adminService.addBaseLabel(labelName)
      // Service 已经返回 Response 对象
      return result
    } catch (error) {
      const message = this.handleError(error, '新增标签失败')
      return Response.error(message)
    }
  }

  /**
   * 获取分类列表
   * @returns {Promise<Response>}
   */
  async getClassifyList() {
    try {
      const classifies = await this.adminService.getClassifyList()
      return Response.success(classifies.map(classify => classify.toSimple()))
    } catch (error) {
      const message = this.handleError(error, '获取分类列表失败')
      return Response.error(message)
    }
  }

  /**
   * 新增分类
   * @param {string} classifyName - 分类名称
   * @param {string} classifyDesc - 分类描述
   * @returns {Promise<Response>}
   */
  async addBaseClassify(classifyName, classifyDesc) {
    try {
      const result = await this.adminService.addBaseClassify(classifyName, classifyDesc)
      // Service 已经返回 Response 对象
      return result
    } catch (error) {
      const message = this.handleError(error, '新增分类失败')
      return Response.error(message)
    }
  }

  /**
   * 根据ID删除配置
   * @param {string} id - 配置ID
   * @returns {Promise<Response>}
   */
  async deleteConfigById(id) {
    try {
      const result = await this.adminService.deleteConfigById(id)
      // Service 已经返回 Response 对象
      return result
    } catch (error) {
      const message = this.handleError(error, '删除配置失败')
      return Response.error(message)
    }
  }

  /**
   * 审核VIP申请
   * @param {string} id - 申请ID
   * @param {number} apply - 审核结果
   * @param {string} openId - 用户openId
   * @returns {Promise<Response>}
   */
  async approveApplyVip(id, apply, openId) {
    try {
      const result = await this.adminService.approveApplyVip(id, apply, openId)
      // Service 已经返回 Response 对象
      return result
    } catch (error) {
      const message = this.handleError(error, '审核失败')
      return Response.error(message)
    }
  }

  /**
   * 获取广告配置
   * @returns {Promise<Response>}
   */
  async getAdvertConfig() {
    try {
      const result = await this.adminService.getAdvertConfig()
      // Service 已经返回 Response 对象
      return result
    } catch (error) {
      const message = this.handleError(error, '获取广告配置失败')
      return Response.error(message)
    }
  }

  /**
   * 保存/更新广告配置
   * @param {Object} advert - 广告配置
   * @returns {Promise<Response>}
   */
  async upsertAdvertConfig(advert) {
    try {
      const result = await this.adminService.upsertAdvertConfig(advert)
      // Service 已经返回 Response 对象
      return result
    } catch (error) {
      const message = this.handleError(error, '保存广告配置失败')
      return Response.error(message)
    }
  }

  /**
   * 更新文章
   * @param {string} id - 文章ID
   * @param {Object} data - 文章数据
   * @returns {Promise<Response>}
   */
  async upsertPosts(id, data) {
    try {
      const result = await this.adminService.upsertPosts(id, data)
      // Service 已经返回 Response 对象
      return result
    } catch (error) {
      const message = this.handleError(error, '更新文章失败')
      return Response.error(message)
    }
  }

  /**
   * 更新文章显示状态
   * @param {string} id - 文章ID
   * @param {number} isShow - 显示状态 (1:显示, 0:隐藏)
   * @returns {Promise<Response>}
   */
  async updatePostsShowStatus(id, isShow) {
    try {
      const result = await this.adminService.updatePostsShowStatus(id, isShow)
      // Service 已经返回 Response 对象
      return result
    } catch (error) {
      const message = this.handleError(error, '更新文章状态失败')
      return Response.error(message)
    }
  }

  /**
   * 删除文章
   * @param {string} id - 文章ID
   * @returns {Promise<Response>}
   */
  async deletePostById(id) {
    try {
      const result = await this.adminService.deletePostById(id)
      // Service 已经返回 Response 对象
      return result
    } catch (error) {
      const message = this.handleError(error, '删除文章失败')
      return Response.error(message)
    }
  }
}

module.exports = AdminViewModel


const IAdminService = require('../interfaces/IAdminService.js')
const BaseCloudService = require('./BaseCloudService.js')
const Label = require('../../models/Label.js')
const Classify = require('../../models/Classify.js')

/**
 * 管理员服务 - 云开发实现
 */
class CloudAdminService extends BaseCloudService {
  constructor() {
    super()
  }

  /**
   * 验证是否是管理员
   */
  async checkAuthor() {
    return await this.callFunction('adminService', {
      action: "checkAuthor"
    })
  }

  /**
   * 新增版本日志
   */
  async addReleaseLog(log, title) {
    return await this.callFunction('adminService', {
      action: "addReleaseLog",
      log: log,
      title: title
    })
  }

  /**
   * 获取版本发布日志列表
   */
  async getReleaseLogsList(page) {
    return await this.db.collection('mini_logs')
      .where({
        key: 'releaseLogKey'
      })
      .orderBy('timestamp', 'desc')
      .skip((page - 1) * 10)
      .limit(10)
      .get()
  }

  /**
   * 获取通知日志列表
   */
  async getNoticeLogsList(page, openId) {
    return await this.db.collection('mini_logs')
      .orderBy('timestamp', 'desc')
      .skip((page - 1) * 10)
      .limit(10)
      .get()
  }

  /**
   * 获取标签列表
   */
  async getLabelList() {
    const response = await this.callFunction('adminService', {
      action: "getLabelList"
    })

    if (response.success && response.data) {
      return response.data.map(cloudData => this._convertToLabel(cloudData))
    }
    return []
  }

  /**
   * 将云数据库数据转换为 Label 对象
   * @private
   */
  _convertToLabel(cloudData) {
    if (!cloudData) return null
    
    const Label = require('../../models/Label.js')
    return new Label({
      id: cloudData._id,
      name: cloudData.value || cloudData.name
    })
  }

  /**
   * 新增标签
   */
  async addBaseLabel(labelName) {
    return await this.callFunction('adminService', {
      action: "addBaseLabel",
      labelName: labelName
    })
  }

  /**
   * 获取分类列表
   */
  async getClassifyList() {
    const response = await this.callFunction('adminService', {
      action: "getClassifyList"
    })

    if (response.success && response.data) {
      return response.data.map(cloudData => this._convertToClassify(cloudData))
    }
    return []
  }

  /**
   * 将云数据库数据转换为 Classify 对象
   * @private
   */
  _convertToClassify(cloudData) {
    if (!cloudData) return null
    
    const Classify = require('../../models/Classify.js')
    return new Classify({
      id: cloudData._id,
      name: cloudData.value?.classifyName || cloudData.name,
      desc: cloudData.value?.classifyDesc || cloudData.desc || ''
    })
  }

  /**
   * 新增分类
   */
  async addBaseClassify(classifyName, classifyDesc) {
    return await this.callFunction('adminService', {
      action: "addBaseClassify",
      classifyName: classifyName,
      classifyDesc: classifyDesc
    })
  }

  /**
   * 根据ID删除配置
   */
  async deleteConfigById(id) {
    return await this.callFunction('adminService', {
      action: "deleteConfigById",
      id: id
    })
  }

  /**
   * 审核VIP申请
   */
  async approveApplyVip(id, apply, openId) {
    return await this.callFunction('adminService', {
      action: "approveApplyVip",
      id: id,
      apply: apply,
      openId: openId
    })
  }

  /**
   * 获取广告配置
   */
  async getAdvertConfig() {
    return await this.callFunction('adminService', {
      action: "getAdvertConfig"
    })
  }

  /**
   * 保存/更新广告配置
   */
  async upsertAdvertConfig(advert) {
    return await this.callFunction('adminService', {
      action: "upsertAdvertConfig",
      advert: advert
    })
  }

  /**
   * 更新文章
   */
  async upsertPosts(id, data) {
    return await this.callFunction('adminService', {
      action: "upsertPosts",
      id: id,
      post: data
    })
  }

  /**
   * 更新文章显示状态
   */
  async updatePostsShowStatus(id, isShow) {
    return await this.callFunction('adminService', {
      action: "updatePostsShowStatus",
      id: id,
      isShow: isShow
    })
  }

  /**
   * 删除文章
   */
  async deletePostById(id) {
    return await this.callFunction('adminService', {
      action: "deletePostById",
      id: id
    })
  }

  /**
   * 获取活动位配置
   */
  async getActivityConfig() {
    const result = await this.callFunction('adminService', {
      action: "getActivityConfig"
    })
    return result
  }

  /**
   * 保存活动位配置
   */
  async saveActivityConfig(config) {
    return await this.callFunction('adminService', {
      action: "saveActivityConfig",
      config: config
    })
  }
}

module.exports = CloudAdminService


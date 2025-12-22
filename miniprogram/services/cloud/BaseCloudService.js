const Response = require('../../viewmodels/base/Response')

/**
 * 云开发服务基类
 * 提供云函数调用的通用方法和结果解析
 */
class BaseCloudService {
  constructor() {
    this.db = wx.cloud.database()
  }

  /**
   * 调用云函数并解析结果
   * @param {string} name - 云函数名称
   * @param {Object} data - 传递给云函数的数据
   * @returns {Promise<Response>}
   */
  async callFunction(name, data) {
    try {
      const cloudResult = await wx.cloud.callFunction({ name, data })
      return this._parseCloudResult(cloudResult)
    } catch (error) {
      console.error(`云函数 ${name} 调用失败:`, error)
      return Response.error(error.message || '操作失败')
    }
  }

  /**
   * 解析云函数返回结果为标准 Response
   * @param {*} cloudResult - 云函数返回结果
   * @returns {Response}
   * @private
   */
  _parseCloudResult(cloudResult) {
    console.log('🔍 BaseCloudService._parseCloudResult 输入:', cloudResult)

    // 检查云函数调用是否失败
    if (!cloudResult || !cloudResult.errMsg) {
      console.error('❌ 云函数调用异常: cloudResult 或 errMsg 不存在')
      return Response.error('云函数调用异常')
    }

    // 检查 errMsg 是否包含错误信息
    if (cloudResult.errMsg.indexOf('fail') > -1) {
      console.error('❌ 云函数调用失败:', cloudResult.errMsg)
      return Response.error(cloudResult.errMsg || '云函数调用失败')
    }

    // 解析云函数返回的数据
    if (cloudResult.result !== undefined) {
      const result = cloudResult.result
      
      // 如果云函数返回了标准格式 { success, data, message }
      if (result && typeof result === 'object' && result.success !== undefined) {
        console.log('✅ 检测到标准格式返回')
        const response = new Response(
          result.success,
          result.data !== undefined ? result.data : (result.value !== undefined ? result.value : null),
          result.message || '',
          result.code || 0
        )
        console.log('  - result.success:', result.success)
        console.log('  - result.data:', result.data)
        console.log('  - result.message:', result.message)
        console.log('🎯 最终Response对象:', response)
        return response
      }
      
      // 如果云函数返回的是简单数据或对象（兼容模式）
      if (result !== undefined && result !== null && result !== '') {
        console.log('⚠️ 兼容模式: 直接返回 result 作为 data')
        const response = Response.success(result)
        console.log('  - result:', result)
        console.log('🎯 最终Response对象:', response)
        return response
      }
      
      // 如果云函数返回 undefined、null 或空字符串，视为失败
      console.warn('❌ 云函数返回无效数据: result 为 undefined, null 或空字符串')
      return Response.error('操作失败，未返回有效数据')
    }
    
    console.error('❌ 未知错误: cloudResult.result 为 undefined')
    return Response.error('未知错误')
  }

  /**
   * 解析数据库操作结果为标准 Response
   * @param {Object} dbResult - 数据库操作结果
   * @param {*} data - 要返回的数据
   * @param {string} successMessage - 成功消息
   * @returns {Response}
   * @protected
   */
  _parseDbResult(dbResult, data = null, successMessage = '操作成功') {
    if (dbResult.errMsg && dbResult.errMsg.indexOf('ok') > -1) {
      return Response.success(data || dbResult, successMessage)
    }
    return Response.error(dbResult.errMsg || '数据库操作失败')
  }
}

module.exports = BaseCloudService


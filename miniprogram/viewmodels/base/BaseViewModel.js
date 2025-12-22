/**
 * ViewModel 基类
 * 所有 ViewModel 都应继承此类
 */
class BaseViewModel {
  constructor() {
    // 子类可以在构造函数中初始化 Service
  }

  /**
   * 显示加载提示
   * @param {string} title - 提示文字
   */
  showLoading(title = '加载中...') {
    wx.showLoading({ title })
  }

  /**
   * 隐藏加载提示
   */
  hideLoading() {
    wx.hideLoading()
  }

  /**
   * 显示成功提示
   * @param {string} title - 提示文字
   */
  showSuccess(title = '操作成功') {
    wx.showToast({
      title,
      icon: 'success',
      duration: 2000
    })
  }

  /**
   * 显示错误提示
   * @param {string} title - 提示文字
   */
  showError(title = '操作失败') {
    wx.showToast({
      title,
      icon: 'none',
      duration: 2000
    })
  }

  /**
   * 显示提示信息
   * @param {string} title - 提示文字
   */
  showToast(title) {
    wx.showToast({
      title,
      icon: 'none',
      duration: 2000
    })
  }

  /**
   * 处理错误
   * @param {Error} error - 错误对象
   * @param {string} defaultMessage - 默认错误信息
   * @returns {string} 错误信息
   */
  handleError(error, defaultMessage = '操作失败') {
    console.error(error)
    const message = error.message || error.errMsg || defaultMessage
    return message
  }

  /**
   * 安全执行异步操作
   * @param {Function} action - 异步操作函数
   * @param {Object} options - 配置选项
   * @param {boolean} options.showLoading - 是否显示加载提示
   * @param {string} options.loadingText - 加载提示文字
   * @param {boolean} options.showError - 是否显示错误提示
   * @param {string} options.errorText - 默认错误提示文字
   * @returns {Promise<*>} 操作结果
   */
  async safeExecute(action, options = {}) {
    const {
      showLoading = true,
      loadingText = '加载中...',
      showError = true,
      errorText = '操作失败'
    } = options

    try {
      if (showLoading) {
        this.showLoading(loadingText)
      }

      const result = await action()

      if (showLoading) {
        this.hideLoading()
      }

      return result
    } catch (error) {
      if (showLoading) {
        this.hideLoading()
      }

      const message = this.handleError(error, errorText)

      if (showError) {
        this.showError(message)
      }

      throw error
    }
  }
}

module.exports = BaseViewModel


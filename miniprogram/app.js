const config = require('/utils/config.js')
const util = require('/utils/util.js')
App({
  onLaunch: async function () {

    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
        env: config.env
      })
      
      // 初始化 openId
      await this.initOpenId()
      
      //this.bindLastLoginDate()
    }
    this.updateManager();
    this.getAdvertConfig();
  },

  /**
   * 初始化 openId
   */
  initOpenId: async function() {
    try {
      // 先从缓存中获取
      const cachedOpenId = wx.getStorageSync('openid');
      if (cachedOpenId) {
        this.globalData.openid = cachedOpenId
        console.info('✅ 从缓存获取 openId:', this.globalData.openid)
        return cachedOpenId
      }

      // 缓存中没有，调用云函数获取
      console.info('📡 开始调用云函数获取 openId...')
      const openId = await this.getOpenIdFromCloud()
      
      if (openId) {
        this.globalData.openid = openId
        wx.setStorageSync('openid', openId)
        console.info('✅ 获取到 openId:', this.globalData.openid)
        return openId
      } else {
        console.error('❌ 未能获取到有效的 openId')
        return null
      }
    } catch (error) {
      console.error('❌ 初始化 openId 失败:', error)
      return null
    }
  },

  /**
   * 从云函数获取 openId (Promise 方式)
   */
  getOpenIdFromCloud: function() {
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'login',
        data: {},
        success: res => {
          console.info("-----云函数调用成功-----")
          console.info('完整返回结果:', res)
          console.info('result 对象:', res.result)
          
          // 检查返回结果的结构
          if (res.result && res.result.success === false) {
            console.error('❌ 云函数执行失败:', res.result.error)
            console.error('错误详情:', res.result)
            reject(new Error(res.result.error || '云函数执行失败'))
            return
          }
          
          // 处理成功的情况
          if (res.result && res.result.openid) {
            resolve(res.result.openid)
          } else {
            console.error('❌ 云函数返回结果中没有 openid')
            console.error('返回的 result:', res.result)
            reject(new Error('云函数返回结果中没有 openid'))
          }
        },
        fail: err => {
          console.error('❌ [云函数] [login] 调用失败', err)
          console.error('错误详情:', JSON.stringify(err))
          reject(err)
        }
      })
    })
  },

  /**
   * 确保获取到 openId (供其他页面调用)
   * @returns {Promise<string|null>} 返回 openId 或 null
   */
  ensureOpenId: async function() {
    // 如果已经有 openId，直接返回
    if (this.globalData.openid) {
      return this.globalData.openid
    }

    // 尝试重新初始化
    console.info('🔄 重新初始化 openId...')
    return await this.initOpenId()
  },

  /**
   * 检查 openId 是否有效
   * @returns {boolean}
   */
  hasValidOpenId: function() {
    return !!(this.globalData.openid && this.globalData.openid.trim())
  },

  /**
   * 登录验证
   * @param {} cb 
   */
  checkUserInfo: function (cb) {
    let that = this
    if (that.globalData.userInfo) {
      typeof cb == "function" && cb(that.globalData.userInfo, true);
    } else {
      wx.getSetting({
        success: function (res) {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称
            wx.getUserInfo({
              success: function (res) {
                that.globalData.userInfo = JSON.parse(res.rawData);
                typeof cb == "function" && cb(that.globalData.userInfo, true);
              }
            })
          } else {
            typeof cb == "function" && cb(that.globalData.userInfo, false);
          }
        }
      })
    }
  },
  /**
   * 初始化最后登录时间
   */
  bindLastLoginDate: function () {
    var lastLoginDate = wx.getStorageSync('lastLoginDate');
    console.info(lastLoginDate)
    if (!lastLoginDate || util.formatTime(new Date()) != lastLoginDate) {
      wx.showTabBarRedDot({
        index: 1,
      })
    }
    this.globalData.lastLoginDate = util.formatTime(new Date())
    console.info(this.globalData.lastLoginDate)
    wx.setStorageSync('lastLoginDate', this.globalData.lastLoginDate);
  },
  /**
   * 小程序主动更新
   */
  updateManager() {
    if (!wx.canIUse('getUpdateManager')) {
      return false;
    }
    const updateManager = wx.getUpdateManager();
    updateManager.onCheckForUpdate(function (res) {
    });
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '有新版本',
        content: '新版本已经准备好，即将重启',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            updateManager.applyUpdate()
          }
        }
      });
    });
    updateManager.onUpdateFailed(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本下载失败',
        showCancel: false
      })
    });
  },
  /**
   * 获取广告信息
   */
  getAdvertConfig: function () {
    const api = require('/utils/api.js')
    api.getAdvertConfig().then(res => {
      try {
        this.globalData.advert = res.result.value
      }
      catch (err) {
        console.info(err)
      }
    })
  },
  globalData: {
    openid: "",
    userInfo: null,
    advert: {},
    lastLoginDate: ""//最后登录时间
  }
})

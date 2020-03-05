const config = require('../../utils/config.js')
const util = require('../../utils/util.js')
const api = require('../../utils/api.js');
const regeneratorRuntime = require('../../utils/runtime.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    showLogin: false,
    isAuthor: false,
    showRedDot: '',
    signedDays: 0,//连续签到天数
    signed: 0,
    isShow: false,
    signBtnTxt: "每日签到",
    iconList: [{
      icon: 'favorfill',
      color: 'grey',
      badge: 0,
      name: '我的收藏',
      bindtap: "bindCollect"
    }, {
      icon: 'appreciatefill',
      color: 'green',
      badge: 0,
      name: '我的点赞',
      bindtap: "bindZan"
    }, {
      icon: 'noticefill',
      color: 'yellow',
      badge: 0,
      name: '我的消息',
      bindtap: "bindNotice"
    }, {
      icon: 'goodsfavor',
      color: 'orange',
      badge: 0,
      name: '我的积分',
      bindtap: "bindPoint"
    }],
  },

  onShow: async function () {
    await this.getMemberInfo()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let that = this;
    let showRedDot = wx.getStorageSync('showRedDot');
    console.info(showRedDot)

    console.info(showRedDot != '1')
    that.setData({
      showRedDot: showRedDot
    });
    await that.checkAuthor()
    //await that.getMemberInfo()
  },
  /**
   * 返回
   */
  navigateBack: function (e) {
    wx.switchTab({
      url: '../index/index'
    })
  },

  /**
   * 获取用户头像
   * @param {} e 
   */
  getUserInfo: function (e) {
    console.log(e.detail.userInfo)
    if (e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        showLogin: !this.data.showLogin,
        userInfo: e.detail.userInfo
      });
    } else {
      wx.switchTab({
        url: '../index/index'
      })
    }
  },
  /**
   * 展示打赏二维码
   * @param {} e 
   */
  showQrcode: async function (e) {
    wx.previewImage({
      urls: [config.moneyUrl],
      current: config.moneyUrl
    })
  },
  /**
   * 展示微信二维码
   * @param {*} e 
   */
  showWechatCode: async function (e) {
    wx.previewImage({
      urls: [config.wechatUrl],
      current: config.wechatUrl
    })
  },
  /**
   * 跳转我的收藏
   * @param {*} e 
   */
  bindCollect: async function (e) {
    wx.navigateTo({
      url: '../mine/collection/collection?type=1'
    })
  },
  /**
   * 跳转我的点赞 
   * @param {*} e 
   */
  bindZan: async function (e) {
    wx.navigateTo({
      url: '../mine/collection/collection?type=2'
    })
  },

  /**
   * 后台设置
   * @param {} e 
   */
  showAdmin: async function (e) {
    wx.navigateTo({
      url: '../admin/index'
    })
  },

  /**
   * 历史版本
   * @param {} e 
   */
  showRelease: async function (e) {
    wx.navigateTo({
      url: '../mine/release/release'
    })
  },

  /**
   * 我的消息
   * @param {*} e 
   */
  bindNotice: async function (e) {
    wx.navigateTo({
      url: '../mine/notice/notice'
    })
  },

  /**
   * 签到列表
   * @param {*} e 
   */
  btnSigned: async function (e) {
    wx.navigateTo({
      url: '../mine/sign/sign?signedDays=' + this.data.signedDays + '&signed=' + this.data.signed
    })
  },

  /**
   * 我的积分
   * @param {} e 
   */
  bindPoint: async function (e) {
    this.setData({
      isShow: true
    })
  },

  /**
   * 验证是否是管理员
   */
  checkAuthor: async function (e) {
    let that = this;
    const value = wx.getStorageSync('isAuthor')
    if (value) {
      console.info(value)
      that.setData({
        isAuthor: value
      })
    }
    else {
      let res = await api.checkAuthor();
      console.info(res)
      wx.setStorageSync('isAuthor', res.result)
      that.setData({
        isAuthor: res.result
      })
    }
  },

  /**
   * 获取用户信息
   * @param {} e 
   */
  getMemberInfo: async function (e) {

    let that = this
    try {
      let res = await api.getMemberInfo(app.globalData.openid)
      console.info(res)
      if (res.data.length > 0) {
        let memberInfo = res.data[0]
        that.setData({
          signedDays: memberInfo.continueSignedCount,
          signed: util.formatTime(new Date()) == memberInfo.lastSignedDate ? 1 : 0,
          signBtnTxt: util.formatTime(new Date()) == memberInfo.lastSignedDate ? "今日已签到" : "每日签到"
        })
      }
    }
    catch (e) {
      console.info(e)
    }
  },
  hideModal(e) {
    this.setData({
      isShow: false
    })
  },
})


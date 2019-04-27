const api = require('../../utils/api.js');
const regeneratorRuntime = require('../../utils/runtime.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    showLogin: false

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    app.checkUserInfo(function (userInfo, isLogin) {
      if (!isLogin) {
        that.setData({
          showLogin: true
        })
      } else {
        that.setData({
          userInfo: userInfo
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

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
  showQrcode: async function(e){
    wx.previewImage({
      urls: ['https://test-91f3af.tcb.qcloud.la/common/WechatIMG66.jpeg?sign=38e2cccbf86dd602ae575c89b2911b16&t=1556369699'],
      current: 'https://test-91f3af.tcb.qcloud.la/common/WechatIMG66.jpeg?sign=38e2cccbf86dd602ae575c89b2911b16&t=1556369699'
    })
  },
  showWechatCode:async function(e){
    wx.previewImage({
      urls: ['https://test-91f3af.tcb.qcloud.la/common/WechatIMG2.jpeg?sign=e81a38eec6cebfc82c1c34bb7e233bae&t=1556369822'],
      current: 'https://test-91f3af.tcb.qcloud.la/common/WechatIMG2.jpeg?sign=e81a38eec6cebfc82c1c34bb7e233bae&t=1556369822'
    })
  }
})


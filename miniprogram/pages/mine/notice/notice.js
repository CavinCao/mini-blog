const regeneratorRuntime = require('../../../utils/runtime.js');
const api = require('../../../utils/api.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navItems: [{ name: '与我相关', index: 1 }, { name: '系统消息', index: 2 }],
    tabCur: 1,
    scrollLeft: 0,
    page: 1,
    nodata: false,
    nomore: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

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
 * tab切换
 * @param {} e 
 */
  tabSelect: async function (e) {
    let that = this;
    console.log(e);
    that.setData({
      tabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60,
      nomore: false,
      nodata: false,
      page: 1
    })
  },
})
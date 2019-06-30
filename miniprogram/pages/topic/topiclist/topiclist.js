const api = require('../../../utils/api.js');
const regeneratorRuntime = require('../../../utils/runtime.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    posts: [],
    page: 1,
    nodata: false,
    nomore: false,
    classify:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:async function (options) {
    let that = this;
    let classify = options.classify;
    that.setData({
      classify:classify
    })
    await this.getPostsList(classify)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh:async function () {
    let that = this;
    let page = 1
    that.setData({
      page: page,
      posts: [],
      filter: "",
      nomore: false,
      nodata: false,
      defaultSearchValue: ""
    })
    await this.getPostsList(that.data.classify)
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom:async function () {
    await this.getPostsList(this.data.classify)
  },

  /**
  * 获取文章列表
*/
  getPostsList: async function (filter) {
    wx.showLoading({
      title: '加载中...',
    })
    let that = this
    let page = that.data.page
    if (that.data.nomore) {
      wx.hideLoading()
      return
    }
    let where={
      classify:filter,
      isShow:1
    }
    let result = await api.getNewPostsList(page, where)
    if (result.data.length === 0) {
      that.setData({
        nomore: true
      })
      if (page === 1) {
        that.setData({
          nodata: true
        })
      }
    }
    else {
      that.setData({
        page: page + 1,
        posts: that.data.posts.concat(result.data),
      })
    }
    wx.hideLoading()
  },
  bindPostDetail:function(e)
  {
    let blogId = e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + blogId
    })
  }

})
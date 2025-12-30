// 【MVVM架构】引入 ViewModel 替代 api.js
const PostViewModel = require('../../viewmodels/PostViewModel.js');
const AdminViewModel = require('../../viewmodels/AdminViewModel.js');
const MemberViewModel = require('../../viewmodels/MemberViewModel.js');
const config = require('../../utils/config.js');

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    posts: [],
    page: 1,
    filter: "",
    nodata: false,
    nomore: false,
    defaultSearchValue: "",
    whereItem: ['', 'createTime', ''],//下拉查询条件
    showLogin: false,
    activities: [],
    iconList: config.indexIconList
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let that = this
    
    // 初始化 ViewModel
    this.postViewModel = new PostViewModel()
    this.adminViewModel = new AdminViewModel()
    this.memberViewModel = new MemberViewModel()
    
    //有openid跳授权计算积分
    if (options.openid) {
      let shareOpenId = options.openid
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

      if (that.data.userInfo) {
        let info = {
          shareOpenId: shareOpenId,
          nickName: app.globalData.userInfo.nickName,
          avatarUrl: app.globalData.userInfo.avatarUrl
        }
        // 【MVVM架构】使用 MemberViewModel
        await this.memberViewModel.addShareDetail(info)
      }
    }
    await that.getPostsList('', 'createTime')
    await that.getActivities()
  },

  /**
   * 获取活动配置
   */
  getActivities: async function () {
    try {
      const response = await this.adminViewModel.getActivityConfig()
      if (response.success && response.data) {
        this.setData({
          activities: response.data
        })
      }
    } catch (error) {
      console.error('获取活动配置失败:', error)
    }
  },

  /**
   * 活动位点击跳转
   */
  handleActivityClick: function (e) {
    const url = e.currentTarget.dataset.url
    if (url) {
      if (url.startsWith('http')) {
        // 如果是外部链接，可以跳转到 web-view 页面（如有）或者直接提示
        wx.showToast({ title: '外部链接请手动复制', icon: 'none' })
      } else {
        wx.navigateTo({ url })
      }
    }
  },

  /**
   * 功能图标点击
   */
  handleIconClick: function (e) {
    const item = e.currentTarget.dataset.item
    if (item.url) {
      if (item.jumpType === 'switchTab') {
        wx.switchTab({
          url: item.url
        })
      } else {
        wx.navigateTo({
          url: item.url
        })
      }
    } else {
      let title = item.name + ' 功能开发中...'
      if (item.type === 'article') {
        title = '已在下方文章列表'
      }
      wx.showToast({
        title: title,
        icon: 'none'
      })
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: async function () {
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
    await this.getPostsList("")
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: async function () {
    let whereItem = this.data.whereItem
    let filter = this.data.filter
    await this.getPostsList(whereItem[0], whereItem[1], whereItem[2])
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
   * 点击文章明细
   */
  bindPostDetail: function (e) {
    let blogId = e.currentTarget.id;
    wx.navigateTo({
      url: '../detail/detail?id=' + blogId
    })
  },
  /**
   * 搜索功能
   * @param {} e 
   */
  bindconfirm: async function (e) {
    wx.navigateTo({
      url: '../articleSearch/articleSearch?filter=' + e.detail.value
    })
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
   * 获取文章列表
   * 【MVVM架构】使用 PostViewModel 替代 api.js
   */
  getPostsList: async function (filter, orderBy, label) {
    wx.showLoading({
      title: '加载中...',
    })
    let that = this
    let page = that.data.page
    if (that.data.nomore) {
      wx.hideLoading()
      return
    }
    
    // 【MVVM架构】使用 PostViewModel 获取文章列表
    const response = await this.postViewModel.getPostsList({
      page: page,
      filter: filter || '',
      isShow: 1,
      orderBy: orderBy || 'createTime',
      label: label || '',
      limit: 10
    })
    
    wx.hideLoading()
    
    if (response.success) {
      const { list, hasMore, isEmpty } = response.data
      
      if (isEmpty) {
        that.setData({
          nomore: true,
          nodata: true
        })
      } else if (!hasMore) {
        that.setData({
          nomore: true,
          posts: that.data.posts.concat(list)
        })
      } else {
        that.setData({
          page: page + 1,
          posts: that.data.posts.concat(list)
        })
      }
    } else {
      // 处理错误情况
      wx.showToast({
        title: response.message || '加载失败',
        icon: 'none'
      })
    }
  }
})
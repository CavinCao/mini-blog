// 【MVVM架构】引入 ViewModel 替代 api.js
const PostViewModel = require('../../viewmodels/PostViewModel.js');
const AdminViewModel = require('../../viewmodels/AdminViewModel.js');
const MemberViewModel = require('../../viewmodels/MemberViewModel.js');

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
    navItems: [{ name: '最新', index: 1 }, { name: '热门', index: 2 }, { name: '标签', index: 3 }],
    tabCur: 1,
    scrollLeft: 0,
    showHot: false,
    showLabels: false,
    hotItems: ["浏览最多", "评论最多", "点赞最多", "收藏最多"],
    hotCur: 0,
    labelList: [],
    labelCur: "全部",
    whereItem: ['', 'createTime', ''],//下拉查询条件
    showLogin: false,
    activities: [],
    iconList: [
      { name: '文章', icon: 'newsfill', color: 'orange', type: 'article' },
      { name: '专题', icon: 'explorefill', color: 'blue', type: 'classify' },
      { name: 'git', icon: 'github', color: 'black', type: 'git' },
      { name: '问答', icon: 'questionfill', color: 'green', type: 'qa' },
      { name: '提示词', icon: 'commandfill', color: 'cyan', type: 'prompt' },
      { name: '手绘', icon: 'picfill', color: 'pink', type: 'draw' },
      { name: 'AI', icon: 'discoverfill', color: 'purple', type: 'ai' },
      { name: '我的开源', icon: 'link', color: 'red', type: 'open_source' }
    ]
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
    switch (item.type) {
      case 'article':
        // 已经在首页展示文章了，可以跳转到分类或者特定页面
        wx.showToast({ title: '已在下方文章列表', icon: 'none' })
        break
      case 'classify':
        wx.navigateTo({ url: '../topic/topic' })
        break
      case 'git':
        wx.navigateTo({ url: '../git/git' })
        break
      default:
        wx.showToast({
          title: item.name + ' 功能开发中...',
          icon: 'none'
        })
        break
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
    let that = this;
    console.log('e.detail.value', e.detail.value)
    let page = 1
    that.setData({
      page: page,
      posts: [],
      filter: e.detail.value,
      nomore: false,
      nodata: false,
      whereItem: [e.detail.value, 'createTime', '']
    })
    await this.getPostsList(e.detail.value, 'createTime')
  },

  /**
 * tab切换
 * @param {} e 
 */
  tabSelect: async function (e) {
    let that = this;
    console.log(e);
    let tabCur = e.currentTarget.dataset.id
    switch (tabCur) {
      case 1: {
        that.setData({
          tabCur: e.currentTarget.dataset.id,
          scrollLeft: (e.currentTarget.dataset.id - 1) * 60,
          nomore: false,
          nodata: false,
          showHot: false,
          showLabels: false,
          defaultSearchValue: "",
          posts: [],
          page: 1,
          whereItem: ['', 'createTime', '']
        })

        await that.getPostsList("", 'createTime')
        break
      }
      case 2: {
        that.setData({
          posts: [],
          tabCur: e.currentTarget.dataset.id,
          scrollLeft: (e.currentTarget.dataset.id - 1) * 60,
          showHot: true,
          showLabels: false,
          defaultSearchValue: "",
          page: 1,
          nomore: false,
          nodata: false,
          whereItem: ['', 'totalVisits', '']
        })
        await that.getPostsList("", "totalVisits")
        break
      }
      case 3: {
        that.setData({
          tabCur: e.currentTarget.dataset.id,
          scrollLeft: (e.currentTarget.dataset.id - 1) * 60,
          showHot: false,
          showLabels: true,
        })

        let task = that.getPostsList("", 'createTime')
        // 【MVVM架构】使用 AdminViewModel 获取标签列表
        let labelResponse = await this.adminViewModel.getLabelList()
        if (labelResponse.success) {
          that.setData({
            labelList: labelResponse.data
          })
        }
        await task

        break
      }
    }
  },

  /**
   * 热门按钮切换
   * @param {*} e 
   */
  hotSelect: async function (e) {
    let that = this
    let hotCur = e.currentTarget.dataset.id
    let orderBy = "createTime"
    switch (hotCur) {
      //浏览最多
      case 0: {
        orderBy = "totalVisits"
        break
      }
      //评论最多
      case 1: {
        orderBy = "totalComments"
        break
      }
      //点赞最多
      case 2: {
        orderBy = "totalZans"
        break
      }
      //收藏最多
      case 3: {
        orderBy = "totalCollection"
        break
      }
    }
    that.setData({
      posts: [],
      hotCur: hotCur,
      defaultSearchValue: "",
      page: 1,
      nomore: false,
      nodata: false,
      whereItem: ['', orderBy, '']
    })
    await that.getPostsList("", orderBy)
  },

  /**
   * 标签按钮切换
   * @param {*} e 
   */
  labelSelect: async function (e) {
    let that = this
    let labelCur = e.currentTarget.dataset.id

    that.setData({
      posts: [],
      labelCur: labelCur,
      defaultSearchValue: "",
      page: 1,
      nomore: false,
      nodata: false,
      whereItem: ['', 'createTime', labelCur == "全部" ? "" : labelCur]
    })

    await that.getPostsList("", "createTime", labelCur == "全部" ? "" : labelCur)
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
      filter: filter,
      isShow: 1,
      orderBy: orderBy,
      label: label
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
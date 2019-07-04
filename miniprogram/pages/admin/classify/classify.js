const api = require('../../../utils/api.js');
const regeneratorRuntime = require('../../../utils/runtime.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navItems: [{ name: '未关联', index: 1 }, { name: '已关联', index: 2 }],
    tabCur: 1,
    scrollLeft: 0,
    btnName: "保存关联",
    curClassifyName: "",
    classifyList: [],
    classifyName: "",
    classifyDesc: "",
    isClassifyModelShow: false,
    isClassifyRelatedShow: false,
    nomore: false,
    nodata: false,
    page: 1,
    filter: {},
    posts: [],
    checkedList: [],
    canOperate: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    await this.getClassifyList()
  },

  /**
 * tab切换
 * @param {} e 
 */
  tabSelect: async function (e) {
    let that = this;
    let tabCur = e.currentTarget.dataset.id
    let filter;
    if (tabCur === 1) {
      filter = {
        isShow: 1,
        containClassify: 2,
        classify: that.data.curClassifyName
      }
    }
    else {
      filter = {
        isShow: 1,
        containClassify: 1,
        classify: that.data.curClassifyName
      }
    }

    that.setData({
      tabCur: tabCur,
      btnName: tabCur === 1 ? "保存关联" : "取消关联",
      scrollLeft: (tabCur - 1) * 60,
      nomore: false,
      nodata: false,
      page: 1,
      posts: [],
      filter: filter,
      checkedList: []
    })
    await that.getPostsList(filter)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: async function () {
    let that = this;
    that.setData({
      classifyList: []
    })
    await this.getClassifyList()
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  /**
   * 获取专题集合
   * @param {*} e 
   */
  getClassifyList: async function () {
    let that = this
    let classifyList = await api.getClassifyList()
    console.info(classifyList)
    that.setData({
      classifyList: classifyList.result.data
    })
  },
  /**
    * 显示
    * @param {} e 
  */
  showClassifyModal(e) {
    this.setData({
      isClassifyModelShow: true
    })
  },
  showClassifyRelatedModal: async function (e) {
    let that = this
    let curClassifyName = e.currentTarget.dataset.classify
    let filter = {
      isShow: 1,
      containClassify: 2,
      classify: curClassifyName
    }

    that.setData({
      curClassifyName: curClassifyName,
      isClassifyRelatedShow: true,
      filter: filter,
      nomore: false,
      nodata: false,
      page: 1,
      posts: [],
      checkedList: [],
      canOperate: true
    })

    await that.getPostsList(filter)
  },
  /**
    * 隐藏
    * @param {*} e 
  */
  hideClassifyModal(e) {
    this.setData({
      isClassifyModelShow: false
    })
  },
  hideClassifyRelatedModal(e) {
    this.setData({
      isClassifyRelatedShow: false,
      nomore: false,
      nodata: false,
      page: 1,
      posts: [],
      curClassifyName: "",
      checkedList: [],
      tabCur: 1,
      scrollLeft: 0
    })
  },
  /**
   * 保存标签
   * @param {*} e 
   */
  formClassifySubmit: async function (e) {
    let that = this;
    let classifyName = e.detail.value.classifyName;
    let classifyDesc = e.detail.value.classifyDesc;
    if (classifyName === undefined || classifyName === "") {
      wx.showToast({
        title: '请填写正确的专题',
        icon: 'none',
        duration: 1500
      })
    }
    else {
      wx.showLoading({
        title: '保存中...',
      })

      let res = await api.addBaseClassify(classifyName, classifyDesc)
      console.info(res)
      wx.hideLoading()
      if (res.result) {
        that.setData({
          isClassifyModelShow: false,
          classifyName: "",
          classifyDesc: ""
        })

        that.onPullDownRefresh()

        wx.showToast({
          title: '保存成功',
          icon: 'none',
          duration: 1500
        })
      }
      else {
        wx.showToast({
          title: '保存出错，请查看云函数日志',
          icon: 'none',
          duration: 1500
        })
      }
    }
  },

  /**
   * 删除专题
   * @param {} e 
   */
  deleteClassifyById: async function (e) {
    let classify = e.currentTarget.dataset.classify
    let classifyId = e.currentTarget.id
    let that = this
    wx.showModal({
      title: '提示',
      content: '是否确认删除[' + classify + ']专题',
      success(res) {
        if (res.confirm) {
          api.deleteConfigById(classifyId).then(res => {
            return that.onPullDownRefresh()
          }).then(res => { })
          console.log(res)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  /**
   * 返回上一页
   * @param {*} e 
   */
  goback: async function (e) {
    wx.navigateBack({
      delta: 1
    })
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
    let result = await api.getNewPostsList(page, filter)
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
    that.setData({
      canOperate: true
    })
    wx.hideLoading()
  },

  /**
   *  触发滚动底部事件
   */
  bindscrolltolower: async function () {
    let that = this;
    if(!that.data.canOperate)
    {
      return;
    }

    that.setData({
      canOperate: false
    })

    await that.getPostsList(that.data.filter)

  },

  /**
   * checkBox变化事件
   */
  checkboxChange: async function (e) {
    this.setData({
      checkedList: e.detail.value
    })
  },
  savePostsRelatedClassify: async function (e) {
    let that = this
    let posts = that.data.checkedList
    if (posts.length == 0) {
      wx.showToast({
        title: '没有要保存的数据',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    wx.showLoading({
      title: '处理中...',
    })
    try {
      let res = await api.updateBatchPostsClassify(that.data.curClassifyName, that.data.tabCur == 1 ? "add" : "delete", posts)
      console.info(res)
      if (res.result) {
        wx.showToast({
          title: '处理成功',
          icon: 'none',
          duration: 1500
        })
        that.setData({
          nomore: false,
          nodata: false,
          page: 1,
          posts: [],
          curClassifyName: "",
          isClassifyRelatedShow: false,
          checkedList: [],
          tabCur: 1,
          scrollLeft: 0
        })
      }
      else {
        wx.showToast({
          title: '处理失败',
          icon: 'none',
          duration: 1500
        })
      }
    }
    catch (e) {
      console.info(e)
      wx.showToast({
        title: '处理失败,请重试',
        icon: 'none',
        duration: 1500
      })
    }
    wx.hideLoading()
  }
})
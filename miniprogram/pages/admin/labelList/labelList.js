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
    curLabelName: "",
    labelList: [],
    isLabelModelShow: false,
    isLabelRelatedShow: false,
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
    await this.getLabelList()
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
        containLabel: 2,
        label: that.data.curLabelName
      }
    }
    else {
      filter = {
        isShow: 1,
        containLabel: 1,
        label: that.data.curLabelName
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
      labelList: []
    })
    await this.getLabelList()
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  /**
   * 获取label集合
   * @param {*} e 
   */
  getLabelList: async function () {
    let that = this
    let labelList = await api.getLabelList()
    console.info(labelList)
    that.setData({
      labelList: labelList.result.data
    })
  },

  /**
    * 显示
    * @param {} e 
  */
  showLabelModal(e) {
    this.setData({
      isLabelModelShow: true
    })
  },
  showLabelRelatedModal: async function (e) {
    let that = this
    let curLabelName = e.currentTarget.dataset.labelname
    let filter = {
      isShow: 1,
      containLabel: 2,
      label: curLabelName
    }

    that.setData({
      curLabelName: curLabelName,
      isLabelRelatedShow: true,
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
  hideLabelModal(e) {
    this.setData({
      isLabelModelShow: false
    })
  },
  hideLabelRelatedModal(e) {
    this.setData({
      isLabelRelatedShow: false,
      nomore: false,
      nodata: false,
      page: 1,
      posts: [],
      curLabelName: "",
      checkedList: [],
      tabCur: 1,
      scrollLeft: 0
    })
  },
  /**
   * 保存标签
   * @param {*} e 
   */
  formLabelSubmit: async function (e) {
    let that = this;
    let labelName = e.detail.value.labelName;
    if (labelName === undefined || labelName === "") {
      wx.showToast({
        title: '请填写正确的标签',
        icon: 'none',
        duration: 1500
      })
    }
    else {
      wx.showLoading({
        title: '保存中...',
      })

      let res = await api.addBaseLabel(labelName)
      console.info(res)
      wx.hideLoading()
      if (res.result) {
        that.setData({
          isLabelModelShow: false,
          labelName: ""
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
   * 删除标签
   * @param {*} e 
   */
  deleteLabelById: async function (e) {
    let labelName = e.currentTarget.dataset.labelname
    let labelId = e.currentTarget.id
    let that = this
    wx.showModal({
      title: '提示',
      content: '是否确认删除[' + labelName + ']标签',
      success(res) {
        if (res.confirm) {
          api.deleteConfigById(labelId).then(res => {
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
    that.getPostsList(that.data.filter)
  },

  /**
   * checkBox变化事件
   */
  checkboxChange: async function (e) {
    this.setData({
      checkedList: e.detail.value
    })
  },
  savePostsRelatedLabel: async function (e) {
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
      console.info(that.data.curLabelName)
      let res = await api.updateBatchPostsLabel(that.data.curLabelName, that.data.tabCur == 1 ? "add" : "delete", posts)
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
          curLabelName: "",
          isLabelRelatedShow: false,
          checkedList: [],
          tabCur: 1,
          scrollLeft: 0,
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
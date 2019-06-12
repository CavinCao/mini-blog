const api = require('../../../utils/api.js');
const regeneratorRuntime = require('../../../utils/runtime.js');
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
    articlePath: "../article/article",
    isShowModel: false,
    showModelTitle: "文章是否显示",
    showModelContent: "",
    showCurPostId: "",
    showCurStatus: 0,
    selectedLabels: [],
    otherLabels: [],
    isShowLabelModel: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    await this.getPostsList('')
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
    let filter = this.data.filter
    await this.getPostsList(filter, -1)
  },
  /**
   * 搜索功能
   * @param {} e 
   */
  bindconfirm: async function (e) {
    let that = this;
    console.log('e.detail.value', e.detail.value.searchContent)
    let page = 1
    that.setData({
      page: page,
      posts: [],
      filter: e.detail.value.searchContent,
      nomore: false,
      nodata: false
    })
    await this.getPostsList(e.detail.value.searchContent, -1)
  },
  /**
   * 设置隐藏
   * @param {*} e 
   */
  hideShowModal: function (e) {
    this.setData({
      isShowModel: false
    })
  },
  /**
   * 设置隐藏
   * @param {*} e 
   */
  hideLabelModal: function (e) {
    this.setData({
      isShowLabelModel: false
    })
  },
  /**
   * 显示设置文章窗口
   * @param {*} e 
   */
  showModal: function (e) {
    let that = this
    let isShow = e.currentTarget.dataset.isshow
    let postId = e.currentTarget.dataset.postid

    that.setData({
      isShowModel: true,
      showModelContent: isShow == 1 ? "是否确认将文章设置为[前端不展示]" : "是否确认将文章设置为[前端展示]",
      showCurPostId: postId,
      showCurStatus: isShow
    })
  },

  /**
   * 显示设置文章标签窗口
   * @param {*} e 
   */
  showLabelModal: async function (e) {
    wx.showLoading({
      title: '标签加载中...',
    })

    let that = this
    let postId = e.currentTarget.dataset.postid
    let label = e.currentTarget.dataset.label
    let labelList = await api.getLabelList()
    let otherLabels = []
    if (label.length > 0) {
      for (var i = 0; i < label.length; i++) {
        otherLabels.push({
          name: label[i],
          checked: true
        })
      }
    }

    for (var index in labelList.result.data) {
      let labelRes = otherLabels.filter((a) => labelList.result.data[index].value == a.name)
      if (labelRes.length > 0) { continue; }

      otherLabels.push({
        name: labelList.result.data[index].value,
        checked: false
      })
    }

    that.setData({
      isShowLabelModel: true,
      selectedLabels: label,
      otherLabels: otherLabels,
      showCurPostId: postId
    })

    wx.hideLoading()

  },

  /**
   * 选择标签
   * @param {} e 
   */
  chooseLabelCheckbox(e) {
    let that = this
    let selectedLabels = that.data.selectedLabels
    let otherLabels = that.data.otherLabels;
    let name = e.currentTarget.dataset.value;
    let checked = e.currentTarget.dataset.checked;

    for (let i = 0; i < otherLabels.length; i++) {
      if (otherLabels[i].name == name) {
        otherLabels[i].checked = !otherLabels[i].checked;
        break
      }
    }
    if (checked) {
      var index = selectedLabels.indexOf(name);
      if (index > -1) {
        selectedLabels.splice(index, 1);
      }
    }
    else {
      selectedLabels.push(name)
    }

    this.setData({
      otherLabels: otherLabels,
      selectedLabels: selectedLabels
    })
  },

  /**
   * 保存标签信息
   * @param {*} e 
   */
  saveLabelModal: async function (e) {
    wx.showLoading({
      title: '保存中...',
    })

    try {
      let that = this
      let postId = that.data.showCurPostId
      let newPost = {
        label: that.data.selectedLabels
      }

      let res = await api.upsertPosts(postId === undefined ? "" : postId, newPost)
      if (res.result) {
        that.setData({
          isShowLabelModel: false,
          selectedLabels: [],
          otherLabels:[],
          showCurPostId: ""
        })

        await that.onPullDownRefresh()

        wx.showToast({
          title: '设置成功',
          icon: 'success',
          duration: 1500
        })
      }
      else
      {
        wx.showToast({
          title: '操作发生未知异常',
          duration: 1500
        })
      }
    }
    catch (err) {
      wx.showToast({
        title: '程序有一点点小异常，操作失败啦',
        icon: 'none',
        duration: 1500
      })
      console.info(err)
    }
    finally {
      wx.hideLoading()
    }

  },
  /**
   * 前端是否展示
   * @param {*} e 
   */
  saveShowModal: async function (e) {

    wx.showLoading({
      title: '加载中...',
    })
    try {
      let that = this;
      let updateShow = that.data.showCurStatus == 0 ? 1 : 0
      let res = await api.updatePostsShowStatus(that.data.showCurPostId, updateShow)
      console.info(res)
      if (res.result) {
        that.setData({
          isShowModel: false,
          showModelContent: "",
          showCurPostId: "",
          showCurStatus: -1
        })

        await that.onPullDownRefresh()

        wx.showToast({
          title: '设置成功',
          icon: 'success',
          duration: 1500
        })
      }
      else {
        wx.showToast({
          title: '操作发生未知异常',
          duration: 1500
        })
      }
    } catch (err) {
      wx.showToast({
        title: '程序有一点点小异常，操作失败啦',
        icon: 'none',
        duration: 1500
      })
      console.info(err)
    }
    finally {
      wx.hideLoading()
    }


  },
  /**
    * 获取文章列表
  */
  getPostsList: async function (filter, isShow) {
    wx.showLoading({
      title: '加载中...',
    })
    let that = this
    let page = that.data.page
    if (that.data.nomore) {
      wx.hideLoading()
      return
    }
    let result = await api.getPostsList(page, filter, isShow)
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

  /**
   * 点击文章明细
   */
  bindPostDetail: function (e) {
    let blogId = e.currentTarget.id;
    wx.navigateTo({
      url: '../article/article?id=' + blogId
    })
  },
})
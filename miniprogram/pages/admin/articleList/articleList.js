// 【MVVM架构】引入 ViewModel
const AdminViewModel = require('../../../viewmodels/AdminViewModel.js')
const PostViewModel = require('../../../viewmodels/PostViewModel.js')

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
    isShowDeleteModel: false,
    showModelTitle: "文章是否显示",
    showModelContent: "",
    showCurPostId: "",//当前操作的文章id
    showCurStatus: 0,
    selectedLabels: [],
    otherLabels: [],
    isShowLabelModel: false,
    isShowClassifyModel: false,
    classifyList: [],
    showCurClassify: "",
    navItems: [{ name: '已展示', index: 1 }, { name: '未展示', index: 2 }, { name: '有专题', index: 3 }, { name: '无专题', index: 4 }, { name: '有标签', index: 5 }, { name: '无标签', index: 6 }],
    tabCur: 1,
    scrollLeft: 0,
    where: { isShow: 1 }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: async function (options) {
    // 【MVVM架构】初始化 ViewModel
    this.adminViewModel = new AdminViewModel()
    this.postViewModel = new PostViewModel()

    let that = this;
    let page = 1
    that.setData({
      page: page,
      posts: [],
      nomore: false,
      nodata: false
    })
    let where = {
      isShow: 1
    }
    await this.getPostsList(where)
  },


  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: async function () {
    let where = this.data.where
    await this.getPostsList(where)
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
      nomore: false,
      nodata: false
    })
    await this.getPostsList(that.data.where)
    wx.stopPullDownRefresh();
  },

  /**
* tab切换
* @param {} e 
*/
  tabSelect: async function (e) {
    let that = this;
    let tabCur = e.currentTarget.dataset.id
    let where = {}
    that.setData({
      tabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60,
      nomore: false,
      nodata: false,
      defaultSearchValue: "",
      posts: [],
      page: 1
    })
    switch (tabCur) {
      case 1: {
        where.isShow = 1
        break
      }
      case 2: {
        where.isShow = 0
        break
      }
      case 3: {
        where.hasClassify = 1;
        break
      }
      case 4: {
        where.hasClassify = 2;
        break;
      }
      case 5: {
        where.hasLabel = 1;
        break;
      }
      case 6: {
        where.hasLabel = 2;
        break
      }
    }

    that.setData({
      where: where
    })
    await that.getPostsList(where)
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
   * 设置隐藏
   * @param {*} e 
   */
  hideClassifyModal: function (e) {
    this.setData({
      isShowClassifyModel: false
    })
  },
  hideShowDeleteModal: function (e) {
    this.setData({
      isShowDeleteModel: false
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

  showDeleteModal: function (e) {
    let that = this
    let postId = e.currentTarget.dataset.postid

    that.setData({
      isShowDeleteModel: true,
      showCurPostId: postId
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

    try {
      let that = this
      let postId = e.currentTarget.dataset.postid
      let label = e.currentTarget.dataset.label

      // 【MVVM架构】使用 AdminViewModel
      const response = await that.adminViewModel.getLabelList()

      if (!response.success) {
        wx.showToast({
          title: response.message || '加载标签失败',
          icon: 'none',
          duration: 1500
        })
        wx.hideLoading()
        return
      }

      let otherLabels = []
      if (label.length > 0) {
        for (var i = 0; i < label.length; i++) {
          otherLabels.push({
            name: label[i],
            checked: true
          })
        }
      }

      for (var index in response.data) {
        let labelRes = otherLabels.filter((a) => response.data[index].value == a.name)
        if (labelRes.length > 0) { continue; }

        otherLabels.push({
          name: response.data[index].value,
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
    } catch (error) {
      console.error('加载标签失败:', error)
      wx.hideLoading()
      wx.showToast({
        title: '加载标签失败',
        icon: 'none',
        duration: 1500
      })
    }
  },

  /**
   * 显示设置专题标签窗口
   * @param {*} e 
   */
  showClassifyModal: async function (e) {
    wx.showLoading({
      title: '专题加载中...',
    })

    try {
      let that = this
      let postId = e.currentTarget.dataset.postid
      let curClassify = e.currentTarget.dataset.classify == 0 ? "" : e.currentTarget.dataset.classify

      // 【MVVM架构】使用 AdminViewModel
      const response = await that.adminViewModel.getClassifyList()

      if (!response.success) {
        wx.showToast({
          title: response.message || '加载专题失败',
          icon: 'none',
          duration: 1500
        })
        wx.hideLoading()
        return
      }

      let classify = []
      if (curClassify != "") {
        classify.push({
          name: curClassify,
          checked: true
        })
      }

      for (var index in response.data) {
        if (curClassify == response.data[index].name) {
          continue;
        }

        classify.push({
          name: response.data[index].name,
          checked: false
        })
      }

      that.setData({
        isShowClassifyModel: true,
        classifyList: classify,
        showCurClassify: curClassify,
        showCurPostId: postId
      })

      wx.hideLoading()
    } catch (error) {
      console.error('加载专题失败:', error)
      wx.hideLoading()
      wx.showToast({
        title: '加载专题失败',
        icon: 'none',
        duration: 1500
      })
    }
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

    that.setData({
      otherLabels: otherLabels,
      selectedLabels: selectedLabels
    })
  },

  /**
   * 专题选择变化事件
   * @param {*} e 
   */
  radioClassifyChange: function (e) {
    let curClassify = e.detail.value
    console.info(curClassify)
    this.setData({
      showCurClassify: curClassify
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

      // 【MVVM架构】使用 AdminViewModel
      const response = await that.adminViewModel.upsertPosts(postId === undefined ? "" : postId, newPost)

      wx.hideLoading()

      if (response.success) {
        that.setData({
          isShowLabelModel: false,
          selectedLabels: [],
          otherLabels: [],
          showCurPostId: ""
        })

        await that.onPullDownRefresh()

        wx.showToast({
          title: '设置成功',
          icon: 'success',
          duration: 1500
        })
      } else {
        wx.showToast({
          title: response.message || '操作失败',
          icon: 'none',
          duration: 1500
        })
      }
    }
    catch (err) {
      wx.hideLoading()
      console.error('保存标签失败:', err)
      wx.showToast({
        title: '程序有一点点小异常，操作失败啦',
        icon: 'none',
        duration: 1500
      })
    }
  },

  /**
   * 保存专题信息
   * @param {*} e 
   */
  saveClassifyModal: async function (e) {
    wx.showLoading({
      title: '保存中...',
    })

    try {
      let that = this
      let postId = that.data.showCurPostId
      let newPost = {
        classify: that.data.showCurClassify
      }

      // 【MVVM架构】使用 AdminViewModel
      const response = await that.adminViewModel.upsertPosts(postId === undefined ? "" : postId, newPost)

      wx.hideLoading()

      if (response.success) {
        that.setData({
          isShowClassifyModel: false,
          classifyList: [],
          showCurClassify: "",
          showCurPostId: ""
        })

        await that.onPullDownRefresh()

        wx.showToast({
          title: '设置成功',
          icon: 'success',
          duration: 1500
        })
      } else {
        wx.showToast({
          title: response.message || '操作失败',
          icon: 'none',
          duration: 1500
        })
      }
    }
    catch (err) {
      wx.hideLoading()
      console.error('保存专题失败:', err)
      wx.showToast({
        title: '程序有一点点小异常，操作失败啦',
        icon: 'none',
        duration: 1500
      })
    }
  },

  /**
   * 设置文章状态
   */
  updatePostsShowStatus: async function (e) {
    wx.showLoading({
      title: '操作中...',
    })

    try {
      let that = this
      let updateShow = that.data.showCurStatus == 1 ? 0 : 1

      // 【MVVM架构】使用 AdminViewModel
      const response = await that.adminViewModel.updatePostsShowStatus(that.data.showCurPostId, updateShow)

      wx.hideLoading()

      if (response.success) {
        that.setData({
          isShowModel: false,
          showModelContent: "",
          showCurPostId: "",
          showCurStatus: 0
        })

        await that.onPullDownRefresh()

        wx.showToast({
          title: '设置成功',
          icon: 'success',
          duration: 1500
        })
      } else {
        wx.showToast({
          title: response.message || '操作失败',
          icon: 'none',
          duration: 1500
        })
      }
    }
    catch (err) {
      wx.hideLoading()
      console.error('更新文章状态失败:', err)
      wx.showToast({
        title: '程序有一点点小异常，操作失败啦',
        icon: 'none',
        duration: 1500
      })
    }
  },

  /**
   * 删除文章
   */
  deletePostById: async function (e) {
    wx.showLoading({
      title: '删除中...',
    })

    try {
      let that = this

      // 【MVVM架构】使用 AdminViewModel
      const response = await that.adminViewModel.deletePostById(that.data.showCurPostId)

      wx.hideLoading()

      if (response.success) {
        that.setData({
          isShowDeleteModel: false,
          showCurPostId: ""
        })

        await that.onPullDownRefresh()

        wx.showToast({
          title: '删除成功',
          icon: 'success',
          duration: 1500
        })
      } else {
        wx.showToast({
          title: response.message || '删除失败',
          icon: 'none',
          duration: 1500
        })
      }
    }
    catch (err) {
      wx.hideLoading()
      console.error('删除文章失败:', err)
      wx.showToast({
        title: '程序有一点点小异常，操作失败啦',
        icon: 'none',
        duration: 1500
      })
    }
  },

  /**
   * 获取文章列表
   * @param {} filter 
   * @param {} where 
   */
  getPostsList: async function (filter, where) {
    let that = this;
    let page = that.data.page;

    try {
      // 【MVVM架构】使用 PostViewModel
      const response = await that.postViewModel.getNewPostsList({
        page: page,
        filter: filter
      })

      if (!response.success) {
        wx.showToast({
          title: response.message || '加载失败',
          icon: 'none',
          duration: 1500
        })
        return
      }

      // response.data 包含 { list, hasMore, isEmpty }
      const list = response.data.list || []
      
      let posts = that.data.posts
      if (page === 1) {
        posts = list
      } else {
        posts = posts.concat(list)
      }

      that.setData({
        posts: posts,
        page: page + 1,
        nodata: posts.length === 0,
        nomore: list.length < 10
      })
    } catch (error) {
      console.error('获取文章列表失败:', error)
      wx.showToast({
        title: '加载失败',
        icon: 'none',
        duration: 1500
      })
    }
  },

  /**
   * 跳转文章编辑
   * @param {*} e 
   */
  goEditArticle: function (e) {
    let postId = e.currentTarget.dataset.postid
    wx.navigateTo({
      url: '../article/article?blogId=' + postId
    })
  },
})

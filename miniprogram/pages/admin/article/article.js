const api = require('../../../utils/api.js');
const regeneratorRuntime = require('../../../utils/runtime.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeholder: "赶快创作你的作品吧...",
    post: {},
    imgList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let that = this;
    let blogId = options.id;

    console.info(blogId)

    wx.createSelectorQuery().select('#editor').context(function (res) {
      that.editorCtx = res.context
    }).exec()
    if (blogId !== undefined) {
      let result = await api.getPostsById(blogId)
      that.setData({
        post: result.data,
        imgList: that.data.imgList.concat(result.data.defaultImageUrl),
      });

      that.editorCtx.setContents({
        html: result.data.content,
        success: (res) => {
          console.log(res)
        },
        fail: (res) => {
          console.log(res)
        }
      })
    }
  },

  /**
   * 文章变化
   * @param {*} e 
   */
  changePostDetail: function (e) {
    let that = this;
    let post = that.data.post
    console.info(e)
    switch (e.target.id) {
      case 'postTitle': {
        post.title = e.detail.value
        break
      }
      case 'postClassify': {
        post.classify = e.detail.value
        break
      }
      case 'postDigest': {
        post.digest = e.detail.value
        break
      }
    }

    that.setData({
      post: post
    })
  },

  /**
   * 除内容之外保存
   * @param {*} e 
   */
  savePostExceptContent: async function (e) {

    wx.showLoading({
      title: '保存中...',
    })

    let that = this;
    let post = that.data.post

    let newPost = {
      title: post.title,
      digest: post.digest
    }

    await api.upsertPosts(post._id === undefined ? "" : post._id, newPost)

    wx.hideLoading()
    wx.showToast({
      title: '保存成功',
      icon: 'none',
      duration: 1500
    })
  },
  /**
   * 保存文章
   * @param {*} e 
   */
  savePost: async function (e) {

    wx.showLoading({
      title: '保存中...',
    })

    let that = this;
    let post = that.data.post
    that.editorCtx.getContents({
      success: (res) => {
        let newPost = {
          content: res.html,
          title: post.title,
          digest: post.digest
        }
        api.upsertPosts(post._id === undefined ? "" : post._id, newPost).then(res => {
          console.info(res)
        })
      },
    })

    wx.hideLoading()
    wx.showToast({
      title: '保存成功',
      icon: 'none',
      duration: 1500
    })
  },
  undo() {
    this.editorCtx.undo()
  },
  redo() {
    this.editorCtx.redo()
  },
  format(e) {
    let { name, value } = e.target.dataset
    if (!name) return
    // console.log('format', name, value)
    this.editorCtx.format(name, value)

  },
  onStatusChange(e) {
    const formats = e.detail
    this.setData({ formats })
  },
  insertDivider() {
    this.editorCtx.insertDivider({
      success: function () {
        console.log('insert divider success')
      }
    })
  },
  clear() {
    this.editorCtx.clear({
      success: function (res) {
        console.log("clear success")
      }
    })
  },
  removeFormat() {
    this.editorCtx.removeFormat()
  },
  insertDate() {
    const date = new Date()
    const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
    this.editorCtx.insertText({
      text: formatDate
    })
  },
})
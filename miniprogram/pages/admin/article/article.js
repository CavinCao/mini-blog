const api = require('../../../utils/api.js');
const regeneratorRuntime = require('../../../utils/runtime.js');
const config = require('../../../utils/config.js')
const util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeholder: "赶快创作你的作品吧...",
    post: {},
    imgList: [],
    isShowModel: false
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
      case 'postOriginalUrl': {
        post.originalUrl = e.detail.value
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
    let that = this;
    let post = that.data.post

    if (post._id === undefined) {
      wx.showToast({
        title: '更新时才能点哦',
        icon: 'none',
        duration: 1500
      })
      return;
    }

    wx.showLoading({
      title: '保存中...',
    })

    let res = await this.getContent()

    let newPost = {
      digest: post.digest, //摘要
      title: post.title,
      originalUrl: post.originalUrl,
      timestamp: new Date().getTime()
    }

    let result = await api.upsertPosts(post._id === undefined ? "" : post._id, newPost)
    if (result.result) {
      wx.hideLoading()
      that.setData({
        isShowModel: true
      })
    }
    else {
      wx.hideLoading()
      wx.showToast({
        title: '保存失败',
        icon: 'none',
        duration: 1500
      })
    }
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
    if (post.title === undefined || post.title == "") {
      wx.showToast({
        title: '标题不能为空',
        icon: 'none',
        duration: 1500
      })
      return;
    }

    let res = await this.getContent()
    let newPost
    if (post._id === undefined) {
      let img = ""
      if (that.data.imgList.length > 0) {
        let filePath = that.data.imgList[0]
        let suffix = /\.[^\.]+$/.exec(filePath)[0];
        let imgRes = await api.uploadFile(new Date().getTime() + suffix, filePath)
        img = imgRes.fileID
      }
      newPost = {
        uniqueId: "",
        sourceFrom: "admin",
        author: "博主",
        title: post.title,
        defaultImageUrl: img,
        createTime: util.formatTime(new Date()),
        timestamp: new Date().getTime(),
        totalComments: 0, //总的点评数
        totalVisits: 200 + Math.floor(Math.random() * 40), //总的访问数
        totalZans: 10 + Math.floor(Math.random() * 40), //总的点赞数
        label: [], //标签
        classify: 0, //分类
        contentType: "html",
        digest: post.digest, //摘要
        isShow: 0, //是否展示
        originalUrl: "",
        content: res,
        totalCollection: 10 + Math.floor(Math.random() * 40)
      }
    }
    else {
      newPost = {
        digest: post.digest, //摘要
        title: post.title,
        timestamp: new Date().getTime(),
        content: res.html,
        originalUrl: post.originalUrl
      }
    }

    let result = await api.upsertPosts(post._id === undefined ? "" : post._id, newPost)
    if (result.result) {
      wx.hideLoading()
      that.setData({
        isShowModel: true
      })
    }
    else {
      wx.hideLoading()
      wx.showToast({
        title: '保存失败',
        icon: 'none',
        duration: 1500
      })
    }
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
  /**
   * 获取富文本内容
   */
  getContent: function () {
    let that = this
    return new Promise((resolve, rej) => {
      that.editorCtx.getContents({
        success: (res) => {
          resolve(res.html)
        },
        fail: res => { console.log("请求失败") }
      })
    })
  },
  ChooseImage() {
    wx.chooseImage({
      count: 1, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        if (this.data.imgList.length != 0) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            imgList: res.tempFilePaths
          })
        }
      }
    });
  },
  DelImg(e) {
    wx.showModal({
      title: '删除图片',
      content: '确定要删除该图片吗？',
      cancelText: '取消',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList
          })
        }
      }
    })
  },
  /**
 * 设置隐藏
 * @param {*} e 
 */
  hideShowModal: function (e) {
    this.setData({
      post: {},
      imgList: [],
      isShowModel: false
    })
  },
  showArticleList: function (e) {
    wx.navigateBack({
      delta: 1
    })
  },
  clearAll: function (e) {
    this.setData({
      post: {},
      imgList: []
    })
  }
})
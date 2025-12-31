const config = require('../../utils/config.js')
const util = require('../../utils/util.js')

// 【MVVM架构】引入 ViewModel
const PostViewModel = require('../../viewmodels/PostViewModel.js')

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    post: {},
    isShow: false,
    collection: { status: false, text: "收藏", icon: "favor" },
    zan: { status: false, text: "点赞", icon: "appreciate" },
    showLogin: false,
    userInfo: {},
    showBanner: false,
    showBannerId: "",
    showLogin: false,
    guessPosts: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let that = this
    
    // 【MVVM架构】初始化 ViewModel
    this.postViewModel = new PostViewModel()
    
    //1.授权
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
    
    let blogId = options.id
    if (options.scene) {
      blogId = decodeURIComponent(options.scene)
    }
    
    // 【参数校验】检查文章ID是否有效
    if (!blogId || blogId.trim() === '') {
      console.error('文章ID无效:', blogId)
      wx.showToast({
        title: '文章ID无效',
        icon: 'none',
        duration: 2000
      })
      setTimeout(() => {
        wx.navigateBack()
      }, 2000)
      return
    }
    
    let advert = app.globalData.advert
    //广告加载
    if (advert.bannerStatus) {
      that.setData({
        showBanner: true,
        showBannerId: advert.bannerId
      })
    }
    
    //获取文章详情&关联信息
    await that.getDetail(blogId)
    
    // 只有成功获取到文章后才获取相关信息
    if (that.data.post && that.data.post.id) {
      await that.getPostRelated(that.data.post.id)
      await that.getGuessPosts()
    }
  },

  /**
   * 获取猜你喜欢
   */
  getGuessPosts: async function () {
    try {
      const response = await this.postViewModel.getPostsList({
        page: 1,
        isShow: 1,
        orderBy: 'createTime',
        limit: 5
      })
      if (response.success && response.data) {
        this.setData({
          guessPosts: response.data.list
        })
      }
    } catch (error) {
      console.error('获取猜你喜欢失败:', error)
    }
  },

  /**
   * 点击文章明细
   */
  bindPostDetail: function (e) {
    let blogId = e.currentTarget.id;
    wx.redirectTo({
      url: '../detail/detail?id=' + blogId
    })
  },

  /**
   * 
   */
  onUnload: function () {
  },
  
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

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
   * 获取用户头像
   * @param {} e 
   */
  getUserInfo: function (e) {
    console.log(e.detail.userInfo)
    if (e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        showLogin: !this.data.showLogin,
        userInfo: e.detail.userInfo
      });
    } else {
      wx.switchTab({
        url: '../index/index'
      })
    }
  },
  /**
   * 获取文章详情
   * 【MVVM架构】使用 PostViewModel
   */
  getDetail: async function (blogId) {
    // 【参数校验】
    if (!blogId || blogId.trim() === '') {
      console.error('getDetail: 文章ID无效', blogId)
      wx.showToast({
        title: '文章ID无效',
        icon: 'none',
        duration: 2000
      })
      setTimeout(() => {
        wx.navigateBack()
      }, 2000)
      return
    }
    
    wx.showLoading({
      title: '加载中...',
    })
    let that = this
    
    try {
      console.log('开始获取文章详情, ID:', blogId)
      const response = await this.postViewModel.getPostDetail(blogId)
      console.log('文章详情响应:', response)
      
      if (response.success && response.data) {
        // 解析内容
        let content = response.data.content
        
        if (!content) {
          console.warn('文章内容为空')
          content = '<p>文章内容为空</p>'
        }
        
        let result = app.towxml(content, 'html', {
          theme: 'light',
          events: {
            tap: (e) => {
              console.log('tap', e)
            }
          }
        })
        response.data.content = result

        that.setData({
          post: response.data
        })
        
        console.log('文章详情加载成功')
      } else {
        console.warn('文章加载失败:', response.message)
        wx.showToast({
          title: response.message || '文章不存在',
          icon: 'none',
          duration: 2000
        })
        setTimeout(() => {
          wx.navigateBack()
        }, 2000)
      }
    } catch (err) {
      console.error('获取文章详情异常:', err)
      wx.showToast({
        title: '加载失败，请稍后重试',
        icon: 'none',
        duration: 2000
      })
      setTimeout(() => {
        wx.navigateBack()
      }, 2000)
    } finally {
      wx.hideLoading()
    }
  },
  /**
   * 显示隐藏功能
   */
  showMenuBox: function () {
    this.setData({
      isShow: !this.data.isShow
    })
  },
  /**
   * 收藏功能
   * 【MVVM架构】使用 PostViewModel
   */
  postCollection: async function () {
    wx.showLoading({
      title: '加载中...',
    })
    try {
      let that = this
      let collection = that.data.collection
      
      if (collection.status === true) {
        // 取消收藏
        const response = await this.postViewModel.deletePostCollectionOrZan(
          that.data.post.id, 
          config.postRelatedType.COLLECTION
        )
        
        if (response.success) {
          that.setData({
            collection: { status: false, text: "收藏", icon: "favor" }
          })
          wx.showToast({
            title: '已取消收藏',
            icon: 'success',
            duration: 1500
          })
        } else {
          throw new Error(response.message)
        }
      }
      else {
        // 添加收藏
        let data = {
          postId: that.data.post.id,
          postTitle: that.data.post.title,
          postUrl: that.data.post.defaultImageUrl,
          postDigest: that.data.post.digest,
          type: config.postRelatedType.COLLECTION
        }
        const response = await this.postViewModel.addPostCollection(data)
        
        if (response.success) {
          that.setData({
            collection: { status: true, text: "已收藏", icon: "favorfill" }
          })
          wx.showToast({
            title: '已收藏',
            icon: 'success',
            duration: 1500
          })
        } else {
          throw new Error(response.message)
        }
      }
    }
    catch (err) {
      wx.showToast({
        title: err.message || '操作失败',
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
   * 点赞功能
   * 【MVVM架构】使用 PostViewModel
   */
  postZan: async function () {
    wx.showLoading({
      title: '加载中...',
    })
    try {
      let that = this
      let zan = that.data.zan
      
      if (zan.status === true) {
        // 取消点赞
        const response = await this.postViewModel.deletePostCollectionOrZan(
          that.data.post.id, 
          config.postRelatedType.ZAN
        )
        
        if (response.success) {
          that.setData({
            zan: { status: false, text: "点赞", icon: "appreciate" }
          })
          wx.showToast({
            title: '已取消点赞',
            icon: 'success',
            duration: 1500
          })
        } else {
          throw new Error(response.message)
        }
      }
      else {
        // 添加点赞
        let data = {
          postId: that.data.post.id,
          postTitle: that.data.post.title,
          postUrl: that.data.post.defaultImageUrl,
          postDigest: that.data.post.digest,
          type: config.postRelatedType.ZAN
        }
        const response = await this.postViewModel.addPostZan(data)
        
        if (response.success) {
          that.setData({
            zan: { status: true, text: "已赞", icon: "appreciatefill" }
          })
          wx.showToast({
            title: '已赞',
            icon: 'success',
            duration: 1500
          })
        } else {
          throw new Error(response.message)
        }
      }
    }
    catch (err) {
      wx.showToast({
        title: err.message || '操作失败',
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
  * 展示打赏二维码
  * @param {} e 
  */
  showQrcode: async function (e) {
    wx.previewImage({
      urls: [config.moneyUrl],
      current: config.moneyUrl
    })
  },
  /**
   * 获取收藏和喜欢的状态
   * 【MVVM架构】使用 PostViewModel
   */
  getPostRelated: async function (blogId) {
    try {
      // 确保获取到 openId
      const openid = await app.ensureOpenId()
      if (!openid) {
        console.warn('无法获取 openId，跳过获取收藏点赞状态')
        return
      }

      let where = {
        postId: blogId,
        openId: openid
      }
      const response = await this.postViewModel.getPostRelated(where, 1)
      
      if (response.success && response.data) {
        let that = this
        // response.data 已经是数组了
        for (var item of response.data) {
          if (config.postRelatedType.COLLECTION === item.type) {
            that.setData({
              collection: { status: true, text: "已收藏", icon: "favorfill" }
            })
            continue
          }
          if (config.postRelatedType.ZAN === item.type) {
            that.setData({
              zan: { status: true, text: "已赞", icon: "appreciatefill" }
            })
            continue
          }
        }
      }
    } catch (err) {
      console.error('获取收藏点赞状态失败:', err)
    }
  },

  /**
   * 跳转原文
   */
  showoriginalUrl: function () {
    let url = this.data.post.originalUrl
    let data = escape(url)
    wx.navigateTo({
      url: '../detail/original?url=' + data
    })
  },
  /**
   * towxml点击事件
   * @param {} e 
   */
  _tap: function (e) {
    console.info(e)
    try {
      if (e.target.dataset._el.attr.src != undefined) {
        wx.previewImage({
          urls: [e.target.dataset._el.attr.src],
        });
      }
    }
    catch (e) {
      console.info(e)
    }
  },
  adError(err) {
    console.log('Banner 广告加载失败', err)
    this.setData({
      showBanner: false
    })
  },
  adClose() {
    console.log('Banner 广告关闭')
    this.setData({
      showBanner: false
    })
  }
})
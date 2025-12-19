const config = require('../../utils/config.js')
const api = require('../../utils/api.js');
const util = require('../../utils/util.js');
const app = getApp();

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
    commentContent: "",
    commentPage: 1,
    commentList: [],
    nomore: false,
    nodata: false,
    commentId: "",
    placeholder: "评论...",
    focus: false,
    toName: "",
    toOpenId: "",
    nodata_str: "暂无评论，赶紧抢沙发吧",
    showBanner: false,
    showBannerId: "",
    showAuthModal: false,
    hasUserInfo: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let that = this;
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
    
    // 从 mini_member 获取用户头像和昵称
    try {
      const memberUserInfo = await api.getMemberUserInfo()
      console.log('获取用户信息:', memberUserInfo)
      if (memberUserInfo.result && memberUserInfo.result.success) {
        that.setData({
          userInfo: {
            ...that.data.userInfo,
            avatarUrl: memberUserInfo.result.avatarUrl,
            nickName: memberUserInfo.result.nickName
          },
          hasUserInfo: true
        })
      } else {
        that.setData({
          hasUserInfo: false
        })
      }
    } catch (err) {
      console.log('获取用户信息失败:', err)
      that.setData({
        hasUserInfo: false
      })
    }
    
    let blogId = options.id;
    if (options.scene) {
      blogId = decodeURIComponent(options.scene);
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
    await that.getPostRelated(that.data.post._id)
  },

  /**
   * 
   */
  onUnload: function () {
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: async function () {
    wx.showLoading({
      title: '加载中...',
    })
    try {
      let that = this;
      if (that.data.nomore === true)
        return;

      let page = that.data.commentPage;
      let commentList = await api.getPostComments(page, that.data.post._id)
      if (commentList.data.length === 0) {
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
          commentPage: page + 1,
          commentList: that.data.commentList.concat(commentList.data),
        })
      }
    }
    catch (err) {
      console.info(err)
    }
    finally {
      wx.hideLoading()
    }

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
   */
  getDetail: async function (blogId) {
    wx.showLoading({
      title: '加载中...',
    })
    let that = this
    let postDetail = await api.getPostDetail(blogId);
    console.info(postDetail)
    
    // 解析内容
    let content = postDetail.result.content;
    let result = app.towxml(content, 'html', {
      theme: 'light',
      events: {
        tap: (e) => {
          console.log('tap', e);
        }
      }
    });
    postDetail.result.content = result;

    that.setData({
      post: postDetail.result
    })
    wx.hideLoading()
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
   */
  postCollection: async function () {
    wx.showLoading({
      title: '加载中...',
    })
    try {
      let that = this;
      let collection = that.data.collection;
      if (collection.status === true) {
        let result = await api.deletePostCollectionOrZan(that.data.post._id, config.postRelatedType.COLLECTION)
        console.info(result)
        that.setData({
          collection: { status: false, text: "收藏", icon: "favor" }
        })
        wx.showToast({
          title: '已取消收藏',
          icon: 'success',
          duration: 1500
        })
      }
      else {
        let data = {
          postId: that.data.post._id,
          postTitle: that.data.post.title,
          postUrl: that.data.post.defaultImageUrl,
          postDigest: that.data.post.digest,
          type: config.postRelatedType.COLLECTION
        }
        await api.addPostCollection(data)
        that.setData({
          collection: { status: true, text: "已收藏", icon: "favorfill" }
        })

        wx.showToast({
          title: '已收藏',
          icon: 'success',
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
   * 点赞功能
   */
  postZan: async function () {
    wx.showLoading({
      title: '加载中...',
    })
    try {
      let that = this;
      let zan = that.data.zan;
      if (zan.status === true) {
        let result = await api.deletePostCollectionOrZan(that.data.post._id, config.postRelatedType.ZAN)
        console.info(result)
        that.setData({
          zan: { status: false, text: "点赞", icon: "appreciate" }
        })
        wx.showToast({
          title: '已取消点赞',
          icon: 'success',
          duration: 1500
        })
      }
      else {
        let data = {
          postId: that.data.post._id,
          postTitle: that.data.post.title,
          postUrl: that.data.post.defaultImageUrl,
          postDigest: that.data.post.digest,
          type: config.postRelatedType.ZAN
        }
        await api.addPostZan(data)
        that.setData({
          zan: { status: true, text: "已赞", icon: "appreciatefill" }
        })

        wx.showToast({
          title: '已赞',
          icon: 'success',
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
   */
  getPostRelated: async function (blogId) {
    let where = {
      postId: blogId,
      openId: app.globalData.openid
    }
    let postRelated = await api.getPostRelated(where, 1);
    let that = this;
    for (var item of postRelated.data) {
      if (config.postRelatedType.COLLECTION === item.type) {
        that.setData({
          collection: { status: true, text: "已收藏", icon: "favorfill" }
        })
        continue;
      }
      if (config.postRelatedType.ZAN === item.type) {
        that.setData({
          zan: { status: true, text: "已赞", icon: "appreciatefill" }
        })
        continue;
      }
    }
  },

  commentInput: function (e) {
    this.setData({
      commentContent: e.detail.value
    })
  },


  /**
 * 获取订阅消息
 */
  submitContent: async function (content, commentPage, accept) {
    let that = this
    let checkResult = await api.checkPostComment(content)
    if (!checkResult.result) {
      wx.showToast({
        title: '评论内容存在敏感信息',
        icon: 'none',
        duration: 2000
      })
      return
    }

    if (that.data.commentId === "") {
      var data = {
        postId: that.data.post._id,
        cNickName: that.data.userInfo.nickName,
        cAvatarUrl: that.data.userInfo.avatarUrl,
        cOpenId: app.globalData.openid,
        timestamp: new Date().getTime(),
        createDate: util.formatTime(new Date()),
        comment: content,
        childComment: [],
        flag: 0
      }
      await api.addPostComment(data, accept)
    }
    else {
      var childData = [{
        cOpenId: app.globalData.openid,
        cNickName: that.data.userInfo.nickName,
        cAvatarUrl: that.data.userInfo.avatarUrl,
        timestamp: new Date().getTime(), //new Date(),
        createDate: util.formatTime(new Date()),
        comment: content,
        tNickName: that.data.toName,
        tOpenId: that.data.toOpenId,
        flag: 0
      }]
      await api.addPostChildComment(that.data.commentId, that.data.post._id, childData, accept)
    }

    let commentList = await api.getPostComments(commentPage, that.data.post._id)
    if (commentList.data.length === 0) {
      that.setData({
        nomore: true
      })
      if (commentPage === 1) {
        that.setData({
          nodata: true
        })
      }
    }
    else {
      let post = that.data.post;
      post.totalComments = post.totalComments + 1
      that.setData({
        commentPage: commentPage + 1,
        commentList: commentList.data,
        commentContent: "",
        nomore: false,
        nodata: false,
        post: post,
        commentId: "",
        placeholder: "评论...",
        focus: false,
        toName: "",
        toOpenId: ""
      })
    }

    wx.showToast({
      title: '提交成功',
      icon: 'success',
      duration: 1500
    })
  },

  /**
   * 提交评论
   * @param {} e 
   */
  formSubmit: function (e) {
    try {
      let that = this;
      
      // 检查是否已有用户信息
      if (!that.data.hasUserInfo) {
        // 清空临时输入，显示授权弹窗
        that.setData({
          showAuthModal: true,
          'userInfo.tempAvatarUrl': '',
          'userInfo.tempNickName': ''
        })
        return
      }
      
      let commentPage = 1
      let content = that.data.commentContent;
      console.info(content)
      if (content == undefined || content.length == 0) {
        wx.showToast({
          title: '请输入内容',
          icon: 'none',
          duration: 1500
        })
        return
      }

      wx.requestSubscribeMessage({
        tmplIds: [config.subcributeTemplateId],
        success(res) {
          wx.showLoading({
            title: '加载中...',
          })
          console.info(res)
          console.info(res[config.subcributeTemplateId])
          that.submitContent(content, commentPage, res[config.subcributeTemplateId]).then((res) => {
            console.info(res)
            wx.hideLoading()
          })
        },
        fail(res) {
          console.info(res)
          wx.showToast({
            title: '程序有一点点小异常，操作失败啦',
            icon: 'none',
            duration: 1500
          })
        }
      })
    }
    catch (err) {
      wx.showToast({
        title: '程序有一点点小异常，操作失败啦',
        icon: 'none',
        duration: 1500
      })
      console.info(err)
      wx.hideLoading()
    }
  },
  /**
  * 点击评论内容回复
  */
  focusComment: function (e) {
    let that = this;
    let name = e.currentTarget.dataset.name;
    let commentId = e.currentTarget.dataset.id;
    let openId = e.currentTarget.dataset.openid;

    that.setData({
      commentId: commentId,
      placeholder: "回复" + name + ":",
      focus: true,
      toName: name,
      toOpenId: openId
    });
  },
  /**
   * 失去焦点时
   * @param {*} e 
   */
  onReplyBlur: function (e) {
    let that = this;
    const text = e.detail.value.trim();
    if (text === '') {
      that.setData({
        commentId: "",
        placeholder: "评论...",
        toName: ""
      });
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
  },
  
  /**
   * 获取用户头像
   */
  onChooseAvatar: function(e) {
    const { avatarUrl } = e.detail
    this.setData({
      'userInfo.tempAvatarUrl': avatarUrl
    })
  },
  
  /**
   * 获取用户昵称
   */
  onNicknameInput: function(e) {
    const { value } = e.detail
    this.setData({
      'userInfo.tempNickName': value
    })
  },
  
  /**
   * 确认授权
   */
  confirmAuth: async function() {
    let that = this
    const { tempNickName, tempAvatarUrl } = that.data.userInfo
    
    if (!tempNickName || tempNickName.trim() === '') {
      wx.showToast({
        title: '请输入昵称',
        icon: 'none',
        duration: 1500
      })
      return
    }
    
    if (!tempAvatarUrl) {
      wx.showToast({
        title: '请选择头像',
        icon: 'none',
        duration: 1500
      })
      return
    }
    
    wx.showLoading({
      title: '保存中...',
    })
    
    try {
      // 保存用户信息到 mini_member
      const result = await api.saveMemberInfo(tempAvatarUrl, tempNickName)
      console.log('保存用户信息结果:', result)
      
      if (result.result && result.result.success) {
        that.setData({
          showAuthModal: false,
          hasUserInfo: true,
          'userInfo.avatarUrl': result.result.avatarUrl,
          'userInfo.nickName': result.result.nickName,
          'userInfo.tempAvatarUrl': '',
          'userInfo.tempNickName': ''
        })
        
        wx.showToast({
          title: '保存成功',
          icon: 'success',
          duration: 1500
        })
      } else {
        wx.showToast({
          title: '保存失败，请重试',
          icon: 'none',
          duration: 1500
        })
      }
    } catch (err) {
      console.error('保存用户信息失败:', err)
      wx.showToast({
        title: '保存失败，请重试',
        icon: 'none',
        duration: 1500
      })
    } finally {
      wx.hideLoading()
    }
  },
  
  /**
   * 取消授权
   */
  cancelAuth: function() {
    this.setData({
      showAuthModal: false,
      'userInfo.tempAvatarUrl': '',
      'userInfo.tempNickName': ''
    })
  }
})
const config = require('../../utils/config.js')
const api = require('../../utils/api.js');
const regeneratorRuntime = require('../../utils/runtime.js');
const util = require('../../utils/util.js');
const app = getApp();
import Poster from '../../utils/poster';
import { async } from '../../utils/runtime';
let rewardedVideoAd = null

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
    isShowPosterModal: false,//是否展示海报弹窗
    posterImageUrl: "",//海报地址
    showBanner: false,
    showBannerId: "",
    hideArticle: ''//400rpx
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let that = this;
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
    let blogId = options.id;
    if (options.scene) {
      blogId = decodeURIComponent(options.scene);
    }
    let advert = app.globalData.advert
    if (advert.readMoreStatus) {
      var openAded = false
      var openAdLogs = wx.getStorageSync('openAdLogs') || [];
      if (openAdLogs.length > 0) {
        for (var i = 0; i < openAdLogs.length; i++) {
          if (openAdLogs[i].id == blogId) {
            openAded = true;
            break;
          }
        }
      }
      that.setData({
        hideArticle: openAded ? "" : "700rpx"
      })
      that.loadInterstitialAd(advert.readMoreId);
    }
    if (advert.bannerStatus) {
      that.setData({
        showBanner: true,
        showBannerId: advert.bannerId
      })
    }
    await that.getDetail(blogId)
    await that.getPostRelated(that.data.post._id)
  },

  /**
   * 
   */
  onUnload: function () {
    if (rewardedVideoAd && rewardedVideoAd.destroy) {
      rewardedVideoAd.destroy()
    }
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
    let content = app.towxml(postDetail.result.content, 'markdown');
    postDetail.result.content = content
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
        flag: 1
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
        flag: 1
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
   * 生成海报成功-回调
   * @param {} e 
   */
  onPosterSuccess(e) {
    const { detail } = e;
    this.setData({
      posterImageUrl: detail,
      isShowPosterModal: true
    })
    console.info(detail)
  },
  /**
   * 生成海报失败-回调
   * @param {*} err 
   */
  onPosterFail(err) {
    console.info(err)
  },
  /**
   * 生成海报
   */
  onCreatePoster: async function () {
    let that = this;
    if (that.data.posterImageUrl !== "") {
      that.setData({
        isShowPosterModal: true
      })
      return;
    }
    let posterConfig = {
      width: 750,
      height: 1200,
      backgroundColor: '#fff',
      debug: false
    }
    var blocks = [
      {
        width: 690,
        height: 808,
        x: 30,
        y: 183,
        borderWidth: 2,
        borderColor: '#f0c2a0',
        borderRadius: 20,
      },
      {
        width: 634,
        height: 74,
        x: 59,
        y: 680,
        backgroundColor: '#fff',
        opacity: 0.5,
        zIndex: 100,
      }
    ]
    var texts = [];
    texts = [
      {
        x: 113,
        y: 61,
        baseLine: 'middle',
        text: that.data.userInfo.nickName,
        fontSize: 32,
        color: '#8d8d8d',
        width: 570,
        lineNum: 1
      },
      {
        x: 32,
        y: 113,
        baseLine: 'top',
        text: '发现一篇很有意思的文章',
        fontSize: 38,
        color: '#080808',
      },
      {
        x: 59,
        y: 770,
        baseLine: 'middle',
        text: that.data.post.title,
        fontSize: 38,
        color: '#080808',
        marginLeft: 30,
        width: 570,
        lineNum: 2,
        lineHeight: 50
      },
      {
        x: 59,
        y: 875,
        baseLine: 'middle',
        text: that.data.post.digest,
        fontSize: 28,
        color: '#929292',
        width: 560,
        lineNum: 2,
        lineHeight: 50
      },
      {
        x: 315,
        y: 1100,
        baseLine: 'top',
        text: '长按识别小程序码,立即阅读',
        fontSize: 28,
        color: '#929292',
      }
    ];

    let imageUrl = that.data.post.defaultImageUrl
    imageUrl = imageUrl.replace('http://', 'https://')
    let qrCode = await api.getReportQrCodeUrl(that.data.post.qrCode);
    let qrCodeUrl = qrCode.fileList[0].tempFileURL
    if (qrCodeUrl == "") {
      let addReult = await api.addPostQrCode(that.data.post._id, that.data.post.timestamp)
      qrCodeUrl = addReult.result[0].tempFileURL
    }
    console.info(qrCodeUrl)
    var images = [
      {
        width: 62,
        height: 62,
        x: 32,
        y: 30,
        borderRadius: 62,
        url: that.data.userInfo.avatarUrl, //用户头像
      },
      {
        width: 634,
        height: 475,
        x: 59,
        y: 210,
        url: imageUrl,//海报主图
      },
      {
        width: 220,
        height: 220,
        x: 70,
        y: 1000,
        url: qrCodeUrl,//二维码的图
      }
    ];

    posterConfig.blocks = blocks;//海报内图片的外框
    posterConfig.texts = texts; //海报的文字
    posterConfig.images = images;

    that.setData({ posterConfig: posterConfig }, () => {
      Poster.create(true);    //生成海报图片
    });

  },
  /**
   * 点击放大图片
   * @param {} e 
   */
  posterImageClick: function (e) {
    wx.previewImage({
      urls: [this.data.posterImageUrl],
    });
  },
  /**
   * 隐藏海报弹窗
   * @param {*} e 
   */
  hideModal(e) {
    this.setData({
      isShowPosterModal: false
    })
  },
  /**
  * 保存海报图片
  */
  savePosterImage: function () {
    let that = this
    wx.saveImageToPhotosAlbum({
      filePath: that.data.posterImageUrl,
      success(result) {
        console.log(result)
        wx.showModal({
          title: '提示',
          content: '二维码海报已存入手机相册，赶快分享到朋友圈吧',
          showCancel: false,
          success: function (res) {
            that.setData({
              isShowPosterModal: false,
              isShow: false
            })
          }
        })
      },
      fail: function (err) {
        console.log(err);
        if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
          console.log("再次发起授权");
          wx.showModal({
            title: '用户未授权',
            content: '如需保存海报图片到相册，需获取授权.是否在授权管理中选中“保存到相册”?',
            showCancel: true,
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
                wx.openSetting({
                  success: function success(res) {
                    console.log('打开设置', res.authSetting);
                    wx.openSetting({
                      success(settingdata) {
                        console.log(settingdata)
                        if (settingdata.authSetting['scope.writePhotosAlbum']) {
                          console.log('获取保存到相册权限成功');
                        } else {
                          console.log('获取保存到相册权限失败');
                        }
                      }
                    })

                  }
                });
              }
            }
          })
        }
      }
    });
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
   * 阅读更多
   */
  readMore: function () {
    let that = this;
    rewardedVideoAd.show()
      .catch(() => {
        rewardedVideoAd.load()
          .then(() => rewardedVideoAd.show())
          .catch(err => {
            console.log('激励视频 广告显示失败');
            that.setData({
              hideArticle: ''
            })
          })
      })
  },

  /**
   * 初始化广告视频
   * @param {} excitationAdId 
   */
  loadInterstitialAd: function (excitationAdId) {
    let that = this;
    if (wx.createRewardedVideoAd) {
      rewardedVideoAd = wx.createRewardedVideoAd({ adUnitId: excitationAdId })
      rewardedVideoAd.onLoad(() => {
        console.log('onLoad event emit')
      })
      rewardedVideoAd.onError((err) => {
        console.log(err);
        that.setData({
          hideArticle: ''
        })
      })
      rewardedVideoAd.onClose((res) => {

        var id = that.data.post._id
        if (res && res.isEnded) {
          var nowDate = new Date();
          nowDate = nowDate.getFullYear() + "-" + (nowDate.getMonth() + 1) + '-' + nowDate.getDate();

          var openAdLogs = wx.getStorageSync('openAdLogs') || [];
          // 过滤重复值
          if (openAdLogs.length > 0) {
            openAdLogs = openAdLogs.filter(function (log) {
              return log["id"] !== id;
            });
          }
          // 如果超过指定数量不再记录
          if (openAdLogs.length < 21) {
            var log = {
              "id": id,
              "date": nowDate
            }
            openAdLogs.unshift(log);
            wx.setStorageSync('openAdLogs', openAdLogs);
            console.log(openAdLogs);
          }
          this.setData({
            hideArticle: ''
          })
        } else {
          wx.showToast({
            title: "完整看完视频才能阅读全文哦",
            icon: "none",
            duration: 3000
          });
        }
      })
    }

  },
})
/**
 * ==================================================================================
 * ⚠️⚠️⚠️ 【此文件已完全废弃，请勿再使用】⚠️⚠️⚠️
 * ==================================================================================
 * 
 * 本项目已于 2025-12-22 全面完成 MVVM 架构迁移
 * 所有 24 个页面均已迁移，此文件仅保留用于参考，不应再在新代码中使用
 * 
 * ==================================================================================
 * 新架构说明（MVVM Pattern）
 * ==================================================================================
 * 
 * 架构层级：
 * ┌─────────────────────────────────────────────────────────────┐
 * │ Page (页面)                                                  │
 * │   ↓                                                          │
 * │ ViewModel (业务逻辑层)  ← 在这里调用                          │
 * │   ↓                                                          │
 * │ Service Interface (服务接口)                                 │
 * │   ↓                                                          │
 * │ Service Implementation (服务实现：Cloud/HTTP)                │
 * │   ↓                                                          │
 * │ Backend (云开发 / HTTP API)                                  │
 * └─────────────────────────────────────────────────────────────┘
 * 
 * ==================================================================================
 * 可用的 ViewModel（请使用这些代替 api.js 中的方法）
 * ==================================================================================
 * 
 * 1. PostViewModel        - 文章相关功能
 *    路径: viewmodels/PostViewModel.js
 *    功能: 文章列表、详情、点赞、收藏等
 * 
 * 2. CommentViewModel     - 评论相关功能
 *    路径: viewmodels/CommentViewModel.js
 *    功能: 评论列表、发表评论、删除评论等
 * 
 * 3. MemberViewModel      - 用户相关功能
 *    路径: viewmodels/MemberViewModel.js
 *    功能: 用户信息、签到、积分、VIP申请等
 * 
 * 4. AdminViewModel       - 管理员功能
 *    路径: viewmodels/AdminViewModel.js
 *    功能: 文章管理、分类管理、标签管理、配置管理等
 * 
 * 5. MessageViewModel     - 消息相关功能
 *    路径: viewmodels/MessageViewModel.js
 *    功能: 消息发送、表单ID收集等
 * 
 * 6. GitHubViewModel      - GitHub 集成功能
 *    路径: viewmodels/GitHubViewModel.js
 *    功能: GitHub 搜索、仓库信息、文章同步等
 * 
 * 7. FileViewModel        - 文件上传功能
 *    路径: viewmodels/FileViewModel.js
 *    功能: 文件上传到云存储
 * 
 * ==================================================================================
 * 标准使用方式
 * ==================================================================================
 * 
 * 步骤 1: 在页面顶部引入需要的 ViewModel
 * ```javascript
 * const PostViewModel = require('../../viewmodels/PostViewModel.js')
 * const MemberViewModel = require('../../viewmodels/MemberViewModel.js')
 * ```
 * 
 * 步骤 2: 在 onLoad 中初始化 ViewModel
 * ```javascript
 * Page({
 *   onLoad: function(options) {
 *     // 初始化 ViewModel
 *     this.postViewModel = new PostViewModel()
 *     this.memberViewModel = new MemberViewModel()
 *     
 *     // 加载数据
 *     this.loadData()
 *   },
 * 
 *   async loadData() {
 *     wx.showLoading({ title: '加载中...' })
 *     
 *     try {
 *       // 调用 ViewModel 方法
 *       const response = await this.postViewModel.getPostsList({
 *         page: 1,
 *         filter: '',
 *         isShow: 1,
 *         orderBy: 'createTime'
 *       })
 *       
 *       // 检查返回结果
 *       if (response.success) {
 *         const { list, hasMore, isEmpty } = response.data
 *         this.setData({
 *           postList: list,
 *           hasMore: hasMore,
 *           isEmpty: isEmpty
 *         })
 *       } else {
 *         wx.showToast({
 *           title: response.message || '加载失败',
 *           icon: 'none'
 *         })
 *       }
 *     } catch (error) {
 *       console.error('加载数据失败:', error)
 *       wx.showToast({
 *         title: error.message || '操作失败',
 *         icon: 'none'
 *       })
 *     } finally {
 *       wx.hideLoading()
 *     }
 *   }
 * })
 * ```
 * 
 * ==================================================================================
 * Response 对象结构（统一返回格式）
 * ==================================================================================
 * 
 * 所有 ViewModel 方法都返回标准的 Response 对象：
 * ```javascript
 * {
 *   success: boolean,    // 操作是否成功
 *   data: any,          // 返回的数据（成功时）
 *   message: string,    // 提示信息
 *   code: number        // 状态码（0 表示成功）
 * }
 * ```
 * 
 * ==================================================================================
 * 迁移对照表（api.js → ViewModel）
 * ==================================================================================
 * 
 * 旧方法 (api.js)                    → 新方法 (ViewModel)
 * ─────────────────────────────────────────────────────────────────────────────
 * api.getNewPostsList()              → postViewModel.getNewPostsList()
 * api.getPostsDetail()               → postViewModel.getPostDetail()
 * api.zanPosts()                     → postViewModel.zanPost()
 * api.collectPosts()                 → postViewModel.collectPost()
 * api.addPostComment()               → commentViewModel.addPostComment()
 * api.getCommentList()               → commentViewModel.getCommentList()
 * api.getMemberInfo()                → memberViewModel.getMemberInfo()
 * api.saveMemberInfo()               → memberViewModel.saveMemberInfo()
 * api.addSign()                      → memberViewModel.addSign()
 * api.getClassifyList()              → adminViewModel.getClassifyList()
 * api.getLabelList()                 → adminViewModel.getLabelList()
 * api.searchGitHub()                 → gitHubViewModel.searchGitHub()
 * api.uploadFile()                   → fileViewModel.uploadFile()
 * ─────────────────────────────────────────────────────────────────────────────
 * 
 * ==================================================================================
 * 相关文档
 * ==================================================================================
 * 
 * - MVVM 架构使用指南: docs/MVVM-架构使用指南.md
 * - MVVM 迁移快速指南: docs/MVVM迁移快速指南.md
 * - 架构优化-数据转换层下沉: docs/架构优化-数据转换层下沉.md
 * - Git 模块迁移完成: fixes/2025-12-22-git-module-migration-complete.md
 * - Admin 模块迁移完成: fixes/2025-12-22-admin-module-migration-complete.md
 * - Mine 模块迁移完成: fixes/2025-12-22-mine-module-migration-complete.md
 * 
 * ==================================================================================
 * 架构优势
 * ==================================================================================
 * 
 * ✅ 前后端解耦：轻松切换云开发/HTTP API
 * ✅ 代码可维护：结构清晰，职责分明
 * ✅ 易于测试：各层可独立测试
 * ✅ 可扩展性：新增功能只需添加 ViewModel 方法
 * ✅ 统一错误处理：全局统一的错误处理机制
 * ✅ 代码复用：业务逻辑集中在 ViewModel 层
 * 
 * ==================================================================================
 */

const db = wx.cloud.database()
const _ = db.command

/**
 * 获取分享明细
 * @param {} openId 
 * @param {*} date 
 */
function getShareDetailList(openId,date)
{
    return db.collection('mini_share_detail')
    .where({
        shareOpenId: openId,
        date:date
    })
    .limit(5)
    .get()
}

/**
 * 获取会员信息
 * @param {} openId 
 */
function getMemberInfo(openId) {
    return db.collection('mini_member')
        .where({
            openId: openId
        })
        .limit(1)
        .get()
}

/**
 * 保存用户头像和昵称
 * @param {*} avatarUrl 
 * @param {*} nickName 
 */
function saveMemberInfo(avatarUrl, nickName) {
    return wx.cloud.callFunction({
        name: 'memberService',
        data: {
            action: "saveMemberInfo",
            avatarUrl: avatarUrl,
            nickName: nickName
        }
    })
}

/**
 * 获取用户头像和昵称
 */
function getMemberUserInfo() {
    return wx.cloud.callFunction({
        name: 'memberService',
        data: {
            action: "getMemberUserInfo"
        }
    })
}

/**
 * 获取会员列表
 * @param {*} applyStatus 
 * @param {*} page 
 */
function getMemberInfoList(page,applyStatus){
    return db.collection('mini_member')
    .where({
        applyStatus: applyStatus
    })
    .orderBy('modifyTime', 'desc')
    .skip((page - 1) * 10)
    .limit(10)
    .get()
}

/**
 * 获取积分明细列表
 * @param {*} page 
 * @param {*} openId 
 */
function getPointsDetailList(page,openId)
{
    return db.collection('mini_point_detail')
    .where({
        openId: openId
    })
    .orderBy('createTime', 'desc')
    .skip((page - 1) * 20)
    .limit(20)
    .get()
}

/**
 * 获取评论列表
 */
function getCommentsList(page, flag) {
    return db.collection('mini_comments')
        .where({
            flag: flag
        })
        .orderBy('timestamp', 'desc')
        .skip((page - 1) * 10)
        .limit(10)
        .get()
}
/**
 * 根据id获取文章明细
 * @param {*} page 
 */
function getPostsById(id) {
    return db.collection('mini_posts')
        .doc(id)
        .get()
}
/**
 * 获取消息列表
 * @param {*} page 
 */
function getNoticeLogsList(page, openId) {
    return db.collection('mini_logs')
        .orderBy('timestamp', 'desc')
        .skip((page - 1) * 10)
        .limit(10)
        .get()
}

/**
 * 获取版本发布日志
 * @param {*} page 
 */
function getReleaseLogsList(page) {
    return db.collection('mini_logs')
        .where({
            key: 'releaseLogKey'
        })
        .orderBy('timestamp', 'desc')
        .skip((page - 1) * 10)
        .limit(10)
        .get()
}

function getNewPostsList(page, filter, orderBy) {
    let where = {}
    if (filter.title != undefined) {
        where.title = db.RegExp({
            regexp: filter.title,
            options: 'i',
        })
    }
    if (filter.isShow != undefined) {
        where.isShow = filter.isShow
    }
    if (filter.classify != undefined) {
        where.classify = filter.classify
    }

    if (filter.hasClassify == 1) {
        where.classify = _.nin(["", 0, undefined])
    }

    if (filter.hasClassify == 2) {
        where.classify = _.in(["", 0, undefined])
    }

    if (orderBy == undefined || orderBy == "") {
        orderBy = "createTime"
    }

    if (filter.hasLabel == 1) {
        where.label = _.neq([])
    }

    if (filter.hasLabel == 2) {
        where.label = _.eq([])
    }

    //不包含某个标签
    if (filter.containLabel == 2) {
        where.label = _.nin([filter.label])
    }

    //包含某个标签
    if (filter.containLabel == 1) {
        where.label = db.RegExp({
            regexp: filter.label,
            options: 'i',
        })
    }

    //不包含某个主题
    if (filter.containClassify == 2) {
        where.classify = _.neq(filter.classify)
    }

    //包含某个主题
    if (filter.containClassify == 1) {
        where.classify = _.eq(filter.classify)
    }


    return db.collection('mini_posts')
        .where(where)
        .orderBy(orderBy, 'desc')
        .skip((page - 1) * 10)
        .limit(10)
        .field({
            _id: true,
            author: true,
            createTime: true,
            defaultImageUrl: true,
            title: true,
            totalComments: true,
            totalVisits: true,
            totalZans: true,
            isShow: true,
            classify: true,
            label: true,
            digest: true
        }).get()
}
/**
 * 获取文章列表
 * @param {} page 
 */
function getPostsList(page, filter, isShow, orderBy, label) {
    let where = {}
    if (filter !== '') {
        where.title = db.RegExp({
            regexp: filter,
            options: 'i',
        })
    }
    if (isShow !== -1) {
        where.isShow = isShow
    }

    if (orderBy == undefined || orderBy == "") {
        orderBy = "createTime"
    }

    if (label != undefined && label != "") {
        where.label = db.RegExp({
            regexp: label,
            options: 'i',
        })
    }

    return db.collection('mini_posts')
        .where(where)
        .orderBy(orderBy, 'desc')
        .skip((page - 1) * 10)
        .limit(10)
        .field({
            _id: true,
            author: true,
            createTime: true,
            defaultImageUrl: true,
            title: true,
            totalComments: true,
            totalVisits: true,
            totalZans: true,
            isShow: true,
            classify: true,
            label: true,
            digest: true
        }).get()

}

/**
 * 获取评论列表
 * @param {} page 
 * @param {*} postId 
 */
function getPostComments(page, postId) {
    return db.collection('mini_comments')
        .where({
            postId: postId,
            flag: 0
        })
        .orderBy('timestamp', 'desc')
        .skip((page - 1) * 10)
        .limit(10)
        .get()
}

/**
 * 获取收藏、点赞列表
 * @param {} page 
 */
function getPostRelated(where, page) {
    return db.collection('mini_posts_related')
        .where(where)
        .orderBy('createTime', 'desc')
        .skip((page - 1) * 10)
        .limit(10)
        .get()
}
/**
 * 获取文章详情
 * @param {} id 
 */
function getPostDetail(id) {
    return wx.cloud.callFunction({
        name: 'postsService',
        data: {
            action: "getPostsDetail",
            id: id,
            type: 1
        }
    })
}

/**
 * 新增用户收藏文章
 */
function addPostCollection(data) {
    return wx.cloud.callFunction({
        name: 'postsService',
        data: {
            action: "addPostCollection",
            postId: data.postId,
            postTitle: data.postTitle,
            postUrl: data.postUrl,
            postDigest: data.postDigest,
            type: data.type
        }
    })
}

/**
 * 取消喜欢或收藏
 */
function deletePostCollectionOrZan(postId, type) {
    return wx.cloud.callFunction({
        name: 'postsService',
        data: {
            action: "deletePostCollectionOrZan",
            postId: postId,
            type: type
        }
    })
}

/**
 * 新增评论
 */
function addPostComment(commentContent, accept) {
    const config = require('./config.js');
    return wx.cloud.callFunction({
        name: 'postsService',
        data: {
            action: "addPostComment",
            commentContent: commentContent,
            accept: accept,
            pushTemplateId: config.subcributeTemplateId
        }
    })
}

/**
 * 新增用户点赞
 * @param {} data 
 */
function addPostZan(data) {
    return wx.cloud.callFunction({
        name: 'postsService',
        data: {
            action: "addPostZan",
            postId: data.postId,
            postTitle: data.postTitle,
            postUrl: data.postUrl,
            postDigest: data.postDigest,
            type: data.type
        }
    })
}

/**
 * 新增子评论
 * @param {} id 
 * @param {*} comments 
 */
function addPostChildComment(id, postId, comments, accept) {
    return wx.cloud.callFunction({
        name: 'postsService',
        data: {
            action: "addPostChildComment",
            id: id,
            comments: comments,
            postId: postId,
            accept: accept
        }
    })
}

/**
 * 新增文章二维码并返回临时url
 * @param {*} id 
 * @param {*} postId 
 * @param {*} comments 
 */
function addPostQrCode(postId, timestamp) {
    return wx.cloud.callFunction({
        name: 'postsService',
        data: {
            action: "addPostQrCode",
            timestamp: timestamp,
            postId: postId
        }
    })
}

function checkPostComment(content) {
    return wx.cloud.callFunction({
        name: 'postsService',
        data: {
            action: "checkPostComment",
            content: content
        }
    })
}
/**
 * 获取打赏码
 */
function getQrCode() {
    return wx.cloud.getTempFileURL({
        fileList: [{
            fileID: 'cloud://test-91f3af.54ec-test-91f3af/common/1556347401340.jpg'
        }]
    })
}

/**
 * 获取海报的文章二维码url
 * @param {*} id 
 */
function getReportQrCodeUrl(id) {
    return wx.cloud.getTempFileURL({
        fileList: [{
            fileID: id,
            maxAge: 60 * 60, // one hour
        }]
    })
}

/**
 * 验证是否是管理员
 */
function checkAuthor() {
    return wx.cloud.callFunction({
        name: 'adminService',
        data: {
            action: "checkAuthor"
        }
    })
}

/**
 * 查询可用的formId数量
 */
function querySubscribeCount(templateId) {
    return wx.cloud.callFunction({
        name: 'messageService',
        data: {
            action: "querySubscribeCount",
            templateId: templateId
        }
    })
}

function getTemplateList() {
    return wx.cloud.callFunction({
        name: 'messageService',
        data: {
            action: "getTemplateList"
        }
    })
}

function addSubscribeCount(templateIds) {
    return wx.cloud.callFunction({
        name: 'messageService',
        data: {
            action: "addSubscribeCount",
            templateIds: templateIds
        }
    })
}

/**
 * 查询可用的formId数量
 */
function addFormIds(formIds) {
    return wx.cloud.callFunction({
        name: 'messageService',
        data: {
            action: "addFormIds",
            formIds: formIds
        }
    })
}

/**
 * 发送评论通知
 * @param {} nickName 
 * @param {*} comment 
 * @param {*} blogId 
 */
function sendTemplateMessage(nickName, comment, blogId) {
    return wx.cloud.callFunction({
        name: 'messageService',
        data: {
            action: "sendTemplateMessage",
            nickName: nickName,
            message: comment,
            blogId: blogId,
            tOpenId: ""
        }
    })
}

/**
 * 新增版本日志
 * @param {} log 
 */
function addReleaseLog(log, title) {
    return wx.cloud.callFunction({
        name: 'adminService',
        data: {
            action: "addReleaseLog",
            log: log,
            title: title
        }
    })
}

/**
 * 更新文章状态
 * @param {*} id 
 * @param {*} isShow 
 */
function updatePostsShowStatus(id, isShow) {
    return wx.cloud.callFunction({
        name: 'adminService',
        data: {
            action: "updatePostsShowStatus",
            id: id,
            isShow: isShow
        }
    })
}

/**
 * 更新文章专题
 * @param {*} id 
 * @param {*} isShow 
 */
function updatePostsClassify(id, classify) {
    return wx.cloud.callFunction({
        name: 'adminService',
        data: {
            action: "updatePostsClassify",
            id: id,
            classify: classify
        }
    })
}

/**
 * 更新文章标签
 * @param {*} id 
 * @param {*} isShow 
 */
function updatePostsLabel(id, label) {
    return wx.cloud.callFunction({
        name: 'adminService',
        data: {
            action: "updatePostsLabel",
            id: id,
            label: label
        }
    })
}

/**
 * 更新文章标签
 * @param {*} id 
 * @param {*} isShow 
 */
function upsertPosts(id, data) {
    return wx.cloud.callFunction({
        name: 'adminService',
        data: {
            action: "upsertPosts",
            id: id,
            post: data
        }
    })
}

/**
 * 新增基础标签
 */
function addBaseLabel(labelName) {
    return wx.cloud.callFunction({
        name: 'adminService',
        data: {
            action: "addBaseLabel",
            labelName: labelName
        }
    })
}

/**
 * 新增基础主题
 */
function addBaseClassify(classifyName, classifyDesc) {
    return wx.cloud.callFunction({
        name: 'adminService',
        data: {
            action: "addBaseClassify",
            classifyName: classifyName,
            classifyDesc: classifyDesc
        }
    })
}

/**
 * 新增基础主题
 */
function deleteConfigById(id) {
    return wx.cloud.callFunction({
        name: 'adminService',
        data: {
            action: "deleteConfigById",
            id: id
        }
    })
}

function deletePostById(id) {
    return wx.cloud.callFunction({
        name: 'adminService',
        data: {
            action: "deletePostById",
            id: id
        }
    })
}

/**
 * 更新评论状态
 * @param {*} id 
 * @param {*} flag 
 */
function changeCommentFlagById(id, flag, postId, count) {
    return wx.cloud.callFunction({
        name: 'adminService',
        data: {
            action: "changeCommentFlagById",
            id: id,
            flag: flag,
            postId: postId,
            count: count
        }
    })
}

/**
 * 获取label集合
 */
function getLabelList() {
    return wx.cloud.callFunction({
        name: 'adminService',
        data: {
            action: "getLabelList"
        }
    })
}

/**
 * 获取label集合
 */
function getClassifyList() {
    return wx.cloud.callFunction({
        name: 'adminService',
        data: {
            action: "getClassifyList"
        }
    })
}

/**
 * 获取label集合
 */
function updateBatchPostsClassify(classify, operate, posts) {
    return wx.cloud.callFunction({
        name: 'adminService',
        data: {
            action: "updateBatchPostsClassify",
            posts: posts,
            operate: operate,
            classify: classify
        }
    })
}

/**
 * 获取label集合
 */
function updateBatchPostsLabel(label, operate, posts) {
    return wx.cloud.callFunction({
        name: 'adminService',
        data: {
            action: "updateBatchPostsLabel",
            posts: posts,
            operate: operate,
            label: label
        }
    })
}

function upsertAdvertConfig(advert) {
    return wx.cloud.callFunction({
        name: 'adminService',
        data: {
            action: "upsertAdvertConfig",
            advert: advert
        }
    })
}

function getAdvertConfig() {
    return wx.cloud.callFunction({
        name: 'adminService',
        data: {
            action: "getAdvertConfig"
        }
    })
}

/**
 * 新增签到
 */
function addSign(info) {
    return wx.cloud.callFunction({
        name: 'memberService',
        data: {
            action: "addSign",
            info: info
        }
    })
}

/**
 * 补充签到
 */
function addSignAgain(info) {
    return wx.cloud.callFunction({
        name: 'memberService',
        data: {
            action: "addSignAgain",
            info: info
        }
    })
}

/**
 * 新增积分
 */
function addPoints(taskType,info) {
    return wx.cloud.callFunction({
        name: 'memberService',
        data: {
            action: "addPoints",
            taskType: taskType,
            info:info
        }
    })
}

/**
 * 分享得积分
 * @param {*} info 
 */
function addShareDetail(info)
{
    return wx.cloud.callFunction({
        name: 'memberService',
        data: {
            action: "addShareDetail",
            info:info
        }
    })
}

/**
 * 申请VIP
 * @param {}}  
 */
function applyVip(info) {
    return wx.cloud.callFunction({
        name: 'memberService',
        data: {
            action: "applyVip",
            info: info
        }
    })
}

/**
 * 审核vip
 * @param {}}  
 */
function approveApplyVip(id,apply,openId) {
    return wx.cloud.callFunction({
        name: 'adminService',
        data: {
            action: "approveApplyVip",
            id: id,
            apply:apply,
            openId:openId
        }
    })
}



function getSignedDetail(openId, year,month) {
    return wx.cloud.callFunction({
        name: 'memberService',
        data: {
            action: "getSignedDetail",
            openId: openId,
            year: year,
            month:month
        }
    })
}

/**
 * 上传文件
 */
function uploadFile(cloudPath, filePath) {
    return wx.cloud.uploadFile({
        cloudPath: cloudPath,
        filePath: filePath, // 文件路径
    })
}

/**
 * 获取打赏码
 */
function getTempUrl(fileID) {
    return wx.cloud.getTempFileURL({
        fileList: [{
            fileID: fileID
        }]
    })
}

module.exports = {
    getPostsList: getPostsList,
    getPostDetail: getPostDetail,
    getPostRelated: getPostRelated,
    getQrCode: getQrCode,
    addPostCollection: addPostCollection,
    addPostZan: addPostZan,
    deletePostCollectionOrZan: deletePostCollectionOrZan,
    addPostComment: addPostComment,
    getPostComments: getPostComments,
    addPostChildComment: addPostChildComment,
    getReportQrCodeUrl: getReportQrCodeUrl,
    addPostQrCode: addPostQrCode,
    checkAuthor: checkAuthor,
    addFormIds: addFormIds,
    querySubscribeCount: querySubscribeCount,
    sendTemplateMessage: sendTemplateMessage,
    addReleaseLog: addReleaseLog,
    getReleaseLogsList: getReleaseLogsList,
    getNoticeLogsList: getNoticeLogsList,
    getPostsById: getPostsById,
    deleteConfigById: deleteConfigById,
    addBaseClassify: addBaseClassify,
    addBaseLabel: addBaseLabel,
    upsertPosts: upsertPosts,
    updatePostsLabel: updatePostsLabel,
    updatePostsClassify: updatePostsClassify,
    updatePostsShowStatus: updatePostsShowStatus,
    getCommentsList: getCommentsList,
    changeCommentFlagById: changeCommentFlagById,
    getLabelList: getLabelList,
    getClassifyList: getClassifyList,
    getNewPostsList: getNewPostsList,
    deletePostById: deletePostById,
    uploadFile: uploadFile,
    getTempUrl: getTempUrl,
    updateBatchPostsLabel: updateBatchPostsLabel,
    updateBatchPostsClassify: updateBatchPostsClassify,
    getTemplateList: getTemplateList,
    addSubscribeCount: addSubscribeCount,
    checkPostComment: checkPostComment,
    upsertAdvertConfig: upsertAdvertConfig,
    getAdvertConfig: getAdvertConfig,
    addSign: addSign,
    getMemberInfo: getMemberInfo,
    getSignedDetail: getSignedDetail,
    addPoints:addPoints,
    applyVip:applyVip,
    approveApplyVip:approveApplyVip,
    getMemberInfoList:getMemberInfoList,
    addShareDetail:addShareDetail,
    getShareDetailList:getShareDetailList,
    getPointsDetailList:getPointsDetailList,
    addSignAgain:addSignAgain,
    manualSyncArticle: manualSyncArticle,
    searchGitHub: searchGitHub,
    getGitHubRepo: getGitHubRepo,
    getGitHubReadme: getGitHubReadme,
    getGitHubContents: getGitHubContents,
    getGitHubBranches: getGitHubBranches,
    getGitHubIssues: getGitHubIssues,
    saveMemberInfo: saveMemberInfo,
    getMemberUserInfo: getMemberUserInfo
}

/**
 * 获取 GitHub 仓库 Issues
 * @param {*} fullName 
 * @param {*} state 
 * @param {*} page 
 */
function getGitHubIssues(fullName, state, page) {
    return wx.cloud.callFunction({
        name: 'syncService',
        data: {
            action: 'getGitHubIssues',
            fullName: fullName,
            state: state,
            page: page
        }
    })
}

/**
 * 搜索 GitHub
 * @param {*} keyword
 * @param {*} page
 */
function searchGitHub(keyword, page) {
    return wx.cloud.callFunction({
        name: 'syncService',
        data: {
            action: 'searchGitHub',
            keyword: keyword,
            page: page
        }
    })
}

/**
 * 获取 GitHub 仓库详情
 * @param {*} fullName
 */
function getGitHubRepo(fullName) {
    return wx.cloud.callFunction({
        name: 'syncService',
        data: {
            action: 'getGitHubRepo',
            fullName: fullName
        }
    })
}

/**
 * 获取 GitHub 仓库 Readme
 * @param {*} fullName
 */
function getGitHubReadme(fullName) {
    return wx.cloud.callFunction({
        name: 'syncService',
        data: {
            action: 'getGitHubReadme',
            fullName: fullName
        }
    })
}

/**
 * 获取 GitHub 仓库内容
 * @param {*} fullName
 * @param {*} path
 * @param {*} ref
 */
function getGitHubContents(fullName, path, ref) {
    return wx.cloud.callFunction({
        name: 'syncService',
        data: {
            action: 'getGitHubContents',
            fullName: fullName,
            path: path,
            ref: ref
        }
    })
}

/**
 * 获取 GitHub 仓库分支列表
 * @param {*} fullName
 */
function getGitHubBranches(fullName) {
    return wx.cloud.callFunction({
        name: 'syncService',
        data: {
            action: 'getGitHubBranches',
            fullName: fullName
        }
    })
}

/**
 * 手动同步文章
 * @param {*} articleUrl 文章链接地址
 * @param {*} defaultImageUrl 默认图片云存储地址
 */
function manualSyncArticle(articleUrl, defaultImageUrl) {
    return wx.cloud.callFunction({
        name: 'syncService',
        data: {
            action: 'manualSyncArticle',
            articleUrl: articleUrl,
            defaultImageUrl: defaultImageUrl
        }
    })
}
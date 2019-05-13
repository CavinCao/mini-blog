const regeneratorRuntime = require('runtime.js');

const db = wx.cloud.database()
const _ = db.command

/**
 * 获取文章列表
 * @param {} page 
 */
function getPostsList(page, filter) {
    if (filter === '') {
        return db.collection('mini_posts')
            .where({
                isShow: 1
            })
            .orderBy('createTime', 'desc')
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
                totalZans: true
            }).get()
    }
    else {
        return db.collection('mini_posts')
            .where({
                title: db.RegExp({
                    regexp: filter,
                    options: 'i',
                }),
                isShow: 1
            })
            .orderBy('createTime', 'desc')
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
                totalZans: true
            }).get()
    }
}

/**
 * 获取评论列表
 * @param {} page 
 * @param {*} postId 
 */
function getPostComments(page, postId) {
    return db.collection('mini_comments')
        .where({
            postId: postId
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
function getPostDetail(id,timestamp) {
    return wx.cloud.callFunction({
        name: 'postsService',
        data: {
            action: "getPostsDetail",
            id: id,
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
function addPostComment(commentContent) {
    return wx.cloud.callFunction({
        name: 'postsService',
        data: {
            action: "addPostComment",
            commentContent: commentContent
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
function addPostChildComment(id, postId, comments) {
    return wx.cloud.callFunction({
        name: 'postsService',
        data: {
            action: "addPostChildComment",
            id: id,
            comments: comments,
            postId: postId
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
    addPostQrCode:addPostQrCode
}
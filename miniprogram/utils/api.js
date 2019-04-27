const regeneratorRuntime = require('runtime.js');

const db = wx.cloud.database()
const _ = db.command

function wxPromisify(fn) {
    return function (obj = {}) {
        return new Promise((resolve, reject) => {
            obj.success = function (res) {
                //成功
                resolve(res)
            }
            obj.fail = function (res) {
                //失败
                reject(res)
            }
            fn(obj)
        })
    }
}

//无论promise对象最后状态如何都会执行
Promise.prototype.finally = function (callback) {
    let P = this.constructor;
    return this.then(
        value => P.resolve(callback()).then(() => value),
        reason => P.resolve(callback()).then(() => { throw reason })
    );
};

/**
 * 获取文章列表
 * @param {} page 
 */
function getPostsList(page, filter) {
    if (filter === '') {
        return db.collection('mini_posts')
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
                })
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
 * 获取文章详情
 * @param {} id 
 */
function getPostDetail(id) {
    return wx.cloud.callFunction({
        name: 'postsService',
        data: {
            action: "getPostsDetail",
            id: id,
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

module.exports = {
    getPostsList: getPostsList,
    getPostDetail: getPostDetail,
    getQrCode: getQrCode
}
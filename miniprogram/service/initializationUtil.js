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
 * 初始化数据
 */
function initializationData(post_ids) {
  var callcloudFunction = wxPromisify(wx.cloud.callFunction)
  return callcloudFunction({
    name: 'initializationData',
    data: {
      post_ids: post_ids
    }
  })
}

module.exports = {
  initializationData: initializationData
}
// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({ env: process.env.Env })
const Towxml = require('towxml');
const db = cloud.database()
const _ = db.command
const dateUtils = require('date-utils')

const towxml = new Towxml();

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.action) {
    case 'getPostsDetail': {
      return getPostsDetail(event)
    }
    case 'addPostComment': {
      return addPostComment(event)
    }
    case 'addPostChildComment': {
      return addPostChildComment(event)
    }
    case 'addPostCollection': {
      return addPostCollection(event)
    }
    case 'deletePostCollectionOrZan': {
      return deletePostCollectionOrZan(event)
    }
    case 'addPostZan': {
      return addPostZan(event)
    }
    default: break
  }
}
/**
 * 新增评论
 * @param {} event 
 */
async function addPostComment(event) {

  console.info("处理addPostComment")
  let post = await db.collection('mini_posts').doc(event.commentContent.postId).get();
  let count = post.data.totalComments + 1
  let task = db.collection('mini_posts').doc(post.data._id).update({
    data: {
      totalComments: count
    }
  });
  await db.collection("mini_comments").add({
    data: event.commentContent
  });
  let result=await task;
  console.info(result)
}

/**
 * 新增子评论
 * @param {} event 
 */
async function addPostChildComment(event) {
  let post = await db.collection('mini_posts').doc(event.postId).get();
  let totalComments = post.data.totalComments + 1
  let task = db.collection('mini_posts').doc(post.data._id).update({
    data: {
      totalComments: totalComments
    }
  });

  await db.collection('mini_comments').doc(event.id).update({
    data: {
      childComment: _.push(event.comments)
    }
  })
  await task;
}

/**
 * 处理文章收藏
 * @param {*} event 
 */
async function addPostCollection(event) {
  console.info("处理addPostCollection方法开始")
  let postRelated = await db.collection('mini_posts_related').where({
    openId: event.userInfo.openId,
    postId: event.postId,
    type: event.type
  }).get();

  if (postRelated.data.length === 0) {
    let date = new Date().toFormat("YYYY-MM-DD")
    let result = await db.collection('mini_posts_related').add({
      data: {
        openId: event.userInfo.openId,
        postId: event.postId,
        postTitle: event.postTitle,
        postUrl: event.postUrl,
        postDigest: event.postDigest,
        type: event.type,
        createTime: new Date().toFormat("YYYY-MM-DD")
      }
    })
    console.info(result)
  }
}

/**
 * 处理赞
 * @param {} event 
 */
async function addPostZan(event) {
  let post = await db.collection('mini_posts').doc(event.postId).get();
  let postRelated = await db.collection('mini_posts_related').where({
    openId: event.userInfo.openId,
    postId: event.postId,
    type: event.type
  }).get();

  let zan = post.data.totalZans + 1
  let task = db.collection('mini_posts').doc(post.data._id).update({
    data: {
      totalZans: zan
    }
  });

  if (postRelated.data.length === 0) {
    await db.collection('mini_posts_related').add({
      data: {
        openId: event.userInfo.openId,
        postId: event.postId,
        postTitle: event.postTitle,
        postUrl: event.postUrl,
        postDigest: event.postDigest,
        type: event.type,
        createTime: new Date().toFormat("YYYY-MM-DD")
      }
    });
  }
  let result = await task;
  console.info(result)
}

/**
 * 移除收藏/赞
 * @param {} event 
 */
async function deletePostCollectionOrZan(event) {
  //TODO:文章喜欢总数就不归还了？
  let result = await db.collection('mini_posts_related').where({
    openId: event.userInfo.openId,
    postId: event.postId,
    type: event.type
  }).remove()
  console.info(result)
}
/**
 * 获取文章明细
 * @param {} id 
 */
async function getPostsDetail(event) {
  let post = await db.collection("mini_posts").doc(event.id).get()
  if (post.code) {
    return "";
  }
  if (!post.data) {
    return "";
  }

  //获取文章时直接浏览量+1
  let visits = post.data.totalVisits + 1
  let task = db.collection('mini_posts').doc(event.id).update({
    data: {
      totalVisits: visits
    }
  })

  let content = await convertPosts(post.data.content, "html");
  post.data.content = content;
  post.data.totalVisits = visits;
  let result = await task;
  console.info(result)
  return post.data
}

/**
 * 转换下程序文章
 * @param {} isUpdate 
 */
async function convertPosts(content, type) {
  let res
  if (type === 'markdown') {
    res = await towxml.toJson(content || '', 'markdown');
  } else {
    res = await towxml.toJson(content || '', 'html');
  }
  return res;

}
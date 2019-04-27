// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const Towxml = require('towxml');
const db = cloud.database()
const _ = db.command

const towxml = new Towxml();

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.action) {
    case 'getPostsDetail': {
      return getPostsDetail(event)
    }
    default: break
  }
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

  let content = await convertPosts(post.data.content, "html");
  post.data.content = content;
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
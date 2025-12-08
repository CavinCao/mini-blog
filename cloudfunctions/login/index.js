// 云函数模板
// 部署：在 cloud-functions/login 文件夹右击选择 “上传并部署”

const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({ env: process.env.Env })

/**
 * 这个示例将经自动鉴权过的小程序用户 openid 返回给小程序端
 * 
 * event 参数包含小程序端调用传入的 data
 * 
 */
exports.main = async (event, context) => {
  console.log(event)
  console.log(context)

  // 可执行其他自定义逻辑
  // console.log 的内容可以在云开发云函数调用日志查看

  // 获取 WX Context (微信调用上下文)，包括 OPENID、APPID、及 UNIONID（需满足 UNIONID 获取条件）
  const wxContext = await cloud.getWXContext()
  
  console.log("------wxContext 详细信息------")
  console.log('wxContext 对象:', wxContext)
  console.log('OPENID:', wxContext.OPENID)
  console.log('APPID:', wxContext.APPID)
  console.log('UNIONID:', wxContext.UNIONID)
  console.log('wxContext 类型:', typeof wxContext)
  console.log('OPENID 类型:', typeof wxContext.OPENID)
  console.log("------end------")

  // 检查 OPENID 是否存在
  if (!wxContext.OPENID) {
    console.error('❌ 未获取到 OPENID，可能的原因：')
    console.error('1. 云函数环境配置错误')
    console.error('2. 小程序未正确调用云函数')
    console.error('3. 用户未授权或登录状态异常')
    
    return {
      success: false,
      error: 'OPENID 获取失败',
      wxContext: wxContext,
      event
    }
  }

  console.log('✅ 成功获取到 OPENID:', wxContext.OPENID)

  return {
    success: true,
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}

/**
 * 打赏二维码
 */
var moneyUrl ="https://636c-cloud1-9gxjaupb046e81dc-1257595977.tcb.qcloud.la/default/dashang.jpg?sign=0e73063ae18034da20c3b4bbb8b2386b&t=1765509278"

/**
 * 公众号二维码
 */
var wechatUrl ="https://test-91f3af.tcb.qcloud.la/common/WechatIMG2.jpeg?sign=e81a38eec6cebfc82c1c34bb7e233bae&t=1556369822"

/**
 * 云开发环境
 */
var env ="cloud1-9gxjaupb046e81dc"
//var env ="test-91f3af"
/**
 * 个人文章操作枚举
 */
var postRelatedType = {
    COLLECTION: 1,
    ZAN: 2,
    properties: {
        1: {
            desc: "收藏"
        },
        2: {
            desc: "点赞"
        }
    }
};

var subcributeTemplateId="BxVtrR681icGxgVJOfJ8xdze6TsZiXdSmmUUXnd_9Zg"

/**
 * 服务类型配置
 * 'cloud' - 使用微信云开发
 * 'http' - 使用 HTTP API
 * 'mock' - 使用 Mock 数据
 */
var serviceType = 'cloud'

/**
 * HTTP API 配置 (当 serviceType 为 'http' 时使用)
 */
var httpApi = {
    baseUrl: 'https://api.example.com',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
}

/**
 * 首页功能图标配置
 */
var indexIconList = [
    { name: '文章', icon: 'newsfill', color: 'orange', type: 'article', url: '/pages/articleSearch/articleSearch', jumpType: '' },
    { name: '专题', icon: 'explorefill', color: 'blue', type: 'classify', url: '/pages/topic/topic', jumpType: 'switchTab' },
    { name: 'git', icon: 'github', color: 'black', type: 'git', url: '/pages/git/git', jumpType: 'switchTab' },
    { name: '问答', icon: 'questionfill', color: 'green', type: 'qa', url: '', jumpType: '' },
    { name: '提示词', icon: 'commandfill', color: 'cyan', type: 'prompt', url: '', jumpType: '' },
    { name: '手绘', icon: 'picfill', color: 'pink', type: 'draw', url: '', jumpType: '' },
    { name: 'AI', icon: 'discoverfill', color: 'purple', type: 'ai', url: '', jumpType: '' },
    { name: '我的开源', icon: 'link', color: 'red', type: 'open_source', url: '', jumpType: '' }
]

module.exports = {
    postRelatedType: postRelatedType,
    moneyUrl:moneyUrl,
    wechatUrl:wechatUrl,
    env:env,
    subcributeTemplateId:subcributeTemplateId,
    serviceType: serviceType,
    httpApi: httpApi,
    indexIconList: indexIconList
}

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

module.exports = {
    postRelatedType: postRelatedType,
    moneyUrl:moneyUrl,
    wechatUrl:wechatUrl,
    env:env,
    subcributeTemplateId:subcributeTemplateId
}
/**
 * 打赏二维码
 */
var moneyUrl ="https://test-91f3af.tcb.qcloud.la/common/WechatIMG66.jpeg?sign=38e2cccbf86dd602ae575c89b2911b16&t=1556369699"

/**
 * 公众号二维码
 */
var wechatUrl ="https://test-91f3af.tcb.qcloud.la/common/WechatIMG2.jpeg?sign=e81a38eec6cebfc82c1c34bb7e233bae&t=1556369822"

/**
 * 云开发环境
 */
var env ="product-raeub"
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

module.exports = {
    postRelatedType: postRelatedType,
    moneyUrl:moneyUrl,
    wechatUrl:wechatUrl,
    env:env
}
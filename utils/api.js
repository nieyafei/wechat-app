/* 接口api集合 */
const locationUrl = "https://xinghan.scientistin.com";
//本地访问url路径http://enterprise.scientistin.com   
//http://192.168.2.56:8080
//https://xinghan.scientistin.com
var Api=[
    {
        "key": "HomeList",
        "url": "/api/index/",
        "method": "GET"
    },
    {
        "key": "loginPassword",
        "url": "/api/login-password",
        "method": "POST"
    },
    {
        "key": "loginCode",
        "url": "/api/login-code",
        "method": "POST"
    },
    {
        "key": "imageCode",
        "url": "/api/captcha/getcaptcha",
        "method": "GET"
    },
    {
        "key": "sendCode",
        "url": "/api/mobile-request-code",
        "method": "GET"
    },
    {
        "key": "indexBanner",
        "url": "/api/index/banner",
        "method": "GET"
    },
    {
        "key": "recmdList",
        "url": "/api/expert/recmd/",
        "method": "GET"
    },
    {
        "key": "unreadMess",
        "url": "/api/messages/unread",
        "method": "GET"
    },
    {
        "key": "userQuestion",
        "url": "/api/user/question/",
        "method": "GET"
    },
    {
        "key": "userIssue",
        "url": "/api/user/issue/",
        "method": "GET"
    },
    {
        "key": "userCalls",
        "url": "/api/user/calllist/",
        "method": "GET"
    },
    {
        "key": "callsForm",
        "url": "/api/expert/call",
        "method": "POST"
    },{
        "key": "search",
        "url": "/api/s/",
        "method": "GET"
    },{
        "key": "questionForm",
        "url": "/api/question/commit",
        "method": "POST"
    },{
        "key": "questionResult",
        "url": "/api/question/commit-expert/",
        "method": "GET"
    },{
        "key": "issueForm",
        "url": "/api/issue/commit",
        "method": "POST"
    },{
        "key": "userPays",
        "url": "/api/user/orders/",
        "method": "GET"
    },{
        "key": "wechatCode",
        "url": "/api/wechatapp/code",
        "method": "POST"
    },{
        "key": "wechatUserInfo",
        "url": "/api/wechatapp/userinfo",
        "method": "POST"
    },{
        "key": "wechatPay",//支付下单
        "url": "/api/wechat/pay/placeorder",
        "method": "POST"
    },{
        "key": "userMessage",
        "url": "/api/messages/home",
        "method": "GET"
    },{
        "key": "messService",
        "url": "/api/messages/personal/",
        "method": "GET"
    },{
        "key": "messSystem",
        "url": "/api/messages/",
        "method": "GET"
    },{
        "key": "userInfo",
        "url": "/api/user/edit",
        "method": "POST"
    },{
        "key": "expertInfo",
        "url": "/api/expert/",
        "method": "GET"
    },{
        "key": "collect",
        "url": "/api/user/collect",
        "method": "POST"
    },{
        "key": "uncollect",
        "url": "/api/user/uncollect",
        "method": "POST"
    },{
        "key": "questionInfo",
        "url": "/api/question/",
        "method": "GET"
    },{
        "key": "questionReply",//问题的回复
        "url": "/api/question/reply/",
        "method": "GET"
    },{
        "key": "userExpert",//我关注的专家
        "url": "/api/user/experts/",
        "method": "POST"
    },{
        "key": "userDomain",//获取用户领域
        "url": "/api/user/domainList",
        "method": "GET"
    },{
        "key": "userCtrlDomain",//更新用户领域
        "url": "/api/user/domain/ctrl/",
        "method": "GET"
    },{
        "key": "userLostCode",//忘记密码发送验证码
        "url": "/api/lost-password-send-code",
        "method": "POST"
    },{
        "key": "userLostPassword",//修改忘记密码
        "url": "/api/lost-password",
        "method": "POST"
    },{
        "key": "userEditPassword",//修改密码
        "url": "/api/reset-password",
        "method": "POST"
    },{
        "key": "register",//注册
        "url": "/api/register",
        "method": "POST"
    },{
        "key": "issueInfo",//注册
        "url": "/api/issue/",
        "method": "GET"
    }
];
/* page路径集合 */
var PagePath=[
    {
        "key": "login",
        "url": "/pages/login/login",
    },{
        "key": "register",
        "url": "/pages/register/register",
    },{
        "key": "index",
        "url": "/pages/index/index",
    },{
        "key": "start",
        "url": "/pages/start/start",
    },{
        "key": "search",
        "url": "/pages/search/search",
    }
];
function getApi(key){
    let obj=null;
    for(let i=0,len=Api.length;i<len;i++){
        if(Api[i].key==key){
            obj=Api[i];
            return locationUrl+obj.url;
        }
    }
}

function getPath(key){
    let obj=null;
    for(let i=0,len=PagePath.length;i<len;i++){
        if(PagePath[i].key==key){
            obj=PagePath[i];
            return obj.url;
        }
    }
}

module.exports = {
    getApi: getApi,
    getPath:getPath
}

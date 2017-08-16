//login.js
//获取应用实例
var app = getApp();
var api = require("../../utils/api");
var util = require('../../utils/util');

function countdown(that) {
    var second = that.data.second
    if (second == 0) {
        that.setData({ second:60,sendText:"重新发送",sendFlag:false}); return ;
    }
    var time = setTimeout(function(){
        that.setData({ second: second - 1,sendText:(second - 1)+"s",sendFlag:true});
        countdown(that);
    } ,1000)
}
var from = -1,error=-1;
Page({
  data: {
    text: '欢迎来到科学家在线',passType:false,
    userInfo: {},second:60,sendText:"发送验证码",
    activeP:1,sendFlag:false,
      codeImage:api.getApi("imageCode")+"?t="+(new Date().getTime()),
      mobile:"",password:"",verifyCode:"",imageCode:""
  },
  //事件处理函数
  mobileInput: function(e) {
      this.setData({
          mobile:e.detail.value
      })
  },
    passwordInput: function(e) {
        this.setData({
            password:e.detail.value
        })
    },
    imageCodeInput: function(e) {
        this.setData({
            imageCode:e.detail.value
        })
    },
    codeInput: function(e) {
        this.setData({
            verifyCode:e.detail.value
        })
    },
    changePass:function(){
        /* 可见不可见 */
        this.setData({passType:!this.data.passType})
    },
  onLoad: function (options) {
      var that = this;
      from = options.from;
      error = options.error;
      if(error==0){
          util.showToastNormal("token过期，请重新登录")
      }
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
  },
    chooseTab:function(e){
        //wx.showNavigationBarLoading()
        this.setData({
            activeP:e.target.dataset.tabid
        })
    },
  butLogin:function(e){
      var that = this;
      wx.checkSession({
        success: function(){
            console.log("未过期")
            //session 未过期，并且在本生命周期一直有效
            that.login();
        },
        fail: function(){
            //登录态过期
            app.lodeUserSession(function(){
                that.setData({
                    userInfo:userInfo
                })
                that.login();
            })
        }
    })
      
  },
  login:function(){
      /* 登录 */
      if(!util.isPhone(this.data.mobile)){
          util.showToastNormal("请输入正确的手机号");
          return false;
      }

      var from_data = {},url="";
      from_data.encryptedData=this.data.userInfo.encryptedData;
      from_data.iv=this.data.userInfo.iv;
      from_data.mobile=this.data.mobile;
      if(this.data.activeP==1){
          url=api.getApi("loginPassword");
          from_data.password=this.data.password;
          if(util.isNull(this.data.password)){
              util.showToastNormal("请输入密码");
              return false;
          }
      }else{
          url=api.getApi("loginCode");
          from_data.valid_code=this.data.verifyCode;
          if(util.isNull(this.data.verifyCode)){
              util.showToastNormal("请输入验证码");
              return false;
          }
      }
      app.func.req(url,from_data,"POST",{},function(res){
          if(!res){
              util.showToast("数据出现异常");
          }else{
            if(res.result){
                res.result.token=res.token;
                wx.setStorage({
                    key:"user",
                    data:res.result
                })
                wx.showToast({
                    title: '登录成功',
                    icon: 'success',
                    duration:3000,
                    complete:function(){
                        var pageArr = getCurrentPages();
                        console.log(pageArr);
                        if(pageArr.length>1){
                            var url = pageArr[pageArr.length-1]._route_;
                            if(url && (url.indexOf("/start/start")>-1 || url.indexOf("/index/index")>-1 || url.indexOf("/login/login")>-1 || url.indexOf("/register/register")>-1 )){
                                from=0;
                            }
                        }else if(pageArr.length==1){
                            from=0;
                        }
                        setTimeout(function(){
                            if(from==0){
                                wx.reLaunch({
                                    url: '/pages/index/index'
                                })
                            }else{
                                wx.navigateBack({
                                    delta: 1
                                })
                            }
                        },2000)
                    }
                })
            }else{
                util.showToast({
                    title: res.serror.desc,
                    duration: 2000,mask:false
                });
            }
        }
      });
  },
    sendCode:function(e){
      /* 发送验证码 */
      util.sendCode(this.data.mobile,1);
    },
    refreshCode:function(e){
        /* 更新图文验证码 */
        this.setData({
            codeImage:api.getApi("imageCode")+"?t="+(new Date().getTime())
        })
    }
})

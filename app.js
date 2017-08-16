//app.js
var  util = require('./utils/util');
var  api = require('./utils/api');
App({
  onLaunch: function () {//监听小程序初始化
    //调用API从本地缓存中获取数据
    /*var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);*/
    this.getUserInfo();
    //this.checkSession();
  },
  onShow:function(){
    
  },
  getUserInfo:function(cb){
    var that = this;
    if(this.globalData.userInfo){//this.globalData.userInfo
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      this.lodeUserSession(cb);
    }
  },
    getSystemInfo: function (cb) {
    var that = this
    if(that.globalData.systemInfo){
        typeof cb == "function" && cb(that.globalData.systemInfo)
    }else{
        wx.getSystemInfo({
            success: function(res) {
                that.globalData.systemInfo = res
                typeof cb == "function" && cb(that.globalData.systemInfo)
            }
        })
    }
  },
  checkSession:function(){
    var that = this;
      wx.checkSession({
        success: function(){
          //session 未过期，并且在本生命周期一直有效
          console.log("未过期")
        },
        fail: function(){
          //登录态过期
          console.log("过期")
          that.slodeUserSession(); //重新登录
        }
      })
  },
  lodeUserSession:function(cb){
      //调用登录接口
      var that = this;
      console.log("授权");
      wx.login({
          success: function (d) {
            console.log(d);//拿到code
            /* 调取获取openID */
            if(d.code){
                that.func.req(api.getApi("wechatCode"),{code:d.code},"POST",{},function(res){
                    if(res && res.result){
                        wx.setStorage({
                          key:"3rd_session",
                          data:res.result
                        })
                    }
                });
            }else{

            }
            /* 获取用户信息 */
            wx.getSetting({
                success(res) {
                    if (!res['scope.userInfo']) {
                        console.log("未授权");
                        wx.authorize({
                            scope: 'scope.userInfo',
                            success() {
                                // 用户已经同意小程序，后续调用 wx.startRecord 接口不会弹窗询问
                                wx.getUserInfo({
                                  success: function (res) {
                                    console.log(res)
                                    that.globalData.userInfo = res.userInfo;
                                    that.globalData.userInfo.encryptedData = res.encryptedData;
                                    that.globalData.userInfo.iv=res.iv;
                                    typeof cb == "function" && cb(that.globalData.userInfo)
                                  },
                                  fail:function(e){
                                    console.log(e);
                                  }
                                })
                            },fail:function(e){
                                console.log(e)
                            }
                        })
                    }else{
                      console.log("授权成功")
                    }
                },
                fail:function(e){
                  console.log(e)
                }
            })

            
          },
          fail:function(e){
            console.log(e)
          }
      })
  },
  globalData:{
    userInfo:null,
    systemInfo: null
  },
  func:{
    req:util.reqAjax
  },
  onError: function(msg) {
    console.log(msg)
  },
})
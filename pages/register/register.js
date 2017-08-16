// register.js
var app = getApp();
var api = require("../../utils/api");
var util = require('../../utils/util');
var from = -1;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    text: '欢迎来到科学家在线',passType:false,
    userInfo: {},second:60,sendText:"发送验证码",
    activeP:1,sendFlag:false,enterprisename:"",
    name:"",position:"",mobile:"",code:"",password:"",isPublic:true,email:""
  },
  changePass:function(){
      /* 可见不可见 */
      this.setData({passType:!this.data.passType})
  },
  passwordInput:function(e){
    this.data.password = e.detail.value;
  },
  enterpriseInput:function(e){
      /* 输入企业 */
      this.data.enterprisename = e.detail.value;
  },
  nameInput:function(e){
      this.data.name = e.detail.value;
  },
  positionInput:function(e){
      this.data.position = e.detail.value;
  },
  emailInput:function(e){
      this.data.email = e.detail.value;
  },
  mobileInput:function(e){
      this.data.mobile = e.detail.value;
  },
  codeInput:function(e){
      this.data.code = e.detail.value;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that = this;
      from = options.from;
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
        //更新数据
        that.setData({
            userInfo:userInfo
        })
    })
  },
  changeAgree:function(){
      this.setData({
          isPublic:!this.data.isPublic
      })
  },
  sendCode:function(e){
    /* 发送验证码 */
    util.sendCode(this.data.mobile,0);
  },
  butRegister:function(){
      /* 开始注册 */
      if(!this.data.isPublic){
          util.showToastNormal("请阅读并同意科学家在线协议");
          return false;
      }
      var that = this;
      wx.checkSession({
        success: function(){
            console.log("未过期")
            //session 未过期，并且在本生命周期一直有效
            that.register();
        },
        fail: function(){
            //登录态过期
            app.lodeUserSession(function(){
                that.setData({
                    userInfo:userInfo
                })
                that.register();
            })
        }
    })
  },
  register:function(){
      /* 开始注册 */
      var from_data = {};
      from_data.encryptedData=this.data.userInfo.encryptedData;
      from_data.iv=this.data.userInfo.iv;

      if(util.isNull(this.data.enterprisename)){
          util.showToastNormal("请输入企业名称");
          return false;
      }

      if(util.isNull(this.data.name)){
          util.showToastNormal("请输入姓名");
          return false;
      }

      if(util.isNull(this.data.position)){
          util.showToastNormal("请输入职位");
          return false;
      }

      if(!util.isEmail(this.data.email)){
          util.showToastNormal("请输入正确格式的邮箱");
          return false;
      }

      if(!util.isPhone(this.data.mobile)){
          util.showToastNormal("请输入正确手机号");
          return false;
      }

      if(util.isNull(this.data.code)){
          util.showToastNormal("请输入验证码");
          return false;
      }
      if(util.isNull(this.data.password)){
          util.showToastNormal("请输入密码");
          return false;
      }
      wx.showLoading({title:"正在注册"})
      from_data.enterpriseName=this.data.enterprisename
      from_data.mobile=this.data.mobile
      from_data.name=this.data.name;
      from_data.password=this.data.password
      from_data.position=this.data.position
      from_data.validCode=this.data.code
      from_data.email=this.data.email

      app.func.req(api.getApi("register"),from_data,"POST",{},function(res){
            wx.hideLoading()
            if(res){
                if(res.result){
                    res.result.token=res.token;
                    wx.setStorage({
                        key:"user",
                        data:res.result
                    })
                    wx.showToast({
                        title: '欢迎来到科学家在线',
                        icon: 'success',
                        duration: 2000,
                        complete:function(){
                            var pageArr = getCurrentPages();
                            if(pageArr.length>1){
                                var url = pageArr[pageArr.length-1]._route_;
                                if(url && (url.indexOf("/start/start")>-1 || url.indexOf("/index/index")>-1)){
                                    from=0;
                                }
                            }else if(pageArr.length==1){
                                from=0;
                            }
                            if(from==0){
                                wx.reLaunch({
                                    url: '/pages/index/index'
                                })
                            }else{
                                wx.navigateBack({
                                    delta: 1
                                })
                            }
                            
                        }
                    })
                }else{
                    util.showToastNormal(res.serror.desc)
                }
            }else{
                util.showToastNormal("数据加载失败");
            }
      });

  }
})
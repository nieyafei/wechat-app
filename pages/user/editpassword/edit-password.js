// edit-password.js
var app = getApp();
var api = require("../../../utils/api");
var util = require('../../../utils/util');

Page({

  /**
   * 页面的初始数据 type=0  忘记密码   1  修改密码
   */
  data: {
    type:0,mobile:"",oldPassword:"",passType:false,second:60,sendText:"发送验证码",
    activeP:1,sendFlag:false,code:"",newPassword:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      type:options.type
    })
    wx.setNavigationBarTitle({
      title: (options.type==0?'忘记密码':'修改密码')
    })
    if(this.data.type==1){
      util.initLoginUser();
    }

  },
  onShow:function(){
    if(this.data.type==1){
      util.initLoginUser();
    }
  },
  loadPages:function(){
      /* 开始加载页面数据 */
      
  },
  changePass:function(){
      /* 可见不可见 */
      this.setData({passType:!this.data.passType})
  },
  mobileInput:function(e){
    this.data.mobile = e.detail.value;
  },
  codeInput:function(e){
    this.data.code = e.detail.value;
  },
  newPasswordInput:function(e){
    this.data.newPassword = e.detail.value;
  },
  oldPasswordInput:function(e){
    this.data.oldPassword = e.detail.value;
  },
  sendCode:function(e){
    /* 发送验证码 */
    util.sendCode(this.data.mobile,2)
  },
  butSubmit:function(){
    if(this.data.type==0){
      /* 忘记密码 */
      if(util.isNull(this.data.mobile)){
        util.showToastNormal("请输入正确的手机号");
        return false;
      }
      if(util.isNull(this.data.code)){
        util.showToastNormal("请输入验证码");
        return false;
      }
      if(util.isNull(this.data.newPassword)){
        util.showToastNormal("请输入新密码");
        return false;
      }
      var from_data = {};
      from_data.mobile=this.data.mobile;
      from_data.password = this.data.newPassword;
      from_data.verifyCode = this.data.code;
      wx.showLoading({title:'正在提交'});
      app.func.req(api.getApi("userLostPassword"),from_data,"POST",{},function(res){
          if(res){
              if(res.result && res.result.code==200){
                  util.showToastNormal("密码修改成功");
                  setTimeout(function(){
                    wx.navigateBack({
                      delta: 1
                    })
                  },2000)
              }else{
                 util.showToastNormal(res.serror.desc);
              }
          }else{
              util.showToastNormal("数据异常，请重试");
          }
          wx.hideLoading()
      });

    }else{
      /* 更新密码 */
      if(util.isNull(this.data.oldPassword)){
        util.showToastNormal("请输入旧密码");
        return false;
      }
      if(util.isNull(this.data.newPassword)){
        util.showToastNormal("请输入新密码");
        return false;
      }
      var from_data = {};
      from_data.newPwd=this.data.newPassword;
      from_data.orgPwd=this.data.oldPassword;
      wx.showLoading({title:'正在提交'});
      app.func.req(api.getApi("userEditPassword"),from_data,"POST",{},function(res){
          if(res){
              if(res.result && res.result.code==200){
                  util.showToastNormal("密码重置成功");
                  setTimeout(function(){
                    wx.navigateBack({
                      delta: 1
                    })
                  },2000)
              }else{
                 util.showToastNormal(res.serror.desc);
              }
          }else{
              util.showToastNormal("数据异常，请重试");
          }
          wx.hideLoading()
      });

    }
  }
  
})
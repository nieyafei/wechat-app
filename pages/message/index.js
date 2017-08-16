// index.js
var app = getApp();
var api = require("../../utils/api");
var util = require('../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    message:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    util.initLoginUser();
  },
  onShow:function(){
      /* 监听页面显示 */
      this.setData({isLoginFlag:false})
      util.initLoginUser();
  },
  loadPages:function(){
      /* 开始加载页面数据 */
      this.messages();
  },
  retryOnload:function () {
      /* 数据异常点击重试 */
    util.showHidePageNull(false);
    this.messages();
  },
  messages:function(){
    wx.showLoading({title:"正在加载"})
    var that = this;
    app.func.req(api.getApi("userMessage"),{},"GET",{},function(res){
      if(res){
          if(res.result){
              if(res.result.personalMessage){
                res.result.personalMessage.create_time = util.formatTime(new Date(res.result.personalMessage.create_time*1000),0);
              }
              if(res.result.sysMessage){
                res.result.sysMessage.create_time = util.formatTime(new Date(res.result.sysMessage.create_time*1000),0);
              }
              that.setData({
                message:res.result
              })
          }
      }else{
        /* 数据异常 */
        util.showHidePageNull(true,2)
      }
        setTimeout(function(){
          wx.hideLoading()
        },1000)
      });
  }

  
})
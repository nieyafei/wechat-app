// setting.js
var app = getApp();
var api = require("../../../utils/api");
var util = require('../../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    util.initLoginUser();
  },

  onShow:function(){
      /* 监听页面显示 */
      util.initLoginUser();
  },  
  /**
   * 退出登录
   */
  butLoginOut: function(){
    wx.showLoading({
      title: '正在退出',
    })
    wx.removeStorage({
      key: 'user',
      complete: function() {
        // complete
        setTimeout(function(){
          //wx.hideLoading();
          wx.showToast({
            title: '退出成功',
            icon: 'success',
            duration:2000,
            complete:function(){
              setTimeout(function(){
                wx.redirectTo({
                  url: '/pages/login/login'
                })
              },2000)
            }
          })
        },2000)
      }
    })
  },
  loadPages:function(){
    /* 开始加载页面 */
    
  }
})
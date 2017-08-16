// user.js
var app = getApp();
var api = require("../../utils/api");
var util = require('../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabbarInit:util.tabbarInit(2),
    userInfo:{},
    user:{}
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
    this.loadUser();
  },
  onShow:function(){
    this.loadUser();
  },
  loadUser:function(){
    var that = this;
    util.getStorage("user").then(function(res){
      that.setData({
        user:res.data
      })
    }).catch(function(){
      that.setData({
        user:{}
      })
    })
  }
  
})
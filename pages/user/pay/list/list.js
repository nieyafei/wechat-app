// list.js
var app = getApp();
var api = require("../../../../utils/api");
var util = require('../../../../utils/util');
Page({

   /**
   * 页面的初始数据
   */
  data: {
    pushData:{
      other:{list:[],page:-1,totalPages:1}
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      /* 首先判断是否登录 */
      util.initLoginUser();
  },
  onShow:function(){
      /* 监听页面显示 */
      util.initLoginUser();
  },
  loadPages:function(){
      /* 开始加载页面数据 */
      this.pullUpload();
  },
  retryOnload:function () {
      /* 数据异常点击重试 */
      this.pullUpload();
  },
  dataProcess:function(content){
    /* 数据处理 */
    content.map(function(item){
        item.last_time = util.formatTime(new Date(item.last_time*1000),2);
    })
    return content;
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.pullUpload();
  },

  pullUpload:function(){
    /* userIssue */
      util.loadUcListCommon("userPays");
  }
})
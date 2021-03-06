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
      util.showHidePageNull(false,1)
      this.pullUpload();
  },
  dataProcess:function(content){
    /* 数据处理 */
    content.map(function(item){
        item.create_time = util.formatTime(new Date(item.create_time*1000),1);
        item.isUp=false;
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
      util.loadUcListCommon("userCalls");
  },
  btMore:function(e){
    var id = e.currentTarget.dataset.uid;
    this.data.pushData.other.list.map(function(item){
        if(item.cid == id){
          console.log(item)
          return item.isUp=!item.isUp;
        }
    })
    var list = this.data.pushData.other.list;
    this.setData({
      'pushData.other.list':list
    })
  },
  toResPay:function(e){
    var id = e.currentTarget.dataset.uid;
    var domain = e.currentTarget.dataset.domain;
    console.log(id);
    util.toPay(3,id,domain);//发起支付
  }
})
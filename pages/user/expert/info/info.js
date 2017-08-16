// info.js
var app = getApp();
var api = require("../../../../utils/api");
var util = require('../../../../utils/util');
var expertUid = "";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    expertUid:"",expertinfo:{},moreFlag:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    expertUid = options.uid;
    this.setData({expertUid:expertUid})
    this.loadExpertInfo();
  },
  onShow:function(){
    util.showModel(false)
  },
  retryOnload:function(){
    /* 数据出错点击重试 */
    this.loadExpertInfo();
  },

  toLoginPage:function(e) {
      /* 去需要登录的页面 */
      var url = e.currentTarget.dataset.url;
      util.toMustLoginPage(url);
  },
  loadExpertInfo:function(){
    /* expertInfo */
    var that = this;
    wx.showLoading({title:'正在加载'})
    app.func.req(api.getApi("expertInfo")+expertUid,{},"GET",{},function(res){
        if(res.result){
          /* 加载成功 */
          if(!util.isNull(res.result.portrait)){
            res.result.portrait = util.toImages(res.result.portrait);
          }
          that.setData({
            expertinfo:res.result
          })
        }else{
          /* 加载出错 */
          util.showHidePageNull(true,2)
        }
        wx.hideLoading();
    });  

  },
  followExpert:function(){
    /* 点击关注 */
    util.collectCommon(4,expertUid,this.data.expertinfo.follow?1:0);
  },
  collectProcess:function(type,uid,tab){
    this.setData({
      'expertinfo.follow':!this.data.expertinfo.follow
    })
    if(!this.data.expertinfo.follow){
      /* 取消关注 */
      wx.setStorage({
        key:"fid",
        data:uid
      })
    }else{
      /* 关注 */
      wx.removeStorage({
        key: 'fid'
      })
    }
  },
  closeModel:function(){
      util.showModel(false);
  },
  toLoginPageModel:function(e){
      var url = e.currentTarget.dataset.url;
      util.toMustLoginPage(url,1);
  },
  bindMore:function(e) {
     this.setData({
       moreFlag:!this.data.moreFlag
     })
  },
  /*
  页面转发
  */
  onShareAppMessage: function (res) {
      /*if (res.from === 'button') {
        // 来自页面内转发按钮
        console.log(res.target)
      }*/
      return {
          title: this.data.expertinfo.name+' ('+this.data.expertinfo.org+this.data.expertinfo.title+')',
          path: '/pages/user/expert/info/info?uid='+expertUid,
          success: function(res) {
              // 转发成功
              wx.showToast({
                  title: '转发成功',
                  icon: 'success',
                  duration: 2000
              })
          },
          fail: function(res) {
              // 转发失败warn
              /*wx.showToast({
                  title: '转发失败',
                  icon: 'cancel',
                  duration: 2000
              })*/
          }
      }
  }
})
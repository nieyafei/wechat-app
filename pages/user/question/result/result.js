// result.js
var app = getApp();
var api = require("../../../../utils/api");
var util = require('../../../../utils/util');
var questionId="";
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
    questionId = options.qid;
    this.setData({
      questionId:questionId,
      domain:options.domain
    })
    if(!util.isNull(questionId)){
        this.loadExpert();
    }
  },

  loadExpert:function(e){
    /* 加载推荐专家 */
    var that = this;
    wx.showLoading({
      title: '正在加载',
    })
    app.func.req(api.getApi("questionResult")+questionId,{},"GET",{},function(res){
          if(!res.serror){
              that.setData({
                'pushData.expert.list':res.result
              })
          }
          setTimeout(function(){
            wx.hideLoading()
          },2000)
      });
  }
})
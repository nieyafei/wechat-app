// push.js
var app = getApp();
var api = require("../../../../utils/api");
var util = require('../../../../utils/util');
var questionId="",domain="";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    payType:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    questionId = options.qid;
    domain = options.domain;
    if(util.isNull(questionId)){
      util.showHidePageNull(true,3,"页面出错");
    }
  },

  changePayType:function(e){
    this.setData({
      payType:e.currentTarget.dataset.type
    })
  },

  submitPay:function(e){
    util.toPay(this.data.payType,questionId,domain);//发起支付
  }

})
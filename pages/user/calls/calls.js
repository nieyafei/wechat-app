// calls.js
var app = getApp();
var api = require("../../../utils/api");
var util = require('../../../utils/util');
var expertUid = "",content="",domain="";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    focus:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    expertUid = options.expertUid;
    domain = options.domain;
    util.initLoginUser();
  },
  onShow:function(){
      /* 监听页面显示 */
      util.initLoginUser();
  },
  loadPages:function(){
      /* 开始加载页面数据 */
  },
  inputContent:function(e){
      content = e.detail.value;
  },
  focusText:function(){
    this.setData({
      focus:true
    })
  },
  submitForm:function(){
    /* 提交预约电话，并且支付 */
    var that = this;
    if(util.isNull(content)){
      util.showToast("请输入问题描述");
      return false;
    }
    var form_data = {};
    form_data.eid=expertUid;
    form_data.question=content;
    /* 提交 */
    wx.showLoading({title:'正在提交'})
    app.func.req(api.getApi("callsForm"),form_data,"POST",{},function(res){
        if(res.result){
          /* 得到咨询的id之后，进行支付 */
          var callId = res.result;
          util.toPay(3,callId,domain);//发起支付
        }else{
          /* 加载出错 */
          util.showHidePageNull(true,2)
        }
        wx.hideLoading();
    });

  }
  
})
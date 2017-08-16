// info.js
var app = getApp();
var api = require("../../../../utils/api");
var util = require('../../../../utils/util');
var issueId = "";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    issue:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    issueId = options.issueId;
    util.initLoginUser();
  },
  onShow:function(){
    util.initLoginUser();
  },
  loadPages:function(){
      /* 开始加载页面数据 */
      this.loadIssueId();
  },
  retryOnload:function () {
      /* 数据异常点击重试 */
      util.showHidePageNull(false,1)
      this.loadIssueId();
  },
  loadIssueId:function(){
    /* issueInfo */
    var that = this;
    if(util.isNull(issueId)){
      util.showHidePageNull(true,3,"项目id不存在");
    }else{
      wx.showLoading({title:"正在加载"})
      /* 加载数据 */
      app.func.req(api.getApi("issueInfo")+issueId,{},"GET",{},function(res){
        if(res){
            if(res.result){
              res.result.create_time = util.formatTime(new Date(res.result.create_time*1000),1);
              res.result.actions.map(function(act){
                act.create_time = util.formatTime(new Date(act.create_time*1000),2);
              })
              that.setData({issue:res.result})
            }else{
              util.showHidePageNull(true,3,res.serror.desc);
            }
        }else{
          util.showHidePageNull(true,2)
        }
        wx.hideLoading();
      })  

    }

  },
  toPay:function(){
    util.toPay(2,issueId,util.initField(2,"",this.data.issue.type));//发起支付
  }
})
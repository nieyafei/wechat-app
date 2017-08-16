// info.js
var app = getApp();
var api = require("../../../../utils/api");
var util = require('../../../../utils/util');
var questionId = "";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pushData:{
      other:{list:[],page:-1,totalPages:1}
    },
    replyTip:"问题提交成功，请耐心等待专家解答"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    questionId = options.qid;//获取问题id\
    this.loadQuestionInfo();
  },
  retryOnload:function () {
      /* 数据异常点击重试 */
      util.showHidePageNull(false,1)
      this.loadQuestionInfo();
  },
  dataProcess:function(content){
    /* 数据处理 */
    content.map(function(item){
        item.create_time = util.formatTime(new Date(item.create_time*1000),1);
        item.moreFlag = false;
    })
    return content;
  },
  loadQuestionInfo:function(){
    var that = this;
    if(util.isNull(questionId)){
      util.showHidePageNull(true,2)
      return false;
    }
    wx.showLoading({title:"正在加载"})
    app.func.req(api.getApi("questionInfo")+questionId,{},"GET",{},function(res){
        if(res && res.result){
            res.result.create_time=util.formatTime(new Date(res.result.create_time*1000),1);
            that.setData({
              question:res.result
            })
            /* 获取回复信息 */
            util.loadUcListCommon("questionReply",10,questionId+"/",0);
        }else{
          util.showHidePageNull(true,2)
        }
        wx.hideLoading();
    })  
  },
  moreReply:function(e) {
    var id = e.currentTarget.dataset.id;
    this.data.pushData.other.list.map(function(item){
        if(item.pid==id){
          return item.moreFlag=!item.moreFlag
        }
    })
    this.setData({
      'pushData.other.list':this.data.pushData.other.list
    })
  }
})
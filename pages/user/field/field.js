// field.js
var app = getApp();
var api = require("../../../utils/api");
var util = require('../../../utils/util');
var arLi = util.fieldArray();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:"",fieldArray:arLi,domainList:{},btnActive:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      type:options.type
    })
    if(this.data.type==1){
      util.initLoginUser();
    }
  },
  onShow:function(){
    if(this.data.type==1){
      util.initLoginUser();
    }
  },
  loadPages:function(){
    /* 初始加载 */
    this.loadField();
  },
  loadField:function(){
    /* 加载领域 */
    var that = this;
     app.func.req(api.getApi("userDomain"),{},"GET",{},function(res){
       if(res && res.result){
        that.setData({
          domainList:res.result
        })
        /* 处理数据 */
        res.result.content.split(",").map(function(item){
          if(!util.isNull(item)){
              var arr = util.initField(1,that.data.fieldArray,item);
              that.setData({
                fieldArray:arr
              })
              that.isBtn();
          }
        })
       }
     })  
  },
  changeField:function(e){
    var field_id = e.currentTarget.dataset.id;
    var arr = util.initField(1,this.data.fieldArray,field_id);
    this.setData({
      fieldArray:arr
    })
    this.isBtn();
  },
  submitForm:function(){
    var str = util.initField(3,this.data.fieldArray)
    if(util.isNull(str)){
      util.showToastNormal("请至少选择一个领域");
      return false;
    }
    if(this.data.type==1){
      /* 用户保存 */
      wx.showLoading({title:"正在保存"})
      app.func.req(api.getApi("userCtrlDomain")+str,{},"GET",{},function(res){
        if(res && !res.serror){
          util.showToastNormal("领域更新成功");
        }else{
          util.showToastNormal("更新失败，请重试");
        }
        wx.hideLoading();
      })  
    }else{

    }
  },
  isBtn:function(){
    if(util.isNull(util.initField(3,this.data.fieldArray))){
       this.setData({btnActive:false})
    }else{
      this.setData({btnActive:true})
    }
  }
  
})
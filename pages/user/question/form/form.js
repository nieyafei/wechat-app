// form.js
var app = getApp();
var api = require("../../../../utils/api");
var util = require('../../../../utils/util');
var arLi = util.fieldArray();
var title,content,expert_id,domain="";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fieldArray:arLi,isPublic:true,isClearShow:false,invalVlaue:"",isField:true,textFocus:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     /* 检查是否登录 */
     //util.initLoginUser();
     expert_id = options.expertUid;
     if(!util.isNull(expert_id)){
       domain = options.domain;
       this.setData({isField:false});
       wx.setNavigationBarTitle({
          title: '向'+options.name+'提问'
        })
     }
  },

  inputTitle:function(e){
    title = e.detail.value;
    /*this.setData({invalVlaue:title})*/
    if(title.length>0){
      this.setData({isClearShow:true})
    }else{
      this.setData({isClearShow:false})
    }
  },
  inputFocus:function(e){
    if(e.detail.value.length>0){
      this.setData({isClearShow:true})
    }
  },
  inputBlur:function(e){
     this.setData({isClearShow:false})
  },
  clearInput:function(e){
    console.log("qingchu")
    this.setData({
      invalVlaue:"",isClearShow:false
    })
  },
  inputContent:function(e){
    content = e.detail.value;
  },

  changeField:function(e){
    var field_id = e.currentTarget.dataset.id;
    var arr = util.initField(0,this.data.fieldArray,field_id);
    this.setData({
      fieldArray:arr
    })
  },
  changePublic:function(e){
    this.setData({
      isPublic:!this.data.isPublic
    })
  },
  textFoucs:function(){
    this.setData({
      textFocus:true
    })
  },
  submitForm:function(e){
    //is_public 0  公开   1不公开
    /*wx.navigateTo({
        url: "/pages/user/question/result/result"
    })*/
    var fieldIds = util.initField(4,this.data.fieldArray);
    var from_data={};
    if(util.isNull(title)){
      util.showToastNormal("请输入标题");
      return false;
    }

    if(util.isNull(content)){
      util.showToastNormal("请输入问题描述");
      return false;
    }
    if(this.data.isField && util.isNull(fieldIds)){
      util.showToastNormal("请选择一个领域");
      return false;
    }
    if(this.data.isField){
      domain = util.initField(2,"",fieldIds);
    }
    wx.showLoading({
      title: '正在提交',
    })
    
    from_data.question_title=title;
    from_data.content=content;
    from_data.is_public=this.data.isPublic?0:1;
    from_data.expert_id = expert_id;
    from_data.question_area = fieldIds;
    app.func.req(api.getApi("questionForm"),from_data,"POST",{},function(res){
          if(!res.serror){
              setTimeout(function(){
                wx.hideLoading()
              },2000)
              wx.redirectTo({
                  url: '/pages/user/pay/result?type=0&domain='+domain
              })
              /*if(!util.isNull(expert_id)){
                  wx.redirectTo({
                    url: "/pages/user/question/info/info?qid="+res.result
                })
              }else{
                  wx.redirectTo({
                    url: "/pages/user/question/result/result?qid="+res.result+"&domain="+domain
                })
              }*/
          }else{
              setTimeout(function(){
                wx.hideLoading()
              },2000)
              util.showToast({
                  title: res.serror.desc,
                  duration: 2000,mask:false
              });
          }
      });

  },
  onUnload:function(){
      /*wx.showModal({
        title: '温馨提示',
        content: '您的问题尚未填写完成，是否确定离开当前页面',
        success: function(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })*/
  }

})
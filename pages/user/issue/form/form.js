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
    fieldArray:arLi,isPublic:true,isClearShow:false,invalVlaue:"",textFocus:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     /* 检查是否登录 */
     //util.initLoginUser();
     expert_id = options.experUid;
     console.log(options.experUid);
     console.log(options.type);
  },

  inputTitle:function(e){
    title = e.detail.value;
    this.setData({invalVlaue:title})
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
  submitPay:function(e){
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
      util.showToastNormal("请输入项目描述");
      return false;
    }
    if(util.isNull(fieldIds)){
      util.showToastNormal("请选择一个领域");
      return false;
    }
    domain = util.initField(2,"",fieldIds);
    wx.showLoading({
      title: '正在提交',
    })
    
    from_data.question_title=title;
    from_data.content=content;
    from_data.expert_id = expert_id;
    from_data.question_area = fieldIds;
    app.func.req(api.getApi("issueForm"),from_data,"POST",{},function(res){
          if(!res.serror){
              setTimeout(function(){
                wx.hideLoading()
              },2000)
              /* 开始支付流程 */
              var issueId = res.result;
              //util.toPay(2,issueId,domain);//发起支付
              wx.redirectTo({
                  url: '/pages/user/pay/result?type=2&domain='+domain
              })
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

  }

})
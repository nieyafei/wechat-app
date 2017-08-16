// user-info.js
var app = getApp();
var api = require("../../../utils/api");
var util = require('../../../utils/util');
var title,orgName,position;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},user:{},
    isClearShow:false,invalVlaue:"",
    isClearShow2:false,invalVlaue2:"",
    isClearShow3:false,invalVlaue3:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
    this.loadUser();
  },
  loadUser:function(){
    var that = this;
    util.getStorage("user").then(function(res){
      title = res.data.full_name;
      orgName = res.data.org_name;
      position = res.data.position;
      that.setData({
        user:res.data,invalVlaue:res.data.full_name,
        invalVlaue2:res.data.org_name,
        invalVlaue3:res.data.position
      })
    })
  },
  inputName:function(e){
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
    this.setData({
      invalVlaue:"",isClearShow:false
    })
  },

  /* 公司 */
  inputCompany:function(e){
    orgName = e.detail.value;
    /*this.setData({invalVlaue2:orgName})*/
    if(orgName.length>0){
      this.setData({isClearShow2:true})
    }else{
      this.setData({isClearShow2:false})
    }
  },
  inputFocus2:function(e){
    if(e.detail.value.length>0){
      this.setData({isClearShow2:true})
    }
  },
  inputBlur2:function(e){
     this.setData({isClearShow2:false})
  },
  clearInput2:function(e){
    this.setData({
      invalVlaue2:"",isClearShow2:false
    })
  },

  /* 职位 */
  inputPosition:function(e){
    position = e.detail.value;
    /*this.setData({invalVlaue3:position})*/
    if(position.length>0){
      this.setData({isClearShow3:true})
    }else{
      this.setData({isClearShow3:false})
    }
  },
  inputFocus3:function(e){
    if(e.detail.value.length>0){
      this.setData({isClearShow3:true})
    }
  },
  inputBlur3:function(e){
     this.setData({isClearShow3:false})
  },
  clearInput3:function(e){
    this.setData({
      invalVlaue3:"",isClearShow3:false
    })
  },


  submitForm:function(){
    /* 保存基本资料 */
    var from_data={};
    if(util.isNull(title)){
      util.showToastNormal("请输入姓名");
      return false;
    }

    if(util.isNull(orgName)){
      util.showToastNormal("请输入公司");
      return false;
    }
    if(util.isNull(position)){
      util.showToastNormal("请输入职位");
      return false;
    }
    wx.showLoading({
      title: '正在提交',
    })
    
    from_data.name=title;
    from_data.org=orgName;
    from_data.title=position;
    app.func.req(api.getApi("userInfo"),from_data,"PUT",{},function(res){
          if(res.result.code==200){
              util.getStorage("user").then(res=>{
                res.data.full_name=title;
                res.data.org_name=orgName;
                res.data.position=position;
                wx.setStorage({
                  key:'user',data:res.data
                })
              })
              setTimeout(function(){
                wx.hideLoading();
                wx.reLaunch({
                  url: '/pages/user/user-center'
                })
              },2000)
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
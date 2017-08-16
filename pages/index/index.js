//index.js
//获取应用实例
var app = getApp();
var api = require("../../utils/api");
var util = require('../../utils/util');
Page({
  data: {
    motto: '欢迎来到科学家在线企业端',
    userInfo: {},systemInfo:{},
      inputShowed: true,
      inputVal: "",
      swiperList:{list:[],
          autoplay:true,
          interval:3000,
          duration:500,
          indicatorDots:true,
          circular:true,height:200,
          indicatorColor:"#373a3b",indicatorActiveColor:"#d0cece"
      },
      modalShowed:false,
      animationData:{},
      pushData:{
        expert:{list:[],page:-1,totalPage:1}
      },
      unread:0,tabbarInit:util.tabbarInit()
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../login/login'
    })
  },
  onLoad: function () {
    this.pullUpload();
    this.loadUnread();
    var that = this;
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
      app.getSystemInfo(function (systemInfo) {
          that.setData({
              systemInfo:systemInfo
          })
      })
      //加载轮播
      this.loadBanner();
  },
  onShow:function(){
      this.closeModel();
  },
    loadImage:function (e) {
        var hei = this.data.systemInfo.screenWidth*e.detail.height/e.detail.width;
        this.setData({
            'swiperList.height':hei
        })
        
    },
    loadBanner:function(e){
        var that = this;
        app.func.req(api.getApi("indexBanner"),{},"GET",{},function(res){
            if(res){
                if(!res.serror){
                    res.result.map(function(item){
                        item.pic = util.toImages(item.pic)
                        return item;
                    })
                    that.setData({
                        'swiperList.list':res.result
                    })
                }
            }else{
                console.log("数据加载失败");
            }
          
      });
    },
    btnNewIssue:function(e){
        util.toMustLoginPage("",0);
    },
    closeModal:function (e) {
        this.setData({
            modalShowed:false
        })
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        this.pullUpload();
    },
    pullUpload:function () {
        util.loadPushExpert(4);
    },
    loadUnread:function(){
        var that=this;
        app.func.req(api.getApi("unreadMess"),{},"GET",{},function(res){
            if(!res.serror){
                that.setData({
                    unread:res.result
                })
            }
        });
    },
    toLoginPage:function(e) {
        /* 去需要登录的页面 */
        var url = e.currentTarget.dataset.url;
        util.toMustLoginPage(url);
    },
    closeModel:function(){
        util.showModel(false);
    },
    /*
    页面转发
    */
    onShareAppMessage: function (res) {
        if (res.from === 'button') {
        // 来自页面内转发按钮
        console.log(res.target)
        }
        return {
            title: '科学家在线，为知识寻找价值',
            path: '/pages/index/index',
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

// list.js
var app = getApp();
var api = require("../../../utils/api");
var util = require('../../../utils/util');
var index;
function initdata(that){
  that.data.pushData.other.list.map(function(item){
    item.txtStyle = "";
  })
  that.setData({
    'pushData.other.list':that.data.pushData.other.list
  })
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pushData:{
      other:{list:[],page:-1,totalPages:1}
    },
    delBtnWidth:80
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      /* 首先判断是否登录 */
      util.initLoginUser();
  },
  onShow:function(){
      /* 监听页面显示 */
      var that = this;
      util.initLoginUser();
      util.getStorage("fid").then(res=>{
        that.collectProcess(4,res.data,1);
        wx.removeStorage({
          key: 'fid'
        })
      })
  },
  loadPages:function(){
      /* 开始加载页面数据 */
      this.pullUpload();
  },
  retryOnload:function () {
      /* 数据异常点击重试 */
      util.showHidePageNull(false,1)
      this.pullUpload();
  },
  dataProcess:function(content){
    /* 数据处理 */
    content.map(function(item){
        item.createTime = util.formatTime(new Date(item.createTime*1000),1);
        item.txtStyle = "";
        item.coverPic = util.toImages(item.coverPic);
    })
    return content;
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.pullUpload();
  },

  pullUpload:function(){
      util.loadUcListCommon("userExpert");
      //util.loadPushExpert(2);
  },

  /* 侧滑操作 */
  touchS:function(e){
    if(e.touches.length==1){
      this.setData({
        //设置触摸起始点水平方向位置
        startX:e.touches[0].clientX
      });
    }
  },
  touchM:function(e){
    initdata(this);
    if(e.touches.length==1){
      //手指移动时水平方向位置
      var moveX = e.touches[0].clientX;
      //手指起始点位置与移动期间的差值
      var disX = this.data.startX - moveX;
      var delBtnWidth = this.data.delBtnWidth;
      var txtStyle = "";
      if(disX == 0 || disX < 0){//如果移动距离小于等于0，文本层位置不变
        txtStyle = "margin-left:0px";
      }else if(disX > 0 ){//移动距离大于0，文本层left值等于手指移动距离
        txtStyle = "margin-left:-"+disX+"px";
        if(disX>=delBtnWidth){
          //控制手指移动距离最大值为删除按钮的宽度
          txtStyle = "margin-left:-"+delBtnWidth+"px";
        }
      }
      //获取手指触摸的是哪一项
      var index = e.currentTarget.dataset.index;
      var list = this.data.pushData.other.list;
      list[index].txtStyle = txtStyle;
      //更新列表的状态
      this.setData({
        'pushData.other.list':list
      });
    }
  },
  touchE:function(e){
    if(e.changedTouches.length==1){
      //手指移动结束后水平位置
      var endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离
      var disX = this.data.startX - endX;
      var delBtnWidth = this.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var txtStyle = disX > delBtnWidth/2 ? "margin-left:-"+delBtnWidth+"px":"margin-left:0px";
      //获取手指触摸的是哪一项
      var index = e.currentTarget.dataset.index;
      var list = this.data.pushData.other.list;
      list[index].txtStyle = txtStyle;
      //更新列表的状态
      this.setData({
        'pushData.other.list':list
      });
    }
  },
  delItem:function(e){
    index = e.currentTarget.dataset.index;
    var id = e.currentTarget.dataset.id;
    util.collectCommon(4,id,1);//取消关注
  },
  collectProcess:function(type,uid,tab){
    this.data.pushData.other.list.splice(index, 1);
    this.setData({
      'pushData.other.list':this.data.pushData.other.list
    })
  }
})
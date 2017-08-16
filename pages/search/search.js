// search.js
var app = getApp();
var api = require("../../utils/api");
var util = require('../../utils/util');
var key = "";
Page({

  /**
   * 页面的初始数据
   */
  data: {
      inputShowed: true,isFacus:true,
      inputVal:"",placeholderSearch:"搜索专家、案例、技术、观点",
      historyShowed:false,searchType:"all",
      searchHistoryArray:[],isRefresh:true
  },
    showInput: function () {
        this.setData({
            inputShowed: true
        });
    },
    clearInput: function () {
        this.setData({
            inputVal: ""
        });
    },
    inputTyping: function (e) {//获取焦点
        var str = e.detail.value;
        this.setData({
            historyShowed:util.trim(str).length>0?false:true
        });
    },
    inputBlur:function(e){
        key = e.detail.value;
        /*this.setData({
            historyShowed:false,isRefresh:true
        });
        this.searchBykey();*/
    },
    inputFocus:function (e) {
        var str = e.detail.value;
        this.setData({
            historyShowed:true//util.trim(str).length>0?false:true
        });
    },
    searchConfirm:function(e){
        this.setData({
            historyShowed:false,isRefresh:true
        });
        key = e.detail.value;
        this.searchBykey();
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.initHistory();
      key = options.key;
      this.searchBykey();
  },
  initHistory:function(){
      util.getStorage("searchHistory").then(res=>{
          this.setData({
              searchHistoryArray:res.data
          });
      })
  },
  clickSearch:function(e) {
      key = e.target.dataset.key;
      this.searchBykey();
  },
  clearHistory:function(e){
      var that = this;
      wx.removeStorage({
        key: 'searchHistory',
        success: function(res) {
            that.setData({
              searchHistoryArray:[]
          });
        } 
      })
  },
  searchBykey: function(){
      //全部搜索
     if(!util.isNull(key)){
         util.searchLoad(key);
     }
      /*var that = this;
     if(!util.isNull(key)){
         this.setData({
            inputVal: key,isFacus:false,
            historyShowed:false
        });
         wx.showLoading({title: '正在搜索',});
         util.getHositoy(key);
         setTimeout(function() {
             that.initHistory();
         }, 1000);
         util.showHidePageNull(true,0);
         app.func.req(api.getApi("search")+key,{},"GET",{},function(res){
            if(!res.serror){
                
                wx.hideLoading();
            }else{
                util.showHidePageNull(true,0);
            }
        });
     }*/
  }
  
})
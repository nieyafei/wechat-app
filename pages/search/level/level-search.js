// search.js
var app = getApp();
var api = require("../../../utils/api");
var util = require('../../../utils/util');
var key="",sor=0,aggs=0,fieldAggs="",cityAggs="",ctyArr=[0,0];
var fil = {field:{list:[{name:"领域",id:""}],index:0},
        cityOrg:{
          citys:[],
          orgs:[],
          list:["城市","机构"],actList:[],
          sityOrgValue:"城市/机构",botPickerIsShow:false,value:[]
        },
        sort:{list:[{name:"默认排序",id:"0"},{name:"H因子排序",id:"1"},{name:"浏览量排序",id:"3"}],index:0},
        isShow:false,isRefresh:true}
Page({

  /**
   * 页面的初始数据
   */
  data: {
      inputShowed: true,isFacus:false,
      inputVal:"",placeholderSearch:"请输入专家姓名、机构或领域关键字",
      historyShowed:false,isRefresh:true,
      searchHistoryArray:[],searchType:"e",
      expertList:[],isSearch:false,
      pushData:{
        expert:{list:[],page:-1,totalPage:1},
        question:{list:[],page:-1,totalPage:1},
        case:{list:[],page:-1,totalPage:1},
        tech:{list:[],page:-1,totalPage:1},
        opinion:{list:[],page:-1,totalPage:1}
      },
      searchFilter:fil,
      isAggs:false
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
        /*this.setData({
            historyShowed:util.trim(str).length>0?false:true
        });*/
    },
    inputBlur:function(e){
        key = e.detail.value;
        //this.searchBykey();
    },
    inputFocus:function (e) {
        var str = e.detail.value;
        /* util.trim(str).length>0?false:true */
        this.setData({
            historyShowed:true
        });
    },
    searchConfirm:function(e){
        sor=0,aggs=0,fieldAggs="",cityAggs="";
        this.setData({
            historyShowed:false,isRefresh:true,isAggs:true,searchFilter:fil
        });
        console.log(this.data);
        key = e.detail.value;
        this.searchBykey();
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      sor=0,aggs=0,fieldAggs="",cityAggs="",ctyArr=[0,0];
      this.initHistory();
      this.setData({
        searchType:options.type?options.type:"e",
        searchFilter:fil,isAggs:true,isFacus:options.focus
      })
      console.log(this.data.searchFilter);
      key = options.key;
      /* util.isNull(key) && this.data.searchType=="e" */
      if(false){
          this.pullUpload();
      }else{
          this.searchBykey();
      }
  },
  initHistory:function(){
      util.getStorage("searchHistory").then(res=>{
          this.setData({
              searchHistoryArray:res.data
          });
      })
  }
  ,
  clickSearch:function(e) {
      sor=0,aggs=0,fieldAggs="",cityAggs="";
        this.setData({
            historyShowed:false,isRefresh:true,isAggs:true,searchFilter:fil
        });
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
     var that = this,aggs="";
     if(true){
          this.setData({
            isSearch:true
          })
         if(that.data.searchType=="e"){
            that.setData({
              'searchFilter.isShow':true
            })
         }
         if(!util.isNull(fieldAggs)){
             aggs=fieldAggs;
         }
         console.log(fieldAggs);
         if(!util.isNull(cityAggs)){
             aggs+=(!util.isNull(fieldAggs)?"&":"")+cityAggs;
         }
         if(util.isNull(aggs)){
             aggs = 0
         }
         util.searchLoad(key,sor,aggs);
     }else{
       this.setData({
         isSearch:false
       })
       this.pullUpload();//推荐专家
     }
  },
  searDataProess:function(content){
    content.map(function(item){
        var nArr = util.searchArrayStr(item.name);
        item.name = nArr;
        item.seStr = true;
        item.coverPic = util.toImages(item.coverPic);
    })
    return content;
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
      if(!this.data.isSearch && this.data.searchType=="e"){
        this.pullUpload();
      }else{
        this.searchBykey();
      }
  },
  pullUpload:function () {
      /* 推荐专家 */
      util.loadPushExpert(100);
  },
  /* 筛选按钮 */
  open_change:function(){
      this.setData({
        'searchFilter.cityOrg.botPickerIsShow':true
      })
      if(ctyArr[0]==0){
            this.setData({
            'searchFilter.cityOrg.actList':this.data.searchFilter.cityOrg.citys
            })
        }else{
            this.setData({
            'searchFilter.cityOrg.actList':this.data.searchFilter.cityOrg.orgs
            })
        }
  },
  closePicker:function(){
      this.setData({
        'searchFilter.cityOrg.botPickerIsShow':false
      })
  },
  bindCityChange:function(e){
    ctyArr = e.detail.value.length>0?e.detail.value:[0,0];
    if(ctyArr[0]==0){
        this.setData({
          'searchFilter.cityOrg.actList':this.data.searchFilter.cityOrg.citys
        })
    }else{
        this.setData({
          'searchFilter.cityOrg.actList':this.data.searchFilter.cityOrg.orgs
        })
    }
  },
  changeCityConcle:function(){
    //取消城市筛选
    this.closePicker();
    this.setData({
          isRefresh:cityAggs.length>0?true:false,
          "searchFilter.cityOrg.sityOrgValue":"城市/机构"
    })
    cityAggs="";
    this.searchBykey();//重新搜索
  },
  changeCityConfirm:function(){
    //确定筛选
    this.closePicker();
    this.setData({
          isRefresh:true
    })
    var sityOrgValueName = "";
    if(ctyArr[0]==0){
        cityAggs = this.data.searchFilter.cityOrg.citys[ctyArr[1]].id
        sityOrgValueName = this.data.searchFilter.cityOrg.citys[ctyArr[1]].name
    }else{
        cityAggs = this.data.searchFilter.cityOrg.orgs[ctyArr[1]].id
        sityOrgValueName = this.data.searchFilter.cityOrg.orgs[ctyArr[1]].name
    }
    /*cityAggs = encodeURIComponent(cityAggs)*/
    console.log(sityOrgValueName);
    this.setData({
        "searchFilter.cityOrg.sityOrgValue":sityOrgValueName,
        'searchFilter.cityOrg.value':ctyArr
    })
    this.searchBykey();//重新搜索
  },
  bindFieldPickerChange:function(e){
      /* 选择领域 */    
      var s = e.detail.value;
      fieldAggs = this.data.searchFilter.field.list[s].id;
      this.setData({
          'searchFilter.field.index':s,isRefresh:true
      })
      if(s==0){
          fieldAggs = null;
      }
      /*fieldAggs = encodeURIComponent(fieldAggs);*/
      this.searchBykey();//重新搜索
  },
  bindSortPickerChange:function(e){
    /* 选择排序方式 */
    this.setData({
        'searchFilter.sort.index':e.detail.value,
        isRefresh:true
    })
    sor = this.data.searchFilter.sort.list[e.detail.value].id;
    this.searchBykey();//重新搜索
  }  
  
})
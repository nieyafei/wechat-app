var Promise = require("./es6-promise.min");
var api = require("./api");
var app = getApp();
var imgUrl = "http://img.scientistin.com/imgs";
function wxPromisify(fn) { 
    return function (obj = {}) { 
        return new Promise((resolve, reject) => { 
            obj.success = function (res) { 
                resolve(res) } 
            obj.fail = function (res) { 
                reject(res) 
            } 
            fn(obj) 
        }) 
    } 
}

//无论promise对象最后状态如何都会执行
Promise.prototype.finally = function (callback) {
 let P = this.constructor;
 return this.then(
 value => P.resolve(callback()).then(() => value),
 reason => P.resolve(callback()).then(() => { throw reason })
 );
};

function formatTime(date,type) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  if(type==0){
      //返回年月日
      return [year, month, day].map(formatNumber).join('-');
  }else if(type==1){
      if(new Date().getTime() - date.getTime() < 86400000){
          return "今天 "+[hour, minute].map(formatNumber).join(':');
      }else{
          return [year, month, day].map(formatNumber).join('.');
      }
  }else if(type==2){
      return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  }else{
      //返回年月日 时间
      return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  }
  
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function getToken(){
  wx.getStorage({
        key: 'user',
        success: function(res) {
            var user = res.data;
            var token = user?user.token:"";
            console.log(token);
            return token;
        }
    })
}

/* 接口数据获取 */
function reqAjax(url,data,method,header,cb){
    if(typeof header === "object" && !(header instanceof Array)){
        var hasProp = false;
        for (var prop in header){
            hasProp = true;
            break;
        }
        if (!hasProp){
            header = {
                'content-type': 'application/json'
            };
        }
    }
    var token = ""
    wx.getStorage({
        key: 'user',
        success: function(res) {
            var user = res.data;
            token = user?user.token:"";
        },
        complete:function(){
            if(token){
                header["X-Authorization"]="Bearer "+token;
            }
            getStorage("3rd_session").then(r=>{
                if(r.data){
                    /* 拿到3rd_session */
                    header["WechatSession"]=r.data;
                    aj();
                }else{
                    aj();
                }
            }).catch(function(){
                aj();
            })
            
            function aj(){
                wx.request({
                    url: url, //仅为示例，并非真实的接口地址
                    data:data,
                    header:header,
                    method:method,
                    success: function(res) {
                        if(!(res.statusCode == 405 || res.statusCode==403 || res.statusCode==401)){
                            typeof cb == "function" && cb(res.data)
                        }else{
                            wx.removeStorage({
                                key: 'user',
                                success: function(res) {
                                    wx.navigateTo({
                                        url: '/pages/login/login?error=0'
                                    })
                                } 
                            })
                        }
                    },
                    fail: function(e){
                        return typeof cb == "function" && cb(false)
                    }
                })
            }

        }
    })
}

/*
 显示toast提示
 title:    提示的内容 必填
 icon:     图标，//请指定正确的路径，选填
 duration: 提示的延迟时间，单位毫秒，默认：1500, 10000永远存在除非手动清除 选填
 mask:     是否显示透明蒙层，防止触摸穿透，默认：true 选填
 cb:       接口调用成功的回调函数 选填
 */
function showToast(obj) {
    if (typeof obj == 'object' && obj.title) {
        if (!obj.duration || typeof obj.duration != 'number') { obj.duration = 1500; }//默认1.5s后消失
        var that = getCurrentPages()[getCurrentPages().length - 1];//获取当前page实例
        obj.isShow = true;//开启toast
        if (obj.duration < 10000) {
            setTimeout(function () {
                obj.isShow = false;
                obj.cb && typeof obj.cb == 'function' && obj.cb();//如果有成功的回调则执行
                that.setData({
                    'showToast.isShow': obj.isShow
                });
            }, obj.duration);
        }
        that.setData({
            showToast: obj
        });
    } else {
        console.log('showToast fail:请确保传入的是对象并且title必填');
    }
}

function showToastNormal(obj){
  showToast({
      duration:2000,title:obj,mask:false
  })
}

/**
 *手动关闭toast提示
 */
function hideToast() {
    var that = getCurrentPages()[getCurrentPages().length - 1];//获取当前page实例
    if (that.data.showToast) {
        that.setData({
            'showToast.isShow': false
        });
    }
}

function isNull(obj) {
    var flag = false;
    if (obj == null || obj == undefined || typeof (obj) == 'undefined' || obj == '') {
        flag = true;
    } else if (typeof (obj) == 'string') {
        obj = obj.trim();
        if (obj == '') {//为空
            flag = true;
        } else {//不为空
            obj = obj.toUpperCase();
            if (obj == 'NULL' || obj == 'UNDEFINED' || obj == '{}') {
                flag = true;
            }
        }
    }
    else {
        flag = false;
    }
    return flag;
}

function isPhone(obj) {
    if(isNull(obj)){
        return false;
    }
    if(!(/^1(3|4|5|7|8)\d{9}$/.test(obj))){
        return false;
    }
    return true;
}

function isEmail(obj){
    if(isNull(obj)){
        return false;
    }
    if(!(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(obj))){
        return false;
    }
    return true;
}

//领域：电子电气、纺织服装、化学化工、计算机/通信、能源环保、机械设备、家用电器、建筑建材、农林牧渔、轻工制造、食品饮料、新材料、生物医药、其他
function fieldArray(){
    var ar = [
        {title:"电子电气",id:7,isActive:false},
        {title:"纺织服装",id:8,isActive:false},
        {title:"化学化工",id:9,isActive:false},
        {title:"计算机",id:10,isActive:false},
        {title:"能源环保",id:11,isActive:false},
        {title:"机械设备",id:12,isActive:false},
        {title:"家用电器",id:13,isActive:false},
        {title:"建筑建材",id:14,isActive:false},
        {title:"农林牧渔",id:15,isActive:false},
        {title:"轻工制造",id:16,isActive:false},
        {title:"食品饮料",id:17,isActive:false},
        {title:"新材料",id:18,isActive:false},
        {title:"生物医药",id:19,isActive:false},
        {title:"其他",id:20,isActive:false}
    ] 
    return ar;

};
function initField(type,arr,id){
    //type:0 单选   1 多选   2 获取title  3 获取选择的ids
    var ars = fieldArray();
    switch(type){
        case 0:
            return getField(ars,id);
        case 1:
            return getField(arr,id);
        case 2:
            return getFieldTitle(ars,id);
        case 3:
            return getFieldActiveIds(arr);
        case 4:
            return getFieldActiveIdsOne(arr);    
        default:
            return null;

    }

    function getField(objs,id){
        var obj = [];
        objs.map(function(item){
            var im = item;
            if(im.id==id){
                im.isActive=!im.isActive;
            }
            obj.push(im);
        })
        return obj;
    }

    function getFieldTitle(objs,id){
        var obj = "";
        objs.map(function(item){
            if(item.id==id){
              obj = item.title;  
            }
        })
        return obj;
    }

    function getFieldActiveIds(objs){
        var ids="";
        objs.map(function(item){
            if(item.isActive){
              ids +=item.id+",";  
            }
        })
        return ids;
    }

    function getFieldActiveIdsOne(objs){
        var ids=0;
        objs.map(function(item){
            if(item.isActive){
              ids =item.id;  
            }
        })
        return ids;
    }

}

// 获取缓存内容 key
function getStorage(key){
    return wxPromisify(wx.getStorage)({key:key})
}

// 显示隐藏未登录page
// type 0 暂无数据   1 未登录  2  数据异常  3 页面报错信息
function showHidePageNull(flag,type,text){
    var that = getCurrentPages()[getCurrentPages().length - 1];
    console.log(flag)
    that.setData({
        pageOther:{type:type?type:0,text:text?text:"暂无内容",isShow:flag?flag:false}
    })
    console.log(that.data);
    /*return {type:type?type:0,text:text?text:"暂无数据",isShow:flag?flag:false}*/
}
//是否显示分页加载动画
function footLoading(isLoading,text,type){
    /* type 1  数据异常 */
    var that = getCurrentPages()[getCurrentPages().length - 1];
    console.log(that);
    that.setData({
        footLoading:{isLoading:isLoading?isLoading:false,text:text?text:"正在加载",type:type?type:0}
    })
}

function tabbarInit(type){
    var tabbarArr = [
        {title:"首页",isActive:false,icon:"/images/home.png",activeIcon:"/images/homeactive.png",number:-1,isButton:false,url:"/pages/index/index"},
        {title:"客服",isActive:false,icon:"/images/contact.png",activeIcon:"/images/contactactive.png",number:-1,isButton:true,url:""},
        {title:"我",isActive:false,icon:"/images/user.png",activeIcon:"/images/useractive.png",number:-1,isButton:false,url:"/pages/user/user-center"}
    ];/* {title:"发现",isActive:false,icon:"/images/find.png",activeIcon:"/images/findactive.png",number:-1,isButton:false,url:"/pages/discover/index"}, */
    type = type||0;
    tabbarArr[type].isActive=true;
    return tabbarArr;
}

/* 去空格 */
function trim(str){
    if(isNull(str)){ return "";}
    return str.replace(/\s+/g,"");
}

/* 获取搜索历史 */
function getHositoy(key){
    var that = getCurrentPages()[getCurrentPages().length - 1];
    getStorage("searchHistory").then(res=>{
        var searArr = res.data;
        if(isNull(key)){
            that.data({
                searchHistoryArray:searArr
            })
        }else{
            var historyList = [];
            if(searArr&&searArr.length>0){
                searArr.map(function(val){
                    if(val!=key){
                        historyList.push(val);
                    }
                })
            }
            if(historyList.length < 10){
                historyList.unshift(key);
            }else{
                historyList.unshift(key);
                historyList.pop();
            }
            wx.setStorage({
                key:"searchHistory",data:historyList
            })
            /*that.data({
                searchHistoryArray:historyList
            })*/
        }
    }).catch(function(){
        var historyList = [];
        if(!isNull(key)){
            historyList.push(key);
            wx.setStorage({
                key:"searchHistory",data:historyList
            })
        }
        /*that.data({
            searchHistoryArray:[]
        })*/
    })
}

/* 加载推荐专家 */
function loadPushExpert(allPage){
    var that=getCurrentPages()[getCurrentPages().length - 1];
    var exp = that.data.pushData.expert;
    var pageNum = exp.page+1;
    if(pageNum>=allPage || pageNum>=exp.totalPage){
        footLoading(false,"没有更多了")
        return false;
    }
    footLoading(true);
    reqAjax(api.getApi("recmdList")+pageNum+"/10",{},"GET",{},function(res){
        if(res.result){
            if(res.result && res.result.content && res.result.content.length>0){
                res.result.content.map(function(item){
                    item.coverPic = toImages(item.coverPic);
                    return item.txtStyle="";
                })
                that.setData({
                    'pushData.expert':{
                        list:exp.list.concat(res.result.content),page:pageNum,totalPage:res.result.totalPages
                    }
                })
            }else{
                footLoading(false,"没有更多了");
            }
            setTimeout(function(){
                wx.stopPullDownRefresh()
            },300)
        }
    });
}
/* 搜索数据 */
function searchLoad(key,sor,aggs){
    var that=getCurrentPages()[getCurrentPages().length - 1];

    that.setData({
        inputVal: key,isFacus:false,
        historyShowed:false,isSearch:that.data.searchType=="e"?true:false
    });
    getHositoy(key);
    setTimeout(function() {
        that.initHistory();
    }, 1000);
    /*showHidePageNull(true,0);*/
    var type = that.data.searchType;
    var str="",contion="";
    if(type=="e"){
        if(isNull(key)){
            key = "*";
        }
    }else{
        if(isNull(key)){
            return false;
        }
    }
    if(type=="e"){
        str = "expert";
    }else if(type=="q"){
        str = "question";
    }else if(type=="c"){
        str = "case";
    }else if(type=="t"){
        str = "tech";
    }else if(type=="o"){
        str = "opinion";
    }
    var searStrArr = str.length>0?that.data.pushData[str]:{};
    if(that.data.isRefresh){
        /* 数据重置 */
        searStrArr = {list:[],page:-1,totalPage:1}
        that.setData({isRefresh:false});
    }
    
    var pageNum = searStrArr.page+1;
    if(str.length>0){
        /* 二级搜索分页加载 */
        if(pageNum>=searStrArr.totalPage){
            footLoading(false,"没有更多数据");
            return false;
        }
        contion = "/"+pageNum+"/10/"+sor+(type!="e"?"":("/"+aggs));//aggs 专家特有参数
    }
    if(pageNum==0){
        wx.showLoading({title: '正在搜索',});
    }else{
        footLoading(true);
    }
    reqAjax(api.getApi("search")+(type=="all"?"":(type+"/"))+key+contion,{},"GET",{},function(res){
        if(res.result){
            var ndate = res.result;
            if(type=="all"){//搜索模式1(ndate.experts!=null && ndate.experts.length>0) || 
                if((ndate.searchQuestionPage!=null && ndate.searchQuestionPage.length>0) || (ndate.searchCase!=null && ndate.searchCase.length>0) || (ndate.searchOpinion!=null && ndate.searchOpinion.length>0) || (ndate.searchTech!=null && ndate.searchTech.length>0)){
                    that.setData({
                        pushData:{
                            expert:{list:ndate.experts,page:0,totalPage:1},
                            question:{list:ndate.searchQuestionPage,page:-1,totalPage:1},
                            case:{list:ndate.searchCase,page:-1,totalPage:1},
                            tech:{list:ndate.searchTech,page:-1,totalPage:1},
                            opinion:{list:ndate.searchOpinion,page:-1,totalPage:1}
                        }
                    })
                    showHidePageNull(false,0);
                }else{
                    showHidePageNull(true,0);
                }
                
            }else{//搜索模式2
                if(type=="e"){
                    if(ndate.experts && ndate.experts.content.length>0){
                        /* 重新搜索置空数据 */
                        if(ndate.experts.totalPages<2){
                            footLoading(false,"没有更多数据");
                        }
                        if(pageNum==0){
                            that.setData({
                                'pushData.expert':{list:[],page:-1,totalPage:1}
                            })
                        }
                        /* 筛选条件 */
                        if(pageNum==0 && that.data.isAggs && ndate.aggs.length>0){
                            var fiList=[],cityList=[],orgList=[];
                            /* 机构 */
                            ndate.aggs[0].forEach(function(item,key){
                                if(key>0){
                                    var str={};
                                    str.name=item[0];
                                    str.id=item[1];
                                    orgList.push(str);
                                }
                            })

                            /* 城市 */
                            ndate.aggs[1].forEach(function(item,key){
                                if(key>0){
                                    var str={};
                                    str.name=item[0];
                                    str.id=item[1];
                                    cityList.push(str);
                                }
                            })
                            /* 领域 */
                            ndate.aggs[2].forEach(function(item,key){
                                var str={};
                                if(key>0){
                                    str.name=item[0];
                                    str.id=item[1];
                                }else{
                                    str.name=item[0];
                                    str.id="0";
                                }
                                fiList.push(str);
                            })

                            that.setData({
                                'searchFilter.field':{list:fiList,index:0},
                                'searchFilter.cityOrg.citys':cityList,
                                'searchFilter.cityOrg.orgs':orgList,
                                'searchFilter.cityOrg.actList':cityList,isAggs:false
                            })

                        }
                        ndate.experts.content = that.searDataProess(ndate.experts.content);
                        that.setData({
                            pushData:{
                                expert:{list:searStrArr.list.concat(ndate.experts.content),page:pageNum,totalPage:ndate.experts.totalPages},
                            }
                        })
                        showHidePageNull(false,0);
                    }else{
                        showHidePageNull(true,0);
                    }
                }else{
                    if(ndate.content && ndate.content.length>0){
                        if(ndate.totalPages<2){
                            footLoading(false,"没有更多数据");
                        }
                        if(type=="e"){
                            
                        }else if(type=="q"){
                            that.setData({
                                pushData:{
                                    question:{list:searStrArr.list.concat(ndate.content),page:pageNum,totalPage:ndate.totalPages}
                                }
                            })
                        }else if(type=="c"){
                            that.setData({
                                pushData:{
                                    case:{list:searStrArr.list.concat(ndate.content),page:pageNum,totalPage:ndate.totalPages}
                                }
                            })
                        }else if(type=="t"){
                            that.setData({
                                pushData:{
                                    tech:{list:searStrArr.list.concat(ndate.content),page:pageNum,totalPage:ndate.totalPages}
                                }
                            })
                        }
                        showHidePageNull(false,0);
                    }else{
                        showHidePageNull(true,0);
                    }
                }
                
            }
            wx.hideLoading();
        }else{
            showHidePageNull(true,0);
            wx.hideLoading();
        }
    });

}

/* 处理数据 */
function searchArrayStr(str){
    if(isNull(str)){
        return "";
    }
    /* 开始处理数据 */
    var arrStr = [];
    str.split("<font>").map(function(item){
        var li = {};
        if(item.length>0){
            if(item.indexOf("</font>")>0){
                li.flag = true;
                li.str = item.split("</font>")[0];
            }else{
                li.flag = false;
                li.str = item;
            }
            arrStr.push(li);
        }
    })
    return arrStr;
}

/* 进入页面判断是否登录 */
function initLoginUser(){
    var that = getCurrentPages()[getCurrentPages().length - 1];
    if(that.data.isLoginIng){
        return false;//已经执行
    }
    that.setData({
        isLoginIng:true
    })
    getStorage("user").then(res=>{
        if(!res.data){
            //未登录状态
            that.setData({
                isLoginFlag:false,isLoginIng:false
            })
            showHidePageNull(true,1);
        }else{
            showHidePageNull(false,1);
            if(!that.data.isLoginFlag){
                that.loadPages();//执行页面加载
            }
            that.setData({
                isLoginFlag:true,isLoginIng:false
            })
        }
    }).catch(function(){
        //未登录 
        console.log("未登录")
        that.setData({
            isLoginFlag:false,isLoginIng:false
        })
        showHidePageNull(true,1);
    })
}


function toMustLoginPage(url,type){
    getStorage("user").then(res=>{
        if(res.data){
            if(type==0){
                showModel(true,1)
                /*wx.showModal({
                    title: '发布项目需求',
                    content: '科学家在线将为您安排4位专家，进行每位专家时长10分钟的三方通话，为您提交的项目提供咨询和对接。*该服务将收取200元信息服务费',
                    confirmText:"发布项目",confirmColor:"#1f6b9b",
                    success: function(res) {
                        if (res.confirm) {
                            wx.navigateTo({url:"/pages/user/issue/issue"})
                        } else if (res.cancel) {
                            console.log('用户点击取消')
                        }
                    }
                })*/
            }else if(type==1){
                showModel(true,2,url)
            }else{
                wx.navigateTo({
                    url: url
                })
            }
        }else{
            /* 未登录状态 */
            showModel(true);
        }
    }).catch(function(){
        /* 未登录状态 */
        showModel(true);
    })
}

function showModel(flag,type,url){
    var that = getCurrentPages()[getCurrentPages().length - 1];
    that.setData({
        modelLogin:{flag:flag,type:(type?type:0),url:url}
    })
    /*wx.showModal({
    title: '提示',
    content: '注册/登录后，获得更多权限',
    cancelText:"登录",confirmText:"注册",confirmColor:"#1f6b9b",
    success: function(res) {
        if (res.confirm) {
            wx.navigateTo({
                url: "/pages/register/register"
            })
        } else if (res.cancel) {
            wx.navigateTo({
                url: "/pages/login/login"
            })
        }
    }
    })*/
}

/* 
* 加载用户列表方法 typeName
* 1、我关注的专家
* 2、我提交的问题
* 3、我发布的项目
* 4、我的电话咨询
* 5、我的收藏
* 6、我的付费记录
* 7、回复列表
isPage 0 不显示  
*/
function loadUcListCommon(typeName,isSize,contion,isPa){
    var that = getCurrentPages()[getCurrentPages().length - 1];
    var isPage = isPa==0?false:true;
    var edart = that.data.pushData.other;
    var pageNum = edart.page+1;
    if(isNull(typeName)){return false;}
    if(pageNum>=edart.totalPages){
        footLoading(false,"没有更多了");
        return false;
    }
    if(pageNum==0){
        wx.showLoading({title: '正在加载',})
    }
    footLoading(true);
    /* 开始加载 */
    reqAjax(api.getApi(typeName)+(contion?contion:'')+pageNum+(isSize!=0?"/10":""),{},"GET",{},function(res){
        if(res){
            if(res.result){
                /* 数据处理 */
                if(res.result.content.length>0){
                    res.result.content = that.dataProcess(res.result.content);
                    that.setData({
                        'pushData.other':{
                            list:edart.list.concat(res.result.content),page:edart.page+1,totalPages:res.result.totalPages
                        }
                    })
                    if(res.result.totalPages<2){
                        footLoading(false,"没有更多了");
                    }
                }else{
                    /* 数据为空 */
                    if(pageNum==0){
                        if(isPage){
                            showHidePageNull(true,0);
                        }
                    }else{
                        footLoading(false,"没有更多了");
                    }
                    
                }
            }else{
                /* 数据加载错误 */
                if(pageNum==0){
                    if(isPage){
                        showHidePageNull(true,2)
                    }
                }else{
                    footLoading(false,"",1);
                }
            }

        }else{
            /* 数据异常处理 */
            if(pageNum==0){
                if(isPage){
                    showHidePageNull(true,2)
                }
            }else{
                footLoading(false,"",1);
            }
        }
        wx.hideLoading();
        setTimeout(function(){
            wx.stopPullDownRefresh()
        },300)
    });

}

/* 关注收藏Com
* type :QUESTION(1),ISSUE(2),CASE(3),EXPERT(4),OPINION(5),TECHNOLOGY(6)
* uid 收藏的id
* tab 0 收藏关注   1 取消收藏
*
 */
function collectCommon(type,uid,tab){
    var that = getCurrentPages()[getCurrentPages().length - 1];
    if(isNull(uid)){
        return false;
    }
    getStorage("user").then(res=>{
        if(!res.data){
            showModel(true);
            return false;
        }
        var urlName = "collect";
        if(tab==1){
            urlName = "uncollect";
        }
        /* 数据操作 */
        reqAjax(api.getApi(urlName),{type:type,uri:uid},"POST",{},function(res){
            if(res && res.result){
                /* 成功操作 */
                if(res.result.code==200){
                    if(tab == 0){
                        showToastNormal(type==4?"关注成功":"收藏成功");
                    }else{
                        showToastNormal(type==4?"取消关注成功":"取消收藏成功");
                    }
                    that.collectProcess(type,uid,tab);
                }else{
                    showToastNormal("数据异常，请重试")
                }

            }else{
                showToastNormal("数据异常，请重试")
            }
        })

    }).catch(function(){
        /* 未登录 */
        showModel(true);
    })    
    
}

/* 发送验证码 */
function sendCode(mobile,type){
    var that = getCurrentPages()[getCurrentPages().length - 1];
    if(that.data.sendFlag){return false;}
    if(!isPhone(mobile)){
        showToastNormal("请输入正确的手机号");
        return false;
    }
    var from_data = {};
    from_data.mobile=mobile;
    from_data.type=type;
    //countdown(that);
    reqAjax(api.getApi("sendCode"),from_data,"POST",{},function(res){
        if(res){
            if(res.result){
                showToastNormal("验证码发送成功");
                countdown(that);
            }else{
                /*newthis.refreshCode();*/
                showToastNormal(res.serror.desc);
            }
        }else{
            showToastNormal("数据异常，请重试")
        }
    });

    function countdown(that) {
        var second = that.data.second
        if (second == 0) {
            that.setData({ second:60,sendText:"重新发送",sendFlag:false}); return ;
        }
        var time = setTimeout(function(){
            that.setData({ second: second - 1,sendText:(second - 1)+"s",sendFlag:true});
            countdown(that);
        } ,1000)
    }

}


/* toPay */
function toPay(sn,id,domain){
    /* 首先由openid   去下单   然后调起支付 */
    var snArr = ["sin-q-04c277a2deb70d56","sin-q-64e138eaaa9f397d","sin-q-89b8235f1701e35f","sin-q-5b462afc649404a5"]
    if(sn<0 || sn>3){
        return false;
    }
    wx.checkSession({
        success: function(){
            //session 未过期，并且在本生命周期一直有效
            payInit();
        },
        fail: function(){
            //登录态过期
            app.lodeUserSession(function(){
                payInit();
            })
        }
    })
    function payInit(){
        wx.showLoading({title:"正在提交"})
        reqAjax(api.getApi("wechatPay"),{productSn:snArr[sn],qid:id},"POST",{},function(res){
            wx.hideLoading()
            if(res && res.result){
                /* 成功操作 */
                if(res.result){
                    wx.requestPayment({
                        'timeStamp': res.result.timestamp,
                        'nonceStr': res.result.nonce,
                        'package': res.result.packageName,
                        'signType': 'MD5',
                        'paySign': res.result.signature,
                        'success':function(res){
                            wx.redirectTo({
                                url: '/pages/user/pay/result?type='+sn+'&domain='+domain
                            })
                        },
                        'fail':function(res){
                            console.log(res)
                            //showToastNormal(res.message)
                        }
                    })
                }else{
                    showToastNormal("数据异常，请重试")
                }

            }else{
                showToastNormal("数据异常，请重试")
            }
        })
    }
}

function toImages(url){
    var nurl = "";
    if(isNull(url)){
        return null;
    }
    if(url.indexOf("http://")>-1){
        nurl = url;
    }else{
        nurl = imgUrl + url;
    }
    return nurl;
}

module.exports = {
    formatTime: formatTime,initLoginUser:initLoginUser,isEmail:isEmail,toPay:toPay,
    reqAjax:reqAjax,tabbarInit:tabbarInit,toMustLoginPage:toMustLoginPage,searchArrayStr:searchArrayStr,
    showToast: showToast,showToastNormal:showToastNormal,getHositoy:getHositoy,
    hideToast: hideToast,showHidePageNull:showHidePageNull,footLoading:footLoading,
    isNull:isNull,isPhone:isPhone,wxPromisify:wxPromisify,collectCommon:collectCommon,sendCode:sendCode,
    fieldArray:fieldArray,initField:initField,getStorage:getStorage,trim:trim,showModel:showModel,
    loadPushExpert:loadPushExpert,searchLoad:searchLoad,loadUcListCommon:loadUcListCommon,toImages:toImages
}

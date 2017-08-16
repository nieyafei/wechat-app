// search.js
var api = require("../../utils/api");
Page({
    /**
     * 页面的初始数据
     */
    data: {
        loginUrl:api.getPath("login")+"?from=0",
        registerUrl:api.getPath("register")+"?from=0",
        indexUrl:api.getPath("index"),
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        /* 如果用户已经登录则跳转到首页 */
        wx.getStorage({
            key: 'user',
            success: function(res) {
                var user = res.data;
                if(user){
                    wx.redirectTo({
                        url: '/pages/index/index'
                    })
                }
            }
        })
    }

   
})
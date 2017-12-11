// pages/me/me_index/me_index.js
let my_log = require('../../../libs/log.js')
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    account: ''
  },
  // 用于对比全局token，有改变则要更新界面
  token: 'none',
  is_login:false,

  bindgetuserInfo(e) {
    my_log.info('用户点击登录', false)

    let that = this
    // console.log(e)
    let userInfo = e.detail
    if (userInfo.errMsg && userInfo.errMsg.indexOf('fail') > 0) {
      my_log.error("无法获取用户userInfo")
      return
    }
    
    if (userInfo.errMsg && userInfo.errMsg.indexOf('ok') > 0) {
      global.userInfo = userInfo.userInfo
      that.setData({
        userInfo: global.userInfo,
        account: global.account
      })

      // 暂时未用
      if (false) {
        // wx.showLoading({
        //   title: '登录中',
        //   mask: true,
        // })
        // // 配置回调函数
        // let callback = [
        //   {
        //     func: function () {
        //       wx.hideLoading()
        //       console.time('getuserInfo')
        //       if (global.account && global.password) {
        //         that.setData({
        //           userInfo: userInfo.userInfo,
        //           account: global.account
        //         })
        //       }
        //     }
        //   },
        //   {
        //     isError: true,
        //     func: function () {
        //       wx.hideLoading()
        //       console.log("已授权登录却发生登录错误,可能是存储token出现问题")
        //     }
        //   }
        // ]
        // app.first_login(e, callback)
      }


    } else {
      console.log("发生错误，bindgetuserInfo出现其他状况")
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if(global.is_login===true&&global.is_login!==this.is_login){
      this.setData({
        userInfo: global.userInfo
      })
    }

  },


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
   
  },
})
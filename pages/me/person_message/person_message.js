// pages/me/person_message/person_message.js
let my_log = require('../../../libs/log.js')
// 未处理的所有高校数据
let campus = require('../../../libs/campus.js').campus

Page({

  /**
   * 页面的初始数据
   */
  data: {
    school_need_account:{
      '汕头大学':true
    },
    school:''
  },
  campus: [],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // 修改campus数据结构以适应picker
    this.campus = campus
    // 初始化picker
    let province_list = campus.map((value) => value.province)
    let school_list

    let province_index
    let school_index
    if (global.userinfo && global.userinfo.school && global.userinfo.school_province) {
      // 之前选择过高校信息
      my_log.info("之前选择过高校信息", { school: global.userinfo.school, province: global.userinfo.school_province })

      province_index = province_list.findIndex((value) => value === global.userinfo.school_province)

      school_list = campus.find((value, index) => value.province === global.userinfo.school_province).school_list
      school_index = school_list.findIndex((value) => value === global.userinfo.school)
    } else {
      // 之前没有选择过高校信息
      my_log.info("之前没有选择过高校信息")

      province_index = province_list.findIndex((value) => value === '广东')
      school_list = campus.find((value, index) => value.province === '广东').school_list
      school_index = school_list.findIndex((value) => value === '汕头大学')
    }
    this.setData({
      province_list,
      province_index,
      school_list,
      school_index
    })
  },

  bindProvinceChange(e) {
    // 省份列被修改
    if (e.detail.column === 0) {
      let school_list = campus.find((value, index) => index === e.detail.value).school_list
      this.setData({
        school_list,
        school_index: 0,
        province_index: e.detail.value
      })
    }
  },

  bindSchoolChange(e) {
    my_log.info("修改学校为" + this.data.school_list[e.detail.value[1]])
    this.setData({
      province_index: e.detail.value[0],
      school_index: e.detail.value[1],
      school: this.data.school_list[e.detail.value[1]]
    })
    global.userinfo.school_province = this.data.province_list[this.data.province_index]
    global.userinfo.school = this.data.school_list[this.data.school_index]
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
    if (global.userinfo && global.userinfo.school) {
      this.setData({
        school: global.userinfo.school
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
  onShareAppMessage: function () {

  }
})
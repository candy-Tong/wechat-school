//app.js
let curFileName = "app.js"
let my_log = require('/libs/log.js')

global.version = 'NULL'
global.is_login=wx.getStorageSync("is_login")
global.userInfo


global.token = wx.getStorageSync('token')

// 汕大账号信息
global.account = wx.getStorageSync('account')
global.password = wx.getStorageSync('password')

"pages/index/index",
  "pages/index/index",
  global.showError = true
global.baseurl = 'https://easy-mock.com/mock/5a19234f4a055229cab8e584/example'


App({

  getPage: function (pageName) {
    let pages = getCurrentPages()
    return pages.find(function (page) {
      return page.__route__ == pageName
    })
  },

  onLaunch: function () {
    let that = this
    my_log.info("global对象", global)
   
    wx.login({
      success: function (res) {
        
        if (res.code) {
          //发起网络请求
          wx.request({
            url: global.baseurl + '/user/open?is_login=true',
            data: {
              code: res.code
            },
            success(res) {
              console.log(res.data)
              my_log.info("打开小程序API返回值", res.data, false)
              // 请求错误处理
              that.request_error_check(res, function () {
                if (res.data.data.is_login) {
                  // 已登录
                  my_log.info("已登录")
                  that.saveData({is_login:true},function(){
                    that.getUserInfo()
                  })
                } else {
                  // 未登录
                  my_log.info("未登录")
                }
              })



            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }

        // // 检查是否登录
        // if (global.token) {
        //   my_log.info('已登录')
        //   // 获取用户授权过的信息,更新微信信息
        //   this.getUserInfo()    // global.userInfo

        //   `
        //   发送请求，待完成
        //   `

        // } else {
        //   my_log.info('未登录')
        //   // 缓存 loginCode 用于第一次登录
        //   global.code = res.code
        // };


      }
    });
  },

  getUserInfo: function (cb) {
    var that = this
    if (global.userInfo) {
      typeof cb == "function" && cb(global.userInfo)
    } else {
      //调用登录接口
      wx.getUserInfo({
        withCredentials: true,
        success: function (res) {
          console.log("User Info", res)
          wx.setStorageSync('userInfo')
          global.userInfo = res.userInfo
          typeof cb == "function" && cb(global.userInfo)
        },
      })
    }
  },

  // 自动登录，更新信息
  autoLogin() {
    var that = this
    if (global.token) {
      // Do something with return value
      console.log("读取缓存，获取token成功")
      wx.checkSession({
        success: function () {
          //session 未过期，并且在本生命周期一直有效
          wx.request({
            url: global.baseurl + 'wechat/mini/login/auto_login',
            data: {
              token: global.token
            },
            success(res) {
              console.log(res)
              if (res.statusCode != '200') {
                if (res.statusCode >= 500) {
                  console.log('服务器错误')
                  return
                }
                let errorMsg
                if (res.data.error_code === 1) {
                  that.updateMsg({
                    account: res.data.result.account
                  })
                  that.signout()
                  wx.switchTab({
                    url: '/pages/me/me',
                    success: function (res) { }
                  })
                } else {
                  if (res.data.result.error_msg) {
                    errorMsg = res.data.result.error_msg
                  } else {
                    errorMsg = '未知错误'
                  }
                  that.showError(errorMsg)
                }
                return
              }

              //更新登录信息
              that.updateMsg({
                account: res.data.result.account,
                password: res.data.result.password,
                week: res.data.result.week
              })
              console.log(global.week)

            },
            fail(res) {
              console.log('auto login失败，可能超时')
              console.log(res)
            }
          })
        },
        fail: function () {
          //登录态过期
          console.log("登录过期")

        }
      })

    } else {
      console.log("未登录")
    }


  },

  first_login(e, callbackObject) {
    var that = this
    var userinfo = e.detail
    var callbackObj = callbackObject
    wx.login({
      success: function (response) {
        var code = response.code
        if (code) {
          var login_info = {
            code: code,
            iv: userinfo.iv,
            encrypted_data: userinfo.encryptedData
          }
          console.log(userinfo)
          wx.showLoading({
            title: '登录中',
            mask: true
          })
          wx.request({
            url: global.baseurl + 'wechat/mini/login/first',
            data: {
              js_code: login_info.code,
              iv: login_info.iv,
              encrypted_data: login_info.encrypted_data
            },
            success: function (res) {
              console.log(res)

              if (res.statusCode != '200') {
                if (res.statusCode >= 500) {
                  console.log('服务器错误')
                  return
                }

                let errorMsg
                if (res.data.error_code === 1) {
                  that.updateMsg({
                    account: res.data.result.account,
                    token: res.data.result.token
                  })
                  wx.navigateTo({
                    url: '/pages/me/account/account',
                    success: function (res) { }
                  })
                } else {
                  if (res.data.result.error_msg) {
                    errorMsg = res.data.result.error_msg
                  } else {
                    errorMsg = '未知错误'
                  }
                  that.showError(errorMsg)
                }
                return
              }

              console.log("2.登陆返回")
              console.log(res.data)
              //更新数据

              // 是否绑定汕大账号

              if (!res.data.result.account || !res.data.result.password) {
                wx.navigateTo({
                  url: '/pages/me/account/account',
                  success: function (res) { }
                })
              } else {
                global.account = res.data.result.account
                global.password = res.data.result.password
                wx.setStorage({
                  key: 'account',
                  data: global.account,
                })
                wx.setStorage({
                  key: 'password',
                  data: global.password,
                })
              }

              that.updateMsg(res.data.result, callbackObject)

            }, fail(res) {
              console.log(res)
              console.log("登录错误,可能是服务器没有回应，或者超时")
              if (typeof callbackObj == 'object') {
                callbackObj.forEach(function (item, index, object) {
                  if (item.isError && item.func) {
                    if (item.parm) {
                      item.func(item.parm)
                    } else {
                      item.func()
                    }
                  }
                })
              }
            }
          })

        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      },
      fail: function () {
        console.log("login 失败")
      },
      complete() {
        wx.hideLoading()
      }
    })
  },


  // 将数据设为全局变量，并缓存
  saveData(data, callback) {

    for (let index in data) {
      global[index] = data[index]
      wx.setStorageSync(index, global[index])
      if (index === 'token') {
        this.getUserInfo()    // global.userInfo
      }
    }

    console.log("更新信息回调开始")
    if(callback){
      callback()
    }
  },

  // 检查登录是否过期
  checkLogin(callBackObject) {
    let token = global.token
    let account = global.account
    let password = global.password
    // 必须有token，并且绑定了汕大账号才算登录
    if (token && account && password) {
      //已登录
      console.log("已登录，回调开始")

      if (typeof callBackObject == 'object') {
        callBackObject.forEach(function (item, index, object) {
          if (item.func && (item.isError == undefined || item.isError != true)) {
            if (item.parm) {
              item.func(item.parm)
            } else {
              item.func()
            }
          }
        })
      }
    } else {
      //未登录
      console.log("未登录，错误处理回调开始")
      this.signout()
      callBackObject.forEach(function (item, index, object) {
        if (item.isError && item.func) {
          if (item.parm) {
            item.func(item.parm)
          } else {
            item.func()
          }
        }
      })
    }
  },


  signout() {
    global.token = ''
    wx.removeStorageSync('token')
    global.password = ''
    wx.removeStorageSync('password')
    global.userinfo = undefined
    wx.removeStorageSync('userinfo')
    console.log('注销登录')
  },

  contains: function (arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) {
        return true;
      }
    }
    return false;
  },


  showError(errorMsg) {
    wx.showModal({
      title: '错误',
      content: errorMsg,
      showCancel: false,
      confirmColor: "#2d8cf0",
      success: function (res) {
        // if (res.confirm) {
        //   console.log('用户点击确定')
        // } else if (res.cancel) {
        //   console.log('用户点击取消')
        // }
      }
    })
  },

  request_error_check(res, callback) {
    if (res.statusCode !== 200 || res.data.error_code !== 0) {
      my_log.error("发生错误，statusCode 非200 或 error_code 非0", { message: res.data.message, position: curFileName })
    } else {
      callback()
    }
  }

})

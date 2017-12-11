function info(message, other_arguments, showLog = true) {
  if (typeof (arguments[1]) !== Object) {
    if (typeof (arguments[1]) === 'boolean') {
      showLog=arguments[1]
    }
  }

  let log = {
    msg: message,
    type:'info',
    token: global.token ? global.token : null,
    time: new Date().toLocaleString()
  }
  Object.assign(log,other_arguments)
  if (showLog) {
    console.log(log)
  }
  //调用API从本地缓存中获取数据
  let logs = wx.getStorageSync('logs') || []
  logs.unshift(JSON.stringify(log))
  wx.setStorageSync('logs', logs)
}

function error(message, other_arguments, showLog = true) {
  if (typeof (arguments[1]) !== Object) {
    if (typeof (arguments[1]) === 'boolean') {
      showLog = arguments[1]
    }
  }

  let log = {
    msg: message,
    type: 'error',
    token: global.token ? global.token : null,
    time: new Date().toString(),
    other_arguments
  }
  if (showLog) {
    console.error(log)
  }
  //调用API从本地缓存中获取数据
  let logs = wx.getStorageSync('logs') || []
  logs.unshift(JSON.stringify(log))
  wx.setStorageSync('logs', logs)
}

module.exports.info = info
module.exports.error = error
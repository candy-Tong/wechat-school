//logs.js
const util = require('../../utils/util.js')

Page({
  data: {
    logs: []
  },
  onShow: function () {
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        log = JSON.parse(log)
        let showLog = []
        for (let key of Object.keys(log)) {
          showLog.push([key, log[key]])
        }
        return showLog
      })
    })
  }
})

const api_key = "a9P6aIXLoRuFvYU9mvzB06Qo";
const secret_key = "SzrDlfLfByXGUbPqG0ordxLRnCm77ESF";

//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })

    this.getToken();
  },
  /**
   * 获取token
   * 先从storage本地存储中获取，判断是否过期
   * 如果过期，则调用接口，重新获取
   */
  getToken: function () {
    var access_token = wx.getStorageSync("access_token");
    var now = new Date().getTime();
    var access_token_date = parseInt(wx.getStorageSync("access_token_date"));
    var expires_in = parseInt(wx.getStorageSync("expires_in"));

    if (!access_token) {
      this.requestToken();
    } else if (now >= access_token_date + expires_in) {
      this.requestToken();
    } else {
      this.globalData.access_token = access_token;
    }
  },
  requestToken: function () {
    var that = this;
    wx.request({
      url: 'https://aip.baidubce.com/oauth/2.0/token',
      data: {
        grant_type: "client_credentials",
        client_id: api_key,
        client_secret: secret_key
      },
      success: function (res) {

        if (res.statusCode == 200) {
          // console.log(res)
          //保存token
          wx.setStorageSync("access_token", res.data.access_token);
          wx.setStorageSync("expires_in", res.data.expires_in);
          wx.setStorageSync("access_token_date", new Date().getTime());

          that.globalData.access_token = res.access_token;
        }
      }
    })
  },
  globalData: {
    userInfo: null
  }
})
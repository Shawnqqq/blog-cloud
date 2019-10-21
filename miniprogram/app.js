//app.js
App({
  onLaunch: function () {
    this.cloudInit();
    // 找本地缓存
    let openId = wx.getStorageSync('openId')
    let userInfo = wx.getStorageSync('userInfo');
    if(openId && userInfo){
      this.globalData.userInfo = userInfo
      this.globalData.openId = openId
    }else{
      this.getUserInfo();
    }
  },
  // 初始化 云开发配置，传入traceUser为true，让用户的使用记录到后台
  cloudInit(){
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    }else{
      wx.cloud.init({
        env: 'blog-99',  //  环境ID
        traceUser: true,
      })
    }
  },
  getUserInfo(){
    // 判断用户授权
    wx.getSetting({
      success:res=>{
        console.log(1)
        if(res.authSetting['scope.userInfo']){
          // 授权成功 拿用户信息
          wx.getUserInfo({
            success:res=>{
              this.globalData.userInfo = res.userInfo;
              this.getOpenId(res.userInfo);
            }
          })
        }else{
          console.log('用户未授权')
        }
      }
    })
  },
  getOpenId(userInfo){
    wx.cloud.callFunction({
      name:'login',
      data:{},
      success: res=>{
        this.globalData.openid = res.result.openid;
        wx.setStorageSync('userInfo', userInfo);
        wx.setStorageSync('openId', res.result.openid);
      },
      fail:err=>{
        console.error('云函数[login]调用失败',err)
      }
    })
  },
  globalData:{
    userInfo:{},
    openId:''
  }
})

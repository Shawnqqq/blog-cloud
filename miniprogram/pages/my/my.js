const app = getApp()

Page({
  data:{
    avatar:'',
    name:'',
    login:false
  },
  onLoad(){
    this.getUserInfo();
  },
  getUserInfo(){
    let userInfo = app.globalData.userInfo
    if(userInfo){
      this.setData({
        login:true,
        avatar: userInfo.avatarUrl,
        name: userInfo.nickName
      })
    }
  },
  onGetUserInfo(e){
    if(e.detail.userInfo){
      app.getUserInfo()
    }
  },
  handleCreate(){
    wx.navigateTo({
      url: '../create/create'
    })
  },
  handleMy(){
    wx.navigateTo({
      url: '../my_topic/my_topic'
    })
  },
  handleReply(){
    wx.navigateTo({
      url: '../my_reply/my_reply'
    })
  }
})
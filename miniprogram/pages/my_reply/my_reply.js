const db = wx.cloud.database()
const app = getApp();

Page({
  data:{
    reply:[]
  },
  onLoad(){
    this.getData()
  },
  getData(){
    db.collection('reply').orderBy('createTime', 'desc').where({
      _openid: app.globalData.openId
    }).get({
      success:res=>{
        console.log(res.data)
        this.setData({
          reply:res.data
        })
      }
    })
  }
})
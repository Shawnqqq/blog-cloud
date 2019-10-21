const db = wx.cloud.database({
  env: 'blog-99'
})
const app = getApp()

Page({
  data: {
    indexData: []
  },
  onShow() {
    this.getData()
  },
  getData() {
    db.collection('topic').orderBy('createTime', 'desc').where({
      _openid: app.globalData.openId
    })
    .get({
      success: (res) => {
        console.log(res)
        this.setData({
          indexData: res.data
        })
      },
      fail: (err) => {
        console.log(err)
      }
    })
  },
  handleViewImage(e) {
    let url = e.currentTarget.dataset.url
    wx.previewImage({
      current: url,
      urls: [url]
    })
  },
  onPullDownRefresh() {
    this.getData(() => {
      wx.stopPullDownRefresh()
    })
  }
})
const db = wx.cloud.database({
  env: 'blog-99'
})

Page({
  data:{
    indexData:[]
  },
  onShow(){
    this.getData()
  },
  getData(){
    db.collection('topic').orderBy('createTime','desc').get({
      success:(res)=>{
        this.setData({
          indexData:res.data
        })
      },
      fail:(err)=>{
        console.log(err)
      }
    })
  },
  handleViewImage(e){
    let url = e.currentTarget.dataset.url
    wx.previewImage({
      current:url,
      urls:[url]
    })
  },
  onPullDownRefresh(){
    this.getData(()=>{
      wx.stopPullDownRefresh()
    })
  }
})
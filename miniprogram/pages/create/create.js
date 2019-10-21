import { formatTime } from '../../utils/date.js';
const app = getApp();
const db = wx.cloud.database({
  env:'blog-99'
})

Page({
  data:{
    content:'',
    imageUrl:[]
  },
  handleChange:function(e){
    let content = e.detail.value;
    this.setData({
      content
    })
  },
  handleAdd(){
    wx.chooseImage({
      count:1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res)=>{
        let paths = res.tempFilePaths[0]
        this.uploadFile(paths)
      }
    })
  },
  uploadFile(paths){
    let openId = app.globalData.openId
    let time = Date.now()
    let postfix = paths.match(/\.[^.]+?$/)[0];
    let cloudPath = `${openId}_${time}${postfix}`

    wx.showLoading({
      title: '上传中',
      mask:true
    })

    wx.cloud.uploadFile({
      cloudPath:cloudPath,
      filePath:paths,
      success:(res)=>{
        let imageData = this.data.imageUrl
        imageData.push(res.fileID)
        this.setData({
          imageUrl:imageData
        })
      },
      fail:(e) =>{
        wx.showToast({
          icon: 'none',
          title: '上传失败',
        })
      },
      complete:()=>{
        wx.hideLoading()
      }
    })
  },
  handleCancel(){
    wx.navigateBack({
      delta:1
    })
  },
  hanleSubmit(){
    let dates = new Date();
    let date = formatTime(dates)
    let createTime = db.serverDate();
    let content = this.data.content;
    let imageUrl = this.data.imageUrl;
    let userInfo = app.globalData.userInfo;

    if(!content || !imageUrl[0]){
      wx.showToast({
        icon: 'none',
        title: '请输入内容并配上图片喔'
      })
      return
    }
    
    wx.showLoading({
      title: '发布中',
      mask: true
    })

    db.collection('topic').add({
      data:{
        userInfo,content,imageUrl,date,createTime
      },
      success: (res)=>{
        let url = '/pages/single/single?id=' + res._id;
        wx.redirectTo({ url })
      },
      fail: (err) => {
        wx.showToast({
          icon: 'none',
          title: '新增记录失败'
        })
      },
      complete: ()=>{
        wx.hideLoading()
      }
    })

  }
})
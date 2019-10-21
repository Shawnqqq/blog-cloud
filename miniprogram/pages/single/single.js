const db = wx.cloud.database({
  env: 'blog-99'
})
const app = getApp();
import { formatTime } from '../../utils/date.js';

Page({
  data:{
    id:'',
    topic:{},
    reply:[],
    content:'',
    userInfo:null
  },
  onLoad(options){
    this.getData(options.id);
    this.replyData(options.id);
  },
  onShow(){
    this.setData({
      userInfo: app.globalData.userInfo
    })
  },
  getData(id){
    db.collection('topic').doc(id).get({
      success: res=>{
        this.setData({
          topic:res.data,id
        })
      }
    })
  },
  replyData(id){
    db.collection('reply').orderBy('createTime','desc').where({
      topic_id:id
    }).get({
      success:res=>{
        this.setData({reply:res.data})
      }
    })
  },
  handleReply(e){
    let reply = this.data.reply
    let content = e.detail.value
    let dates = new Date();
    let date = formatTime(dates)
    let userInfo = app.globalData.userInfo;
    let createTime = db.serverDate();
    let topic_id = this.data.id;

    if(!content){
      wx.showToast({
        title: '没有输入内容',
        icon:'none'
      })
      return
    }

    wx.showLoading({
      title: '评论中',
      mask: true
    })

    db.collection('reply').add({
      data:{
        content, userInfo, date, topic_id, createTime
      },
      success:res=>{
        wx.showToast({ title: '评论成功' })
        reply.unshift({ content, date, userInfo});
        this.setData({reply:reply,content:''});
        this.incReply(topic_id);
      },
      fail:err=>{
        wx.showToast({
          title: '评论失败',
          icon:'none'
        })
      },
      complete:()=>{
        wx.hideLoading()
      }
    })
  },
  getUserInfo(e){
    if(e.detail.userInfo){
      app.getUserInfo()
      this.onShow()
    }
  },
  incReply(topic_id){
    wx.cloud.callFunction({
      name:'incReply',
      data:{
        topic_id
      },
      success:res=>{
        console.log(res.result)
      },
      fail:err=>{
        console.log(err)
      }
    })
  }
})
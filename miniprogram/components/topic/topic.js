Component({
  properties:{
    indexData:{
      type:Array,
      value:[]
    }
  },
  methods:{
    handleViewImage(e) {
      let url = e.currentTarget.dataset.url
      wx.previewImage({
        current: url,
        urls: [url]
      })
    }
  }
})
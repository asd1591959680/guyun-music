import {request} from '../../utils/request.js'
import regeneratorRuntime from '../../lib/runtime/runtime';
import {Video} from '../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cateList:[],
    currentId:0,
    videoList:[],
    videoUrl:[],
    videoId:'',
    videoTime:[],
    isTrigger:false
  },

  async getCategory(){
    const res = await request({
      url:'/video/group/list'
    })
    let cateList = res.data.slice(0,14)
    this.setData({
      cateList,
      currentId:cateList[0].id
    })
    this.getVideoList(this.data.currentId)
  },
  handleSelect(e){
    const currentId = e.currentTarget.id
    this.setData({
      currentId:currentId*1,
      videoList:[],
    })
    wx.showLoading({
      title: '正在加载',
      mask: true,
    });
    this.getVideoList(this.data.currentId)
  },
  async getVideoList(id){
    const res = await request({
      url:'/video/group',
      data:{id}
    })
    wx.hideLoading();
    let index = 0
    let videoList = res.datas.map(item=>{
      item.id=index++
      return item
    })
    //if(!videoList.url){
    //  videoList.forEach(v=>{
    //    console.log(1);
    //    this.getVideoUrl(v)
    //  })
    //}
    this.setData({
      videoList,
      isTrigger:false
    })
   
  
  },
  listUrls:[],
  async getVideoUrl(v){
    const res = await request({
      url:'/video/url',
      data:{id:v.data.vid}
    })
    this.listUrls.push(new Video({
      url:res.urls[0].url,
      id:v.id,
      vid:v.data.vid,
      coverUrl:v.data.coverUrl,
      avatarUrl:v.data.creator.avatarUrl,
      nickname:v.data.creator.nickname,
      praisedCount:v.data.praisedCount,
      commentCount:v.data.commentCount,
    }))
    this.setData({
      videoUrl:this.listUrls
    })
  
  },
  handlePlay(e){
    let vid =e.currentTarget.id
    //播放下一个时停止上一个播放
    //this.vid !== vid && this.videoContext && this.videoContext.stop()
    //this.vid = vid
    this.setData({
      videoId:vid
    })
    this.videoContext = wx.createVideoContext(vid);
    let {videoTime} = this.data
    let videoItem=videoTime.find(item=>item.vid===vid)
    if(videoItem){
      this.videoContext.seek(videoItem.currentTime)
    }
    this.videoContext.play()
  },
  handleUpdateTime(e){
    let videoTimeObj = {
      vid:e.currentTarget.id,
      currentTime:e.currentTarget.currentTime
    }
    let {videoTime}=this.data
    let videoItem = videoTime.find(item=>item.vid===videoTimeObj.id)
    if(videoItem){
      videoItem.currentTime = e.currentTarget.currentTime
    }else{
      videoTime.push(videoTimeObj)
    }

    this.setData({
      videoTime
    })
  },
  handleEnded(e){
    let {videoTime} = this.data
    let index=videoTime.findIndex(item=>item.vid===e.currentTarget.id)
    videoTime.splice(index,1)
    this.setData({
      videoTime
    })
  },
  //scroll-view标签下拉刷新
  handleRefersh(){
    this.getVideoList(this.data.currentId)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfo = wx.getStorageSync('userInfo');
    if(!userInfo){
      wx.navigateTo({
        url: '/pages/login/login',
      }); 
      return
    }
    this.getCategory()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
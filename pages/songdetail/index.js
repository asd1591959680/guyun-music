import {request} from '../../utils/request.js'
import regeneratorRuntime from '../../lib/runtime/runtime';
import PubSub from 'pubsub-js'
import moment from 'moment'
const app =  getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay:false,
    song:{},
    songId:0,
    songUrl:'',
    currentTime:'00:00',
    durationTime:'00:00',
    playWidth:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let songId = options.id
    this.setData({
      songId
    })
    this.getSongDetail(songId)
    //定义全局变量
    
    if(app.globalData.musicId && app.globalData.musicId===songId){
      this.setData({
        isPlay:true
      })
    }
    this.backAudioManager = wx.getBackgroundAudioManager();
    this.backAudioManager.onPlay(()=>{
      this.changPlay(true)
      app.globalData.musicId=songId
    })
    this.backAudioManager.onPause(()=>{
      this.changPlay(false)
    })
    this.backAudioManager.onStop(()=>{
      this.changPlay(false)
    })
    this.backAudioManager.onEnded(()=>{
      PubSub.publish('switchSong','next')
      this.setData({
        currentTime:'00:00',
        playWidth:0
      })
    })
    this.backAudioManager.onTimeUpdate(()=>{
      let currentTime = moment(this.backAudioManager.currentTime*1000).format('mm:ss')
      let playWidth = this.backAudioManager.currentTime/this.backAudioManager.duration*450
      this.setData({
        currentTime,
        playWidth
      })
    })
  },
  handlePlay(){
    let isPlay=!this.data.isPlay
    let {songId,songUrl}=this.data
    this.getSongUrl(isPlay,songId,songUrl)
  },
  async getSongDetail(ids){
    const res = await request({
      url:'/song/detail',
      data:{ids}
    })

    let song = res.songs[0]
    let durationTime = moment(res.songs[0].dt).format('mm:ss')
    this.setData({
      song,
      durationTime
    })

    wx.setNavigationBarTitle({

      title: this.data.song.name,
    });
  },
  async getSongUrl(isPlay,songId,songUrl){
    if(isPlay){
      if(!songUrl){
        const res = await request({
          url:'/song/url',
          data:{id:songId}
        })
        songUrl=res.data[0].url
        this.setData({
          songUrl
        })
      }
   
    
      this.backAudioManager.src=songUrl
      this.backAudioManager.title=this.data.song.name
    }else{
      this.backAudioManager.pause()
    }
    
    this.setData({
      songUrl
    })
  },
  changPlay(isPlay){
    this.setData({
      isPlay
    })
    app.globalData.musicPlay=isPlay
  },
  handleSwitch(e){
    let type = e.currentTarget.id
    // 关闭当前播放的音乐
    this.backAudioManager.stop();
    //第四步订阅事件
    PubSub.subscribe('songId',(msg,songId)=>{

      this.getSongDetail(songId)
      this.getSongUrl(true,songId)
      PubSub.unsubscribe('songId')
    })
    //第一步发布事件
    PubSub.publish('switchSong',type)
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
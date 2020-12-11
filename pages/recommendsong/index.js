import {request} from '../../utils/request.js'
import regeneratorRuntime from '../../lib/runtime/runtime';
import PubSub from 'pubsub-js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    month:'',
    day:'',
    RecommendList:[],
    index:0
  },
  async getRecommendSong(){
    const res = await request({
      url:'/recommend/songs'
    })
    let RecommendList = res.data.dailySongs
    this.setData({
      RecommendList
    })
  },
  toSongDetail(e){
    let songId = e.currentTarget.dataset.song
    let {index} = e.currentTarget.dataset
    this.setData({
      index
    })
    wx.navigateTo({
      url: '/pages/songdetail/index?id='+songId
    });

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfo=wx.getStorageSync('userInfo');
    if(!userInfo){
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        success: (result) => {
          wx.reLaunch({
            url: '/pages/login/login',
          }); 
        },
      });
      return  
    }
    this.setData({
      month:new Date().getMonth() + 1,
      day:new Date().getDate()
    })
    this.getRecommendSong()
    //第二步订阅事件
    PubSub.subscribe('switchSong',(msg,type)=>{
      let {RecommendList,index} = this.data
      if(type==='pre'){
        (index===0)&&(index=RecommendList.length)
        index-=1
      }else{
        (index===RecommendList.length-1)&&(index=-1)
        index+=1
      }
      this.setData({
        index
      })

      let songId = RecommendList[index].id
      //第三步发布事件
      PubSub.publish('songId',songId)
    })
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
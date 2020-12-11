import {request} from '../../utils/request.js'
import regeneratorRuntime from '../../lib/runtime/runtime';

let startY=0
let moveY=0
let moveDistance = 0
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coverTransform:'translateY(0)',
    coverTransition:'',
    userInfo:{},
    recordList:[]
  },
  handleTouchStart(e){
    this.setData({
      coverTransition:''
    })
    startY = e.touches[0].clientY
  },
  handleTouchMove(e){
    moveY = e.touches[0].clientY
    moveDistance = moveY - startY
    if(moveDistance<0){
      return
    }
    if(moveDistance>=110){
      moveDistance=110
    }
    this.setData({
      coverTransform:`translateY(${moveDistance}rpx)`
    })
  }
  ,
  handleTouchEnd(){
    this.setData({
      coverTransform:'translateY(0)rpx',
      coverTransition:'transform .5s linear'
    })
  },
  handleLogin(){
    wx.navigateTo({
      url: '/pages/login/login',
    });
    
  },

  async getPlayRecord(uid){
    const res = await request({
      url:'/user/record',
      data:{uid}
    })
    let index=0
    let recordList = res.allData.splice(0,10).map(item=>{
      item.id = index++
      //添加新属性一定要return
      return item
    })

    this.setData({
      recordList
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   let info=wx.getStorageSync('userInfo');
    if(info){
      this.setData({
        userInfo:JSON.parse(info)
      })
    }else{
      return
    }
    this.getPlayRecord(this.data.userInfo.userId)
    
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
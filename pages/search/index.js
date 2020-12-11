import {request} from '../../utils/request.js'
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeholder:'',
    hotList:[],
    searchWord:'',
    searchList:[],
    historyList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getHotDefault()
    this.gethotList()
    this.getHistoryList()
  },
  async getHotDefault(){
    const res = await request({
      url:'/search/default'
    })
   
    let placeholder = res.data.showKeyword
    this.setData({
      placeholder
    })
  },
  async gethotList(){
    const res = await request({
      url:'/search/hot/detail'
    })
    let hotList = res.data
    this.setData({
      hotList
    })
  },
  inputContent(e){
    clearTimeout(this.timer)
    let searchWord = e.detail.value
    if(!searchWord.trim()){
      this.setData({
        searchList:[]
      })
      return
    }
    this.timer = setTimeout(() =>{
      this.setData({
        searchWord
      })
      this.getSearchList(searchWord)
    },300)
    
  },
  async getSearchList(keywords){
    const res = await request({
      url:'/search',
      data:{keywords,limit:10}
    })
    let searchList = res.result.songs
    this.setData({
      searchList,
    })
    let {historyList,searchWord} = this.data
    if(historyList.indexOf(searchWord)!==-1){
      historyList.splice(historyList.indexOf(searchWord),1)
    }
    historyList.unshift(searchWord)
    wx.setStorageSync('historyList', historyList);
    this.setData({
      historyList,
    })
  },
  getHistoryList(){
    let historyList=wx.getStorageSync('historyList');
    if(!historyList){
      return
    }
    this.setData({
      historyList
    })
  },
  claerSearch(){
    this.setData({
      searchWord:'',
      searchList:[]
    })
  },
  claerHistory(){
    wx.showModal({
      content: '确认删除?',
      success: (result) => {
        if (result.confirm) {
          this.setData({
            historyList:[]
          })
          wx.removeStorageSync('historyList');
        }
      },
      fail: () => {},
      complete: () => {}
    });
      

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
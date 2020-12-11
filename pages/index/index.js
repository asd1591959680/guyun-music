import {request} from '../../utils/request.js'
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  data: {
    bannerList:[],
    recommendlList:[],
    topList:[]
  },

  async getBannerData(){
    const res = await request({
      url:'/banner',
      data:{
        type:2
      }
    })
    this.setData({
      bannerList:res.banners
    })
  },
  topList:[],
  async getRecommendData(){
    const res = await request({
      url:'/personalized',
      data:{
        limit:10
      }
    })
    this.setData({
      recommendlList:res.result
    })
  },
  async getTopList(){
    const res = await request({
      url:'/toplist',
    })
    let topList = res.list.slice(0,5)
    let topListId = topList.map(v=> v.id)
    topListId.forEach(v=>{
      this.getTopListDetail(v)
    })
  },
  async getTopListDetail(id){
    const list = await request({
      url:'/playlist/detail',
      data:{
        id:id
      }
    })
    let topListData = {name:list.playlist.name,tracks:list.playlist.tracks.slice(0,3)}
    this.topList.push(topListData)
    this.setData({
      topList:this.topList
    })
    
  },
  //options(Object)
  onLoad: function(options) {
    this.getBannerData()
    this.getRecommendData()
    this.getTopList()
  },
  onReady: function() {
    
  },
  onShow: function() {
    
  },
  onHide: function() {

  },
  onUnload: function() {

  },
  onPullDownRefresh: function() {

  },
  onReachBottom: function() {

  },
  onShareAppMessage: function() {

  },
  onPageScroll: function() {

  },
  //item(index,pagePath,text)
  onTabItemTap:function(item) {

  }
});
  
import {request} from '../../utils/request.js'
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:'',
    password:''
  },

  handleInput(e){
    let type = e.currentTarget.dataset.type
    this.setData({
      [type]:e.detail.value
    })
  },
  async login(){
    let {phone,password} = this.data
    if(!phone.trim()){
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
      });
      return  
    }
    let phoneReg = /^[1]([3-9])[0-9]{9}$/
    if(!phoneReg.test(phone)){
      wx.showToast({
        title: '手机号码格式错误',
        icon: 'none',

      });
      return
    }
    if(!password){
      wx.showToast({
        title: '密码不能为空',
        icon: 'none',
      });
      return
    }
    const res = await request({
      url:'/login/cellphone',
      data:{phone,password},
      //标识cookies
      isLogin:true
    })
    if(res.code===200){
      wx.showToast({
        title: '登录成功',
      });
      wx.setStorageSync('userInfo', JSON.stringify( res.profile));
      wx.reLaunch({
        url: '/pages/user/user',
      });
        
    }else if(res.code===501){
      wx.showToast({
        title: '账号尚未注册',
        icon: 'none',
      });
    }else if(res.code===502){
      wx.showToast({
        title: '密码错误',
        icon: 'none',
      });
    }else{
      wx.showToast({
        title: '登录失败，请重新登陆',
        icon: 'none',
      });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
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
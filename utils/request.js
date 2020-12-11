


export const request=(params) => {
  
  return new Promise((resolve,reject) => {
    const baseUrl = 'http://localhost:3000'
    const mobileUrl = 'http://chen0414.test.utools.club'
    wx.request({
      ...params,
      url:baseUrl+params.url,
      header:{
        cookie:wx.getStorageSync('cookies') ? wx.getStorageSync('cookies') : ''
      },
      success: (res) => {
        if(params.isLogin){
          wx.setStorageSync('cookies', res.data.cookie);
        }
        resolve(res.data)
       
      },
      fail: (err) => {
        reject(err)
      },
     
    });
      
  })
}
// pages/image/image.js
Page({
  data: {
    url: "",
    windowHeight: 1280,
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    let height = wx.getSystemInfoSync().windowHeight;
    this.setData({
      url: options.url,
      windowHeight: height
    });
  },
  //分享
  onShareAppMessage: function () {
    let {url} = this.data;
    return {
      title: '干货集中营',
      desc: '每日妹子精选',
      path: `/pages/image/image?url=${url}`
    }
  },
  //保存图片
  saveImg: function (e) {
    let {url} = this.data;
    wx.showModal({
      title: '提示',
      confirmText: '保存',
      confirmColor: '#1acc85',
      cancelText: '取消',
      content: '是否需要保存该图片？',
      success: function (res) {
        if (res.confirm) {

          wx.downloadFile({
            url: url,
            success: function (loadres) {
              console.log('loadres.tempFilePath===>',loadres.tempFilePath);
              wx.saveFile({
                tempFilePath: loadres.tempFilePath,
                success: function (saveres) {
                  var tempFilePath = saveres.savedFilePath
                  console.log('tempFilePath==>',tempFilePath);
                  wx.showToast({
                    title: '保存图片成功',
                    icon: 'success',
                    duration: 2000
                  });
                },
                fail: function () {
                  wx.showToast({
                    title: '保存图片失败',
                    icon: 'success',
                    duration: 2000
                  });
                }
              })
            },
            fail: function () {
              wx.showToast({
                title: '当前网络异常',
                icon: 'success',
                duration: 2000
              });
            },
          });


        }
      }
    });

  },

  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})
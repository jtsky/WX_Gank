import { loadItemsfromLocal, loadItemsFromNet } from '../utils/util';
Page({
  data: {
    isLoading: false,
    showBackTop: true,
    tabs: ['福利', 'Android', 'IOS', 'ALL'],
    image_columns: [],
    android_columns: [],
    ios_columns: [],
    all_columns: [],
    activeTab: 0,
    stv: {
      windowWidth: 0,
      lineWidth: 0,
      offset: 0
    },
    scrolllview: {
      img_top: 0,
      common_top1: 0,
      common_top2: 0,
      common_top3: 0
    }

  },
  //页面加载完成时触发
  onLoad: function (options) {
    try {
      let {tabs} = this.data;
      var res = wx.getSystemInfoSync()
      this.windowWidth = res.windowWidth;
      this.data.stv.lineWidth = this.windowWidth / this.data.tabs.length;
      this.data.stv.windowWidth = res.windowWidth;
      this.tabsCount = tabs.length;
      this.setData({ stv: this.data.stv });
      loadItemsFromNet(this, 0);
      loadItemsFromNet(this, 1);
      loadItemsFromNet(this, 2);
      loadItemsFromNet(this, 3);
      // loadItemsfromLocal(this, 0);
      // loadItemsfromLocal(this, 1);
      // loadItemsfromLocal(this, 2);
      // loadItemsfromLocal(this, 3);
    } catch (e) {
      console.log(e);
    }
  },
  //下拉刷新
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
    let {activeTab} = this.data;
    switch (activeTab) {
      case 0:
        this.setData({ image_columns: [], isLoading: true });
        loadItemsFromNet(this, 0);
        break;
      case 1:
        this.setData({ android_columns: [], isLoading: true });
        loadItemsFromNet(this, 1);
        break;
      case 2:
        this.setData({ ios_columns: [], isLoading: true });
        loadItemsFromNet(this, 2);
        break;
      case 3:
        this.setData({ all_columns: [], isLoading: true });
        loadItemsFromNet(this, 3);
        break;
      default:
        break;
    }
  },

  //分享
  onShareAppMessage :function(){
    return {
      title: '干货集中营',
      desc: '每日干货推荐',
      path: '/pages/index/index'
    }
  },

  handlerStart: function (e) {
    let {clientX, clientY} = e.touches[0];
    this.startX = this.tapStartX = clientX;
    this.startY = this.tapStartY = clientY;
    this.tapStartTime = e.timeStamp;
  },
  handlerMove: function (e) {
    let {clientX, clientY} = e.touches[0];
    let {stv} = this.data;
    let offsetX = this.startX - clientX;

    this.startX = clientX;
    stv.offset += offsetX;
    if (stv.offset <= 0) {
      stv.offset = 0;
    } else if (stv.offset >= stv.windowWidth * (this.tabsCount - 1)) {
      stv.offset = stv.windowWidth * (this.tabsCount - 1);
    }
    this.setData({ stv: stv });

  },
  handlerCancel: function (e) {

  },
  handlerEnd: function (e) {
    let {isLoading} = this.data;
    let {clientX, clientY} = e.changedTouches[0];
    let endTime = e.timeStamp;
    let {tabs, stv, activeTab} = this.data;
    let {offset, windowWidth} = stv;

    let spaceY = this.tapStartY - clientY;
    let spaceX = this.tapStartX - clientX;

    if (isLoading)
      return;

    if (Math.abs(spaceY) - Math.abs(spaceX) < 60) {
      //向左滑动超过40 tab++
      if (spaceX > 40) {
        if (activeTab < this.tabsCount - 1) {
          activeTab = activeTab + 1;
          stv.offset = stv.windowWidth * activeTab;
          this.setData({ activeTab: activeTab, stv: stv });
        }
      }
      //向右滑动超过40 tab--
      else if (spaceX < -40) {
        if (activeTab > 0) {
          activeTab = activeTab - 1;
          stv.offset = stv.windowWidth * activeTab;
          this.setData({ activeTab: activeTab, stv: stv });
        }
      } else {
        let page = Math.round(offset / windowWidth);
        stv.offset = stv.windowWidth * page;
        this.setData({ activeTab: page, stv: stv });
      }
    } else {
      let page = Math.round(offset / windowWidth);
      stv.offset = stv.windowWidth * page;
      this.setData({ activeTab: page, stv: stv });
    }
  },

  loadMore: function (e) {
    let {isLoading} = this.data;
    if (!isLoading) {
      this.setData({ isLoading: true });
      switch (e.target.dataset.type) {
        case 'moreImg':
          //loadItemsfromLocal(this, 0);
          loadItemsFromNet(this, 0);
          break;

        case 'moreCommon':
          this.setData({ isLoading: true });
          let index = e.target.dataset.index;
          //loadItemsfromLocal(this, index);
          loadItemsFromNet(this, index);
          break;
        default:
          break;
      }
    }

  },

  //img item 跳转
  jump: function (e) {
    if (e.target.dataset.url) {
      wx.navigateTo({ url: `/pages/image/image?url=${e.target.dataset.url}` })
    }
  },
  //回到顶部
  goTop: function (e) {
    let {activeTab, scrolllview} = this.data;
    switch (activeTab) {
      case 0:
        scrolllview.img_top = 0;
        break;
      case 1:
        scrolllview.common_top1 = 0;
        break;
      case 2:
        scrolllview.common_top2 = 0;
        break;
      case 3:
        scrolllview.common_top3 = 0;
        break;
      default:
        break;
    }
    this.setData({ scrolllview: scrolllview });
  },

  //scroll-view bindScroll
  scrolling: function (e) {
    let {showBackTop, activeTab, scrolllview} = this.data;

    if (e.detail.scrollTop >= 500 && showBackTop == true) {
      showBackTop = false;
      this.setData({
        showBackTop: showBackTop
      });
    } else if (e.detail.scrollTop < 500 && showBackTop == false) {
      showBackTop = true;
      this.setData({
        showBackTop: showBackTop
      });
    }

    switch (activeTab) {
      case 0:
        scrolllview.img_top = e.detail.scrollTop;
        break;
      case 1:
        scrolllview.common_top1 = e.detail.scrollTop;
        break;
      case 2:
        scrolllview.common_top2 = e.detail.scrollTop;
        break;
      case 3:
        scrolllview.common_top3 = e.detail.scrollTop;
        break;
      default:
        break;
    }

    this.setData({ scrolllview: scrolllview });
  },

  _updateSelectedPage: function (page) {
    let {stv, activeTab} = this.data;
    activeTab = page;
    stv.offset = stv.windowWidth * activeTab;
    this.setData({ activeTab: activeTab, stv: stv });
  },

  handlerTabTap: function (e) {
    this._updateSelectedPage(e.currentTarget.dataset.index);
  }

})
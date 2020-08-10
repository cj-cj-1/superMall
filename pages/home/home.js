import {
  getMultiData,
  getGoodsData
}from "../../service/home.js"

Page({

  data: {
    banners: [],
    recommends: [],
    titles:["流行", "新款", "精选"],
    goods: {
      "pop": { page: 0, list: []},
      "new": { page: 0, list: [] },
      "sell": { page: 0, list: [] }
    },
    arr: ["pop", "new", "sell"],
    currentType: "pop",
    showBackTop: false,
    isTabFixed: false,
    tabControlTop: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._getMultidata();
    this._getGoodsData("pop");
    this._getGoodsData("new");
    this._getGoodsData("sell");

    
  },

// -------------------网络请求函数---------------------
  _getMultidata(){
    getMultiData().then(res => {
      console.log(res)
      const banners = res.data.data.banner.list;
      const recommends = res.data.data.recommend.list
      this.setData({
        banners: banners,
        recommends: recommends

      })

    })
  },
  _getGoodsData(type) {
    // 设置页码
    const page = this.data.goods[type].page + 1;
    console.log("page",page)
    getGoodsData(type,page).then(res => {
      // 将数据保存到list中
      const list = res.data.data.list;
      // 将数据push到临时的oldList中
      const oldList = this.data.goods[type].list;
      oldList.push(...list);
      // 将数据设置到data的goods中
      const typeKey = `goods.${type}.list`;
      const pageKey = `goods.${type}.page`
      this.setData({
        [typeKey]:oldList,
        [pageKey]:page       
      })
      console.log("datapage",this.data.goods[type].page)

    })
  },
// -------------------自定义函数---------------------
  handleTabClick(even) {
    // console.log(even)
    const index = even.detail.index;
    console.log(index);
    this.setData({
      currentType: this.data.arr[index]
    })
  },

  onReachBottom(){
    this._getGoodsData(this.data.currentType);
  },

  handleImageLoad() {
    wx.createSelectorQuery().select('#tab-control').boundingClientRect((rect) => {
      this.setData({
        tabControlTop: rect.top
      })
    }).exec()
  },

//滚动页面
  onPageScroll(e) {
    // 1.获取滚动的顶部
    const position = e.scrollTop;
    const flag = position >= 1000
    if(flag != this.data.showBackTop){
      this.setData({
        showBackTop: position >= 1000,
      })
    }
    const flag2 = position >=this.data.tabControlTop;
    if(flag2 != this.data.isTabFixed) {
      this.setData({
        isTabFixed: flag2
      })
    }
  }
  })
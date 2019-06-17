// pages/word/index.js
let app = getApp()

const util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ctx:null,
    word:"结果在此",
    points:[],
    canvasWidth:0,
    canvasHeight:0,
    url:"https://aip.baidubce.com/rest/2.0/ocr/v1/handwriting?access_token="
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    let url = this.data.url;
    url += app.globalData.access_token;
    this.setData({url})


    //获取canvas大小
    var query = wx.createSelectorQuery();
    query.select('.gameCanvas')
      .boundingClientRect(rect => {
        this.setData({
          canvasWidth: rect.width,
          canvasHeight: rect.height
        })
      }).exec();

    const ctx = wx.createCanvasContext('wordCanvas')
    ctx.setFillStyle('#fff'); //设置画笔颜色
    ctx.fillRect(0, 0, this.data.canvasWidth, 400);//绘制矩形

    // ctx.setLineCap("round")
    // ctx.setLineJoin("round")
    // ctx.setLineWidth(5)
    ctx.draw(true)

    this.setData({ctx})
  },
  touchstart: function(e){
    let pos = e.touches[0];
    let points = this.data.points;
    points.push(pos);
    this.setData({points})
  },
  touchmove: function(e){
  
    //把移动点保存到数组中
    let pos = e.touches[0];
    let points = this.data.points;
    points.push(pos);

    this.setData({ points})

    let ctx = this.data.ctx;

    // ctx.setLineCap("round")
    // ctx.setLineJoin("round")
    // ctx.setLineWidth(5)

    //从数组中取出最后两个点，绘制连线
    let p1 = points[points.length-1];
    let p2 = points[points.length-2];

    ctx.moveTo(p2.x,p2.y);
    ctx.lineTo(p1.x,p1.y);
    ctx.stroke()
    ctx.draw(true)
  },
  touchend: function(e){
    this.setData({points:[]})
   
  },
  clearCanvas: function(){
    let ctx = this.data.ctx;
    ctx.setFillStyle('#fff'); //设置画笔颜色
    ctx.fillRect(0, 0, this.data.canvasWidth, 400);//绘制矩形
    ctx.draw()
  },
  recWord: function(){
    let canvasWidth = this.data.canvasWidth,
      canvasHeight = this.data.canvasHeight;
    wx.canvasToTempFilePath({     //将canvas生成图片
      canvasId: 'wordCanvas',
      x: 0, //截图canvas左上角横坐标
      y: 0, //截图canvas左上角纵坐标
      width: canvasWidth,     //截取canvas的宽度
      height: canvasHeight,   //截取canvas的高度
      destWidth: canvasWidth,     //目标文件的宽度，即最终生成的图片的宽度
      destHeight: canvasHeight,   //目标文件的高度，即最终生成的图片的高度
      fileType:"jpg",     //生成的图片类型，默认png
      success:  (res)=> {
        let base64 = wx.getFileSystemManager().readFileSync(res.tempFilePath, 'base64')
        this.requestApi(base64);
      }
    })
  },
  requestApi: function(base64){

    wx.showLoading({
      title: '正在识别中...',
    })
    wx.request({
      url: this.data.url,
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: {
        image: base64
      }, success: res => {
        console.log('请求接口成功：',res)
        if (res.statusCode == 200 && res.data.words_result_num >= 1){
          this.setData({
            word: res.data.words_result[0].words
          })
        }else{
          wx.showModal({
            title: '未识别',
            content: '识别不出来，你写的字太丑',
          })
        }
        wx.hideLoading();
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
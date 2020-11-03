<template>
  <div class="MyLine">
    <div :id="MyLineId" class="line" :style="{'height':Height+'px'}">

    </div>
  </div>
</template>

<script>
  let echarts = require('echarts/lib/echarts')
  require('echarts/lib/chart/line')
  require('echarts/lib/chart/bar')
  require('echarts/lib/component/tooltip')
  require('echarts/lib/component/legend')
  require('echarts/lib/component/title')
  require('echarts/lib/component/toolbox')
  export default {
    data () {
      return {
        Line:'',                   //折现图对象
      }
    },
    mounted () {
      this.$nextTick(()=>{
        var newval = this.myData
        newval = [
          {
            name:'实例',
            data:[10,22,34,48,52,67,76]
          },
          {
            name:'模型',
            data:[1,2,3,4,4,4,4]
          },
          {
            name:'实例分析',
            data:[10,30,41,57,72,83,95]
          },
        ]
        var yData = []
        var xData = []
        if(newval.length > 0 ){
          var length = newval.length
          var date = new Date().getTime()
          newval.map((item,index) => {
            yData.push({
              name: item.name,
              type: 'line',
              stack: '总数',
              smooth:true,
              data: item.data
            })
            xData.push(this.formatDate(date - 1000*60*60*24*(length-index-1)))
          })
        }
        this.drawLine(xData,yData)
      })
    },
    props:{
      myData:{
        type:Array,
        required:true
      },
      MyLineId:{
        type:String,
        required:true
      },
      Height:{
        type:Number,
        required:true
      }
    },
    methods: {
      //绘制图表
      drawLine(xData,yData){
        console.log(xData,yData)
        this.Line = echarts.init(document.getElementById(this.MyLineId))
        var _this = this
        window.addEventListener("resize",function () {
          _this.Line.resize();
        })
        this.Line.setOption({
          title: {
            text: ''
          },
          color:['#2db7f5','#ff6600','#808bc6'],
          tooltip: {
            trigger: 'item'   // axis   item   none三个值
          },
          legend: {
            data: $('.MyLine').width()>=400?['CPU', '内存','CPU', '内存','CPU']:[]
          },
          grid: {
            left: '1%',
            right: $('.MyLine').width()>=500?'8%':'10%',
            bottom: $('.MyLine').width()>=500?'5%':'5%',
            containLabel: true
          },
          toolbox: {
            show: true,
            feature: {
              magicType: {//动态类型切换,包括'line'（切换为折线图）, 'bar'（切换为柱状图）, 'stack'（切换为堆叠模式）, 'tiled'（切换为平铺模式）。
                type: ['bar', 'line','stack','tiled'],
              },
              saveAsImage: {//保存图片
                show: true,
              },
            },
            iconStyle:{
              normal:{
                color:'#FFF',//设置颜色
              }
            }
          },
          xAxis: {
            type: 'category',
            name:'日期',
            nameTextStyle:{                  //横轴名字/大小/宽度
              fontWeight:600,
              fontSize:$(window).width>768?16:14,
            },
            nameRotate: $('.MyLine').width()>=500?0:90,                  // 坐标轴名字旋转
            axisLabel: {
              show: true,
              textStyle: {                   //坐标颜色/大小
                fontSize:$(window).width>768?14:10,
                color:'#FFF'
              }
            },                 //X轴坐标样式
            axisLine: {                       //X轴颜色
              lineStyle: {
                color: '#FFF',
              }
            },
            boundaryGap: false,
            data: xData
          },
          yAxis: {                           //Y轴坐标样式
            type: 'value',
            name:'数量',
            nameTextStyle:{                   //纵轴名字/大小/宽度
              fontWeight:500,
              fontSize:$(window).width>768?16:14
            },
            axisLabel: {
              show: true,
              textStyle: {                   //坐标颜色/大小
                fontSize:$(window).width>768?14:10,
                color:'#FFF'
              }
            },
            axisLine: {                       //Y轴颜色
              lineStyle: {
                color: '#FFF',
              }
            },
          },
          series: yData
        })
      },
      //获取规定格式的日期
      formatDate(time){
        var date = new Date(time)
        var month = date.getMonth()+1
        var day = date.getDate()
        if(month < 10){
          month = '0' + month
        }
        if(day < 10){
          day = '0' + day
        }
        return month + '-' + day
      },
    },
    watch:{
      myData:{
        deep:true,
        handler(newval,oldval){
          newval = [
            {
              name:'实例',
              data:[1,3,5,7,8,9,10]
            },
            {
              name:'模型',
              data:[1,2,3,4,5,6,7]
            },
            {
              name:'实例分析',
              data:[1,3,4,5,7,8,9]
            },
          ]
          var yData = []
          var xData = []
          if(newval.length > 0 ){
            var length = newval.length
            var date = new Date().getTime()
            newval.map((item,index) => {
              yData.push({
                name: item.name,
                type: 'line',
                stack: '总数',
                smooth:true,
                data: item.data
              })
              xData.push(this.formatDate(date - 1000*60*60*24*(length-index-1)))
            })
          }
          this.drawLine(xData,yData)
        }
      }
    }
  }
</script>

<style lang="less">
  .MyLine{
    height: 100%;
    width: 100%;
    .line{
      height: 340px;
      overflow: hidden;
    }
  }
  @media screen and(max-width: 767px){
    .MyLine{
      .line{
        height: 320px;
        overflow: hidden;
      }
    }
  }
</style>

<template>
  <div class="MyLine">
    <div :id="MyLineId" class="line">

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
  require('echarts/lib/component/dataZoom')
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
        var newData = []
        if(newval.y && newval.y.length > 0 ){
          newval.y.map(item => {
            newData.push({
              name: newval.yNameData[newval.y.indexOf(item)],
              type: 'line',
              stack: '',
              smooth:true,
              data: item
            })
          })
        }
        if(newval.x && newval.x[0].length > 30){
          var startLength = 100 - (30/newval.x[0].length*100)
          var dataZoom = [
            {
              show: true,
              realtime: true,
              start: startLength,
              end:100,
              filterMode: 'empty'
            },
            {
              type: 'inside',
              realtime: true,
              start: startLength,
              end:100,
              filterMode: 'empty'
            }
          ]
        }else{
          var dataZoom = []
        }
        this.drawLine(newval,newData,dataZoom)
      })
    },
    props:{
      MyLineId:{
        type:String,
        required:true
      },
      myData:{
        type:Object,
        required:true
      },
    },
    methods: {
      //绘制图表
      drawLine(myData,newData,dataZoom){
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
            trigger: 'item',   // axis   item   none三个值
            formatter: (params) => {
              let tip = params.seriesName + '：' +'<br>'+params.value+'%<br>'
              return tip
            }
          },
          legend: {
            data: $('.MyLine').width()>=400?myData.yNameData:[]
          },
          dataZoom: dataZoom,
          grid: {
            left: '1%',
            right: $('.MyLine').width()>=500?'6%':'10%',
            bottom: $('.MyLine').width()>=500?'6%':'10%',
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
            name:'时间',
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
              },
              symbol: ['none', 'arrow'],      // 是否显示轴线箭头
              symbolSize: [8, 8],             // 箭头大小
              symbolOffset: [0, 7],           // 箭头位置
            },
            boundaryGap: false,
            data: myData.x[0]
          },
          yAxis: {                            //Y轴坐标样式
            type: 'value',
            name:'利用率',
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
              },
              symbol: ['none', 'arrow'],      // 是否显示轴线箭头
              symbolSize: [8, 8],             // 箭头大小
              symbolOffset: [0, 10],          // 箭头位置
            },
          },
          series: newData
        })
      }
    },
    watch:{
      myData:{
        deep:true,
        handler(newval,oldval){
          var newData = []
          if(newval.y){
            newval.y.map(item => {
              newData.push({
                name: newval.yNameData[newval.y.indexOf(item)],
                type: 'line',
                stack: '',
                smooth:true,
                data: item
              })
            })
          }
          if(newval.x && newval.x.length > 30){
            var startLength = 100 - (30/newval.x[0].length*100)
            var dataZoom = [
              {
                show: true,
                realtime: true,
                start: startLength,
                end:100,
                filterMode: 'empty'
              },
              {
                type: 'inside',
                realtime: true,
                start: startLength,
                end:100,
                filterMode: 'empty'
              }
            ]
          }else{
            var dataZoom = []
          }
          this.drawLine(newval,newData,dataZoom)
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

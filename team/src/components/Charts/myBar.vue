<template>
  <div class="MyBar">
    <div :id="MyBarId" class="bar" :style="{'height':Height+'px'}">

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
        Bar:'',                   //柱形图对象
      }
    },
    mounted () {
      this.$nextTick(()=>{
        var newval = this.myData
        newval = [
          {
            name:'实例',
            data:[52051,55000,77000,50000,87000,50000,82000]
          },
          {
            name:'模型',
            data:[8001,11000,13000,15000,17000,20000,22000]
          },
          {
            name:'实例分析',
            data:[80000,100000,110000,130000,150000,170000,200000]
          },
        ]
        var xData = []
        var yData = []
        if(newval.length > 0 ){
          var date = new Date().getTime()
          var length = newval.length
          newval.map((item,index) => {
            yData.push({
                name: item.name,           // 序列名称
                type: 'bar',            // 类型
                legendHoverLink: true,  // 是否启用图列 hover 时的联动高亮
                label: {                // 图形上的文本标签
                  show: false,
                  position: 'insideTop',// 相对位置
                  rotate: 0,            // 旋转角度
                  color: '#eee'
                },
                barWidth: $('.MyBar').width()>768?40:($('.MyBar').width()>=500?20:15),           // 柱形的宽度
                barCategoryGap: '20%',  // 柱形的间距
                data: item.data
              })
            xData.push(this.formatDate(date - 1000*60*60*24*(length-index-1)))
          })
        }
        this.drawBar(xData,yData)
      })
    },
    props:{
      myData:{
        type:Array,
        required:true
      },
      MyBarId:{
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
      drawBar(xData,yData){
        this.Bar = echarts.init(document.getElementById(this.MyBarId))
        var _this = this
        window.addEventListener("resize",function () {
          _this.Bar.resize();
        })
        this.Bar.setOption({
          //颜色
          color:['#91C7AE','#C23531','#2F4554','#61A0A8','#D48265','#2DB7F5','#FF6600'],
          // ----  标题 -----
          title: {
            text: '',
            textStyle: {
              color: '#fff'
            },
            subtext: '',
            subtextStyle: {
              color: '#eee'
            },
          },
          // ---- legend ----
          legend: {
            type: 'plain',    // 图列类型，默认为 'plain'
            top: '1%',        // 图列相对容器的位置 top\bottom\left\right
            tooltip: {        // 图列提示框，默认不显示
              show: true,
              color: '#fff'
            },
            data: xData
          },
          // ---  提示框 ----
          tooltip: {
            show: true,        // 是否显示提示框，默认为true
            trigger: 'item',   // 数据项图形触发
            axisPointer: {     // 指示样式
              type: 'shadow',
              axis: 'auto'
            },
            padding: 5,
            textStyle: {       // 提示框内容的样式
              color: '#fff'
            }
          },
          //  ------  X轴 ------
          xAxis: {
            show: true,           // 是否显示
            type: 'category',     // 轴类型， 默认为 'category'
            name: '日期',         // 轴名称
            nameLocation: 'end',  // 轴名称相对位置
            nameTextStyle: {      // 坐标轴名称样式
              color: 'white',
            },
            nameRotate: $('.MyBar').width()>=500?0:90,        // 坐标轴名字旋转
            nameGap: 15,          // 坐标轴名称与轴线之间的距离
            axisLine: {           // 坐标轴 轴线
              show: true,         // 是否显示
              symbol: ['none', 'arrow'],  // 是否显示轴线箭头
              symbolSize: [8, 8],         // 箭头大小
              symbolOffset: [0, 7],       // 箭头位置
              // ------   线 ---------
              lineStyle: {
                color: '#fff',
                width: 1,
                type: 'solid'
              }
            },
            axisTick: {           // 坐标轴 刻度
              show: true,         // 是否显示
              inside: true,       // 是否朝内
              length: 3,          // 长度
              lineStyle: {        // 默认取轴线的样式
                color: 'red',
                width: 1,
                type: 'solid'
              }
            },
            axisLabel: {           // 坐标轴标签
              show: true,          // 是否显示
              inside: false,       // 是否朝内
              rotate: 0,           // 旋转角度
              margin: 5,           // 刻度标签与轴线之间的距离
              color: '#fff'        // 默认取轴线的颜色
            },
            data: xData
          },
          //   ------   y轴  ----------
          yAxis: {
            show: true,          // 是否显示
            position: 'left',    // y轴位置
            offset: 0,           // y轴相对于默认位置的偏移
            type: 'value',       // 轴类型，默认为 ‘category’
            name: '数量',        // 轴名称
            nameLocation: 'end', // 轴名称相对位置value
            nameTextStyle: {    // 坐标轴名称样式
              color: '#fff',
              padding: [5, 0, 0, 5]  // 坐标轴名称相对位置
            },
            nameGap: 15,         // 坐标轴名称与轴线之间的距离
            nameRotate: 0,       // 坐标轴名字旋转

            axisLine: {    // 坐标轴 轴线
              show: true,  // 是否显示
              //  -----   箭头 -----
              symbol: ['none', 'arrow'],  // 是否显示轴线箭头
              symbolSize: [8, 8],  // 箭头大小
              symbolOffset: [0, 7], // 箭头位置

              // ----- 线 -------
              lineStyle: {
                color: '#fff',
                width: 1,
                type: 'solid'
              }
            },
            axisTick: {      // 坐标轴的刻度
              show: true,    // 是否显示
              inside: true,  // 是否朝内
              length: 3,      // 长度
              lineStyle: {
                color: 'red',  // 默认取轴线的颜色
                width: 1,
                type: 'solid'
              }
            },
            axisLabel: {      // 坐标轴的标签
              show: true,    // 是否显示
              inside: false,  // 是否朝内
              rotate: 0,     // 旋转角度
              margin: 8,     // 刻度标签与轴线之间的距离
              color: '#fff',  // 默认轴线的颜色
            },
            splitLine: {    // gird 区域中的分割线
              show: true,   // 是否显示
              lineStyle: {
                color: '#666',
                width: 1,
                type: 'dashed'
              }
            },
          },
          grid: {
            left: '1%',
            right: $('.MyBar').width()>768?'5%':'10%',
            bottom: '2%',
            containLabel: true,
          },
          //  -------   内容数据 -------
          series: yData
        });
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
      myData(newval,oldval){
        newval = [
          {
            name:'实例',
            data:[10,11,13,15,17,20,22]
          },
          {
            name:'模型',
            data:[1,2,3,4,5,6,7]
          },
          {
            name:'实例分析',
            data:[8,10,11,13,15,17,20]
          },
        ]
        var xData = []
        var yData = []
        if(newval.length > 0 ){
          var length = newval.length
          var date = new Date().getTime()
          newval.map((item,index) => {
            yData.push({
              name: item.name,           // 序列名称
              type: 'bar',            // 类型
              legendHoverLink: true,  // 是否启用图列 hover 时的联动高亮
              label: {                // 图形上的文本标签
                show: false,
                position: 'insideTop',// 相对位置
                rotate: 0,            // 旋转角度
                color: '#eee'
              },
              barWidth: $('.MyBar').width()>768?40:($('.MyBar').width()>=500?20:15),           // 柱形的宽度
              barCategoryGap: '20%',  // 柱形的间距
              data: item.data
            })
            xData.push(this.formatDate(date - 1000*60*60*24*(length-index-1)))
          })
        }
        this.drawPie(xData,yData)
      }
    }
  }
</script>

<style lang="less">
  .MyBar{
    height: 100%;
    width: 100%;
    .bar{
      height: 340px;
      overflow: hidden;
    }
  }
  @media screen and(max-width: 767px){
    .MyBar{
      .bar{
        height: 320px;
        overflow: hidden;
      }
    }
  }
</style>

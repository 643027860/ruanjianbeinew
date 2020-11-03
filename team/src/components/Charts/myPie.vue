<template>
  <div class="myPie">
    <div :id="MyPieId" class="pie" :style="{'height':Height+'px'}">

    </div>
  </div>
</template>

<script>
  let echarts = require('echarts/lib/echarts')
  require('echarts/lib/chart/pie')
  require('echarts/lib/component/tooltip')
  require('echarts/lib/component/legend')
  require('echarts/lib/component/title')
  require('echarts/lib/component/toolbox')
  export default {
    data () {
      return {
        Pie:'',                   //饼图对象
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
        var xData = []
        var yData = []
        if(newval.length > 0 ){
          newval.map((item,index) => {
            xData.push(item.name)
            yData.push({
              name: item.name,
              value: item.data[item.data.length-1]*1,
            })
          })
        }
        this.drawPie(xData,yData)
      })
    },
    props:{
      myData:{
        type:Array,
        required:true
      },
      MyPieId:{
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
      drawPie(xData,yData){
        this.Pie = echarts.init(document.getElementById(this.MyPieId))
        window.addEventListener("resize",()=>{
          this.Pie.resize();
        })
        this.Pie.setOption({
          //标题设置
          title: {
            text: '',
            subtext: '',
            // x 设置水平安放位置，默认左对齐，可选值：'center' ¦ 'left' ¦ 'right' ¦ {number}（x坐标，单位px）
            x: 'center',
            // y 设置垂直安放位置，默认全图顶端，可选值：'top' ¦ 'bottom' ¦ 'center' ¦ {number}（y坐标，单位px）
            y: 'top',
            // itemGap设置主副标题纵向间隔，单位px，默认为10，
            itemGap: 10,
            // 副标题文本样式设置
            subtextStyle: {
              fontSize: 14,
              color: '#8B2323'
            }
          },
          tooltip: {
            trigger: 'item',
            showDelay: 20,   // 显示延迟，添加显示延迟可以避免频繁切换，单位ms
            hideDelay: 20,   // 隐藏延迟，单位ms
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            // orient 设置布局方式，默认水平布局，可选值：'horizontal'（水平） ¦ 'vertical'（垂直）
            orient: 'vertical',
            // x 设置水平安放位置，默认全图居中，可选值：'center' ¦ 'left' ¦ 'right' ¦ {number}（x坐标，单位px）
            x: '70%',
            // y 设置垂直安放位置，默认全图顶端，可选值：'top' ¦ 'bottom' ¦ 'center' ¦ {number}（y坐标，单位px）
            y: '22%',
            itemWidth: 25,   // 设置图例图形的宽
            itemHeight: 18,  // 设置图例图形的高
            textStyle: {
              color: '#eee'  // 图例文字颜色
            },
            // itemGap设置各个item之间的间隔，单位px，默认为10，横向布局时为水平间隔，纵向布局时为纵向间隔
            itemGap: 20,
            //backgroundColor: '#eee',  // 设置整个图例区域背景颜色
            data: xData,
          },
          series: [
            {
              name: '数量',
              type: 'pie',
              // radius: '50%',  // 设置饼状图大小，100%时，最大直径=整个图形的min(宽，高)
              radius: ['30%', '60%'],  // 设置环形饼状图， 第一个百分数设置内圈大小，第二个百分数设置外圈大小
              center: [$('.myPie').width()>=400?'40%':'45%', '50%'],  // 设置饼状图位置，第一个百分数调水平位置，第二个百分数调垂直位置
              data: yData,
              // itemStyle 设置饼状图扇形区域样式
              itemStyle: {
                // emphasis：英文意思是 强调;着重;（轮廓、图形等的）鲜明;突出，重读
                // emphasis：设置鼠标放到哪一块扇形上面的时候，扇形样式、阴影
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(30, 144, 255，0.5)'
                }
              },
              // 设置值域的那指向线
              labelLine: {
                normal: {
                  show: false   // show设置线是否显示，默认为true，可选值：true ¦ false
                }
              },
              // 设置值域的标签
              label: {
                normal: {
                  position: 'inner',  // 设置标签位置，默认在饼状图外 可选值：'outer' ¦ 'inner（饼状图上）'
                  // formatter: '{a} {b} : {c}个 ({d}%)'   设置标签显示内容 ，默认显示{b}
                  // {a}指series.name  {b}指series.data的name
                  // {c}指series.data的value  {d}%指这一部分占总数的百分比
                  formatter: '{c}'
                }
              }
            }
          ]
        })
      }
    },
    watch:{
      myData(newval,oldval){
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
        var xData = []
        var yData = []
        if(newval.length > 0 ){
          newval.map((item,index) => {
            xData.push(item.name)
            yData.push({
              name: item.name,
              value: item.data[item.data.length-1]*1,
            })
          })
        }
        this.drawPie(xData,yData)
      }
    }
  }
</script>

<style lang="less">
  .myPie{
    height: 100%;
    width: 100%;
    .pie{
      height: 340px;
      overflow: hidden;
    }
  }
  @media screen and(max-width: 767px){
    .myPie{
      .pie{
        height: 320px;
        overflow: hidden;
      }
    }
  }
</style>

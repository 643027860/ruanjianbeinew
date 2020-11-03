<template>
  <div class="myPie">
    <div :id="myPieId" class="pie">

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
        var newData = []
        if(newval.y){
          newval.y.map(item => {
            newData.push({
              name: newval.yNameData[newval.y.indexOf(item)],
              value:item.length,
            })
          })
        }
        this.drawPie(newval,newData)
      })
    },
    props:{
      myPieId:{
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
      drawPie(myData,newData){
        this.Pie = echarts.init(document.getElementById(this.myPieId))
        window.addEventListener("resize",()=>{
          this.Pie.resize();
        })
        this.Pie.setOption({
          color:['#61A0A8','#D48265','#2DB7F5','#FF6600','#91C7AE','#C23531','#2F4554'],
          //标题设置
          title: {
            text: '就业方向',
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
            x: 'right',
            // y 设置垂直安放位置，默认全图顶端，可选值：'top' ¦ 'bottom' ¦ 'center' ¦ {number}（y坐标，单位px）
            y: 'center',
            itemWidth: 25,   // 设置图例图形的宽
            itemHeight: 18,  // 设置图例图形的高
            textStyle: {
              color: '#eee'  // 图例文字颜色
            },
            // itemGap设置各个item之间的间隔，单位px，默认为10，横向布局时为水平间隔，纵向布局时为纵向间隔
            itemGap: 30,
            //backgroundColor: '#eee',  // 设置整个图例区域背景颜色
            data: myData.yNameData,
          },
          series: [
            {
              name: '数据',
              type: 'pie',
              // radius: '50%',  // 设置饼状图大小，100%时，最大直径=整个图形的min(宽，高)
              radius: ['30%', '60%'],  // 设置环形饼状图， 第一个百分数设置内圈大小，第二个百分数设置外圈大小
              center: [$('.myPie').width()>=400?'50%':'35%', '50%'],  // 设置饼状图位置，第一个百分数调水平位置，第二个百分数调垂直位置
              data: newData,
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
      myData:{
        deep:true,
        handler(newval,oldval){
          var newData = []
          if(newval.y){
            newval.y.map(item => {
              newData.push({
                name: newval.yNameData[newval.y.indexOf(item)],
                value:item.length,
              })
            })
          }
          this.drawPie(newval,newData)
        }
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

<template>
  <div class="myMainPage">
    <div class="headDiv">
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
          <div class="titleDiv">
            <span class="secIcon">
              <i class="el-icon-user-solid"></i>
            </span>
            <div class="titleRight">
              <h4>当日登录</h4>
              <h3>+20</h3>
            </div>
            <p class="secP">
              昨日登陆10次
              <span style="color:greenyellow" v-if="true">
                较昨日
                <i class="el-icon-top"></i>
              </span>
              <span style="color:rgb(234,196,130)" v-if="false">
                较昨日
                <i class="el-icon-minus"></i>
              </span>
            </p>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
          <div class="titleDiv">
            <span class="secIcon">
              <i class="el-icon-s-data"></i>
            </span>
            <div class="titleRight">
              <h4>数据实例</h4>
              <h3>+20</h3>
            </div>
            <p class="secP">
              共50个数据实例
              <span style="color:greenyellow" v-if="true">
                较昨日
                <i class="el-icon-top"></i>
              </span>
              <span style="color:rgb(234,196,130)" v-if="false">
                较昨日
                <i class="el-icon-minus"></i>
              </span>
            </p>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
          <div class="titleDiv">
            <span class="secIcon">
              <i class="el-icon-s-grid"></i>
            </span>
            <div class="titleRight">
              <h4>数据模型</h4>
              <h3>+20</h3>
            </div>
            <p class="secP">
              当共50个数据模型
              <span style="color:greenyellow" v-if="true">
                较昨日
                <i class="el-icon-top"></i>
              </span>
              <span style="color:rgb(234,196,130)" v-if="false">
                较昨日
                <i class="el-icon-minus"></i>
              </span>
            </p>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
          <div class="titleDiv">
            <span class="secIcon">
              <i class="el-icon-tickets"></i>
            </span>
            <div class="titleRight">
              <h4>实例分析</h4>
              <h3>+20</h3>
            </div>
            <p class="secP">
              共50个实例分析
              <span style="color:greenyellow" v-if="true">
                较昨日
                <i class="el-icon-top"></i>
              </span>
              <span style="color:rgb(234,196,130)" v-if="false">
                较昨日
                <i class="el-icon-minus"></i>
              </span>
            </p>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="bodyDiv">
      <el-row :gutter="20">
        <el-col :xs="24" :sm="24" :md="12" :lg="14" :xl="14">
          <div class="contentDiv">
            <div class="title">
              <p>近5天实例、模型、数据分析三者的数量变化</p>
            </div>
            <div class="content">
              <MyLine MyLineId="MyLineId" :Height="280" :myData="[]"></MyLine>
            </div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="10" :xl="10">
          <div class="contentDiv">
            <div class="title">
              <p>实例、模型、数据分析总数</p>
            </div>
            <div class="content">
              <myPie MyPieId="MyPieId" :Height="280" :myData="[]"></myPie>
            </div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <div class="contentDiv contentDiv1">
            <div class="title">
              <p>近10天数据处理量</p>
            </div>
            <div class="content">
              <myBar MyBarId="MyBarId" :Height="295" :myData="[]"></myBar>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import MyLine from '../../../components/Charts/myLine'
  import MyPie from '../../../components/Charts/myPie'
  import MyBar from '../../../components/Charts/myBar'
  import {REQDYNAMIC} from '../../../api/types'
  import {mapState,mapActions} from 'vuex'
  export default {
    components:{
      MyLine,MyPie,MyBar
    },
    data () {
      return {

      }
    },
    methods: {
      ...mapActions(['choiceMenuId']),

      //处理日期
      getDate(){
        var date = new Date()
        var year = date.getFullYear()
        var month = date.getMonth()
        var day = date.getDate()
        if(month < 9){
          month = '0' + month
        }
        if(day < 9){
          day = '0' + day
        }
        var date = year + '-' + month + '-' + day
        var time = new Date(year + '/' + month + '/' + day).getTime()
        return {
          date,
          time
        }
      }
    },
    watch: {},
    computed: {},
    created () {},
    mounted () {
      this.choiceMenuId('mainPage')
    },
  }
</script>

<style lang="less">
  .myMainPage{
    .headDiv{
      .titleDiv{
        padding: 20px;
        margin-bottom: 20px;
        background-color: rgba(0,0,0,0.2);
        .secIcon{
          display: inline-block;
          height: 50px;
          width: 50px;
          color: #36a2f5;
          font-size: 26px;
          border: 1px solid #36a2f5;
          text-align: center;
          line-height: 50px;
          border-radius: 100px;
          i{
            display: inline-block;
            font: normal normal normal 14px/1 FontAwesome;
            font-size: inherit;
            text-rendering: auto;
            -webkit-font-smoothing: antialiased;
          }
        }
        .titleRight{
          float: right;
          h4{
            margin: 0 0 9px;
            font-size: 18px;
            color: #f2f2f2;
            font-weight: 400;
          }
          h3{
            margin: 0px;
            font-size: 22px;
            font-weight: 500;
          }
        }
        .secP{
          margin-top: 20px;
          margin-bottom: 0px;
          padding-top: 15px;
          color: #f2f2f2;
          font-size: 14px;
          border-top: 1px solid #f2f2f2;
          span{
            float: right;
            font-size: 14px;
            font-weight: 500;
            i{
              padding-left: 5px;
            }
          }
        }
      }
    }
    .bodyDiv{
      min-height: calc(100vh - 270px);
      .contentDiv{
        margin-bottom: 20px;
        background-color: rgba(0,0,0,0.2);
        .title{
          padding: 10px 16px 0;
          p{
            margin: 0;
            padding-bottom: 10px;
            font-size: 16px;
            line-height: 30px;
            border-bottom: 1px solid #f2f2f2;
          }
        }
        .content{
          height: 280px;
        }
      }
      .contentDiv1{
        margin-bottom: 0px!important;
        .content{
          height: 295px!important;
        }
      }
    }
  }
  @media screen and(max-width: 767px){
    .myMainPage{
      .headDiv{
        .titleDiv{
          padding: 15px;
          margin-bottom: 10px;
        }
      }
      .bodyDiv{
        .contentDiv{
          padding: 15px;
          margin-bottom: 10px;
        }
      }
    }
  }
</style>



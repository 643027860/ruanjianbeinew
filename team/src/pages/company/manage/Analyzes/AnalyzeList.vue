<template>
  <div class="manageAnalyzeList">
    <div class="headerSearchDiv">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="">
         <span style="font-size: 16px;margin-right: 20px;">数据分析列表：</span>
        </el-form-item>
        <el-form-item style="float: right;" class="pc">
          <el-button type="primary" icon="el-icon-plus" @click="toUploadAnalyze">数据分析</el-button>
        </el-form-item>
        <el-form-item style="float: right;" class="mobile">
          <el-button type="primary" icon="el-icon-plus" @click="toUploadAnalyze">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="manageContentDiv">
      <el-table
        v-loading="loading"
        element-loading-text="数据加载中"
        element-loading-spinner="el-icon-loading"
        :data="analyzeList.analyzeListVOS"
        empty-text="暂无数据分析"
        class="my-table">
        <el-table-column
          prop="aeName"
          label="分析名称"
          min-width="180">
        </el-table-column>
        <el-table-column
          prop="mlName"
          label="模型名称"
          min-width="180">
        </el-table-column>
        <el-table-column
          prop="quName"
          label="实例名称"
          min-width="180">
        </el-table-column>
        <el-table-column
          prop="aeResult"
          label="分析结果"
          min-width="200">
        </el-table-column>
        <el-table-column
          label="分析时间"
          min-width="180">
          <template slot-scope="scope">
            {{formatTime(scope.row.aeTime)}}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="150">
          <template slot-scope="scope">
            <el-button type="success" size="mini" @click="seeDetail(scope.row.aeId)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pages" v-if="analyzeList.total>0">
        <div class="block">
          <el-pagination
            layout="prev, pager, next"
            :total="analyzeList.total*1"
            :current-page="pageNum*1"
            :page-size="pageSize*1"
            @current-change="(currentPage)=>reqAnalyzes(currentPage)"
          >
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {REQALLANALYZE,UPDATEANALYZE} from '../../../../api/types'
  import {mapState,mapActions} from 'vuex'
  export default {
    name: 'manageModelList',
    data () {
      return {
        pageNum:1,
        pageSize:13,
        showFlag:1,        //是否可见标志，1为显示，0为不显示

        analyzeList:[],    //模型分析列表

        loading:false,  //加载中
      }
    },
    methods: {
      ...mapActions(['choiceMenuId']),

      //获取大数据分析列表
      async reqAnalyzes(num){
        if(num){
          this.pageNum = num
        }
        var {pageNum,pageSize,showFlag} = this
        this.loading = true
        var result = await REQALLANALYZE({pageNum,pageSize},showFlag)
        this.loading = false
        if(result && result.status === 0){
          this.analyzeList = result.data
        }else{
          if(result.msg){
            var message = result.msg
          }else{
            var message = '获取数据分析列表失败'
          }
          this.message(message,'error',1500)
        }
      },

      //查看详情
      seeDetail(aeId){
        var {showFlag} = this
        this.$router.push({name:'AnalyzeDetail',query:{aeId,showFlag}})
      },
      //前往上传数据分析
      toUploadAnalyze(){
        this.$router.push({name:'UploadExample'})
      },

      //返回规定格式的时间
      formatTime(time){
        return time.slice(0,10) + '    '+ time.slice(11,19)
      },
      //消息提示
      message(message,type,duration){
        this.$message({
          message,type,duration
        })
      }
    },
    mounted () {
      this.choiceMenuId('AnalyzeList')
      this.reqAnalyzes()
    },
  }
</script>

<style lang="less">
  @import "../../../../assets/css/table/table";
  @import "../../../../assets/css/input/input";
  .manageAnalyzeList{
    background-color: transparent;
    .headerSearchDiv{
      background-color: rgba(0,0,0,0.25);
      margin-bottom: 20px;
      padding: 10px 20px;
      .el-form{
        .el-form-item{
          margin: 0;
          margin-right: 10px;
        }
      }
      button{
        margin-right: 10px;
        padding: 10px 15px;
      }
    }
    button{
      outline: 0;
    }
    .manageContentDiv{
      position: relative;
      min-height: calc(100vh - 181px);
      .el-table{
        padding-bottom: 50px;
        min-height: calc(100vh - 181px);
      }
      .pages{
        position: absolute;
        bottom: 10px;
        left: 50%;
        transform: translate3d(-50%,0,0);
        li,button{
          background-color: transparent;
        }
        .btn-next,.btn-prev{
          color: white;
        }
        .el-pagination{
          color: rgb(233,233,233);
        }
      }
    }
  }
</style>

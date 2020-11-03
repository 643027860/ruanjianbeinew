<template>
  <div class="manageExampleList">
    <div class="headerSearchDiv">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="">
          <span style="font-size: 16px;margin-right: 20px;">数据实例列表：</span>
        </el-form-item>
        <el-form-item style="float: right;" class="pc">
          <el-button type="primary" icon="el-icon-plus" @click="toUploadExample">新增实例</el-button>
        </el-form-item>
        <el-form-item style="float: right;" class="mobile">
          <el-button type="primary" icon="el-icon-plus" @click="toUploadExample">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="manageContentDiv">
      <el-table
        v-loading="loading"
        element-loading-text="数据加载中"
        element-loading-spinner="el-icon-loading"
        :data="quList.queryListVOS"
        class="my-table">
        <el-table-column
          prop="quName"
          label="实例名称"
          min-width="200">
        </el-table-column>
        <el-table-column
          prop="quTime"
          label="上传时间"
          min-width="160">
        </el-table-column>
        <el-table-column
          label="操作"
          width="160">
          <template slot-scope="scope">
            <el-button type="success" size="mini" @click="seeDetail(scope.row.quId)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pages" v-if="quList.total>0">
        <div class="block">
          <el-pagination
            layout="prev, pager, next"
            :total="quList.total*1"
            :current-page="pageNum*1"
            :page-size="pageSize*1"
            @current-change="(currentPage)=>reqQus(currentPage)"
          >
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {REQAllINTER} from '../../../../api/types'
  import {mapState,mapActions} from 'vuex'
  export default {
    name: 'manageModelList',
    data () {
      return {
        pageNum: 1,
        pageSize: 13,
        showFlag:1,   //是否可见标志，1为显示，0为不显示

        qu:{},        //单一模型的详细信息
        quList:[],    //模型数据列表

        loading:false,  //加载中
      }
    },
    methods: {
      ...mapActions(['choiceMenuId']),

      //获取数据实例列表,传入num的话就请求num页数据，否则请求第一页数据
      async reqQus(num){
        this.pageNum = num || 1
        var {pageNum,pageSize,showFlag} = this
        this.loading = true
        var result = await REQAllINTER({pageNum,pageSize,showFlag})
        this.loading = false
        if(result && result.status === 0){
          this.quList = result.data
          this.showFlag = showFlag
        }else{
          if(result.msg){
            var message = result.msg
          }else{
            var message = '获取数据实例失败'
          }
          this.message(message,'error',1500)
        }
      },

      //查看详情
      seeDetail(quId){
        var {showFlag} = this
        this.$router.push({name:'ExampleDetail',query:{quId,showFlag}})
      },
      //前往上传实例
      toUploadExample(){
        this.$router.push({name:'UploadExample'})
      },

      //消息提示
      message(message,type,duration){
        this.$message({
          message,type,duration
        })
      }
    },
    mounted () {
      this.choiceMenuId('ExampleList')
      this.reqQus()
    },
  }
</script>

<style lang="less">
  @import "../../../../assets/css/table/table";
  @import "../../../../assets/css/input/input";
  .manageExampleList{
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

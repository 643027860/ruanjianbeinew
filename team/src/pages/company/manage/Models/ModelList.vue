<template>
  <div class="manageModelList">
    <div class="headerSearchDiv">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="">
          <span style="font-size: 16px;margin-right: 0px;">数据模型列表：</span>
        </el-form-item>
        <div class="searchDiv">
          <el-form-item label="算法">
            <el-select v-model="searchForm.mlAlgo" placeholder="">
              <el-option label="Python" value="Python"></el-option>
              <el-option label="R" value="R"></el-option>
              <el-option label="不限" value=""></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否可见">
            <el-select v-model="searchForm.showFlag" placeholder="">
              <el-option label="可见" :value="1"></el-option>
              <el-option label="不可见" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" style="float: right;" @click="reqModels(1)">查询</el-button>
          </el-form-item>
        </div>
      </el-form>
      <el-button type="primary" class="uploadButton pc" icon="el-icon-plus" @click="toUploadModel">新增模型</el-button>
      <el-button type="primary" class="uploadButton mobile" icon="el-icon-plus" @click="toUploadModel">新增</el-button>
    </div>
    <div class="manageContentDiv">
      <el-table
        v-loading="loading"
        element-loading-text="数据加载中"
        element-loading-spinner="el-icon-loading"
        :data="modelList.modelListVOS"
        class="my-table">
        <el-table-column
          prop="mlName"
          label="模型名"
          min-width="200">
        </el-table-column>
        <el-table-column
          prop="mlIntro"
          label="模型介绍"
          min-width="240">
        </el-table-column>
        <el-table-column
          prop="mlAlgo"
          label="模型算法"
          min-width="140">
        </el-table-column>
        <el-table-column
          prop="mlResult"
          label="模型功能"
          min-width="200">
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="200">
          <template slot-scope="scope">
            <el-button type="success" size="mini" @click="seeDetail(scope.row.mlId)">查看详情</el-button>
            <el-button type="danger" size="mini" v-if="showFlag === 1" @click="changeModel(scope.row.mlId,0)">删除</el-button>
            <el-button type="primary" size="mini" v-if="showFlag === 0" @click="changeModel(scope.row.mlId,1)">恢复</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pages" v-if="modelList.total>0">
        <div class="block">
          <el-pagination
            layout="prev, pager, next"
            :total="modelList.total*1"
            :current-page="pageNum*1"
            :page-size="pageSize*1"
            @current-change="(currentPage)=>reqModels(currentPage)"
          >
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {REQALLMODEL,REQONEMODEL,REQONEMODELDETAIL,UPDATEONEMODEL} from '../../../../api/types'
  import {REQALLMODELBYALGO} from '../../../../api/types'
  import {mapState,mapActions} from 'vuex'
  export default {
    name: 'manageModelList',
    data () {
      return {
        pageNum: 1,
        pageSize: 13,
        showFlag:1,    //是否可见标志，1为显示，0为不显示

        model:{},        //单一模型的详细信息
        modelCanShu:[],  //单一模型的参数
        modelList:[],    //模型数据列表

        searchForm:{
          mlAlgo:'',     //模型算法
          showFlag:1,    //是否可见标志，1为显示，0为不显示
        },

        loading:false,  //加载中
      }
    },
    methods: {
      ...mapActions(['choiceMenuId']),

      //获取大数据模型列表,传入num的话就请求num页数据，否则请求第一页数据
      async reqModels(num){
        this.pageNum = num || 1
        var {pageNum,pageSize,searchForm} = this
        var {showFlag,mlAlgo} = searchForm
        this.loading = true
        if(mlAlgo.trim()){
          var result = await REQALLMODELBYALGO({pageNum,pageSize,showFlag},mlAlgo)
        }else{
          var result = await REQALLMODEL({pageNum,pageSize,showFlag})
        }
        this.loading = false
        if(result && result.status === 0){
          this.modelList = result.data
          this.showFlag = showFlag
        }else{
          if(result.msg){
            var message = result.msg
          }else{
            var message = '获取数据模型失败'
          }
          this.message(message,'error',1500)
        }
      },

      //查看详情
      seeDetail(mlId){
        var {showFlag} = this
        this.$router.push({name:'ModelDetail',query:{mlId,showFlag}})
      },
      //前往上传模型
      toUploadModel(){
        this.$router.push({name:'UploadModel'})
      },

      //修改大数据模型,showFlag为0时，删除该模型；为1时，恢复该模型。
      changeModel(mlId,showFlag = 1){
        this.$confirm(`确定${showFlag?'恢复':'删除'}该模型吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          this.loading = true
          var result = await REQONEMODEL(mlId)
          this.loading = false
          if(result && result.status === 0){
            var {mlAlgo,mlIntro,mlName,mlResult,modelSmallVOS} = result.data
            var modelSmallPutDTOS = modelSmallVOS
            var params = {mlAlgo,mlIntro,mlName,mlResult,modelSmallPutDTOS}
            params.showFlag = showFlag
            result = await UPDATEONEMODEL(params,mlId)
            if(result && result.status === 0){
              var {pageNum,modelList} = this
              //如果当前页大于1且当前页数据只有1条时，需要请求上一页数据
              if(pageNum > 1 && modelList.length === 1){
                pageNum--
              }
              this.reqModels(pageNum)               //删除/恢复成功需要刷新一下当前页的数据数据
              this.message(showFlag === 0?'删除成功':'恢复成功','success',1500)
            }else{
              this.message(showFlag === 0?'删除失败':'恢复失败','error',1500)
            }
          }else{
            this.message(showFlag === 0?'删除失败':'恢复失败','error',1500)
          }
        }).catch(() => {});
      },
      //消息提示
      message(message,type,duration){
        this.$message({
          message,type,duration
        })
      }
    },
    mounted () {
      this.choiceMenuId('ModelList')
      this.reqModels()
    },
  }
</script>

<style lang="less">
  @import "../../../../assets/css/table/table";
  @import "../../../../assets/css/input/input";
  .manageModelList{
    background-color: transparent;
    .headerSearchDiv{
      position: relative;
      background-color: rgba(0,0,0,0.25);
      margin-bottom: 20px;
      padding: 10px 20px;
      .el-form{
        .searchDiv{
          display: inline-block;
          margin-right: 120px;
        }
        .el-form-item{
          margin: 0;
          margin-right: 10px;
        }
      }
      button{
        margin-right: 20px;
        padding: 10px 15px;
      }
      .uploadButton{
        position: absolute;
        right: 20px;
        top: 10px;
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
  @media screen and (max-width: 767px) {
    .manageModelList{
      .headerSearchDiv{
        .el-form{
          .searchDiv{
            display: block;
            text-align: center;
            margin-right: 0px;
            .el-form-item{
              width: 270px;
            }
          }
          .el-form-item{
            margin: 10px;
          }
        }
        button{
          margin-right: 0px;
          padding: 10px 15px;
        }
        .uploadButton{
          position: absolute;
          right: 30px;
          top: 23px;
        }
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
  }
</style>

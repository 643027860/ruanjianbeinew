<template>
  <div class="manageSourceList">
    <el-dialog title="新增数据源" :visible.sync="dialogSourceVisible" top="20vh" width="400px">
      <el-form ref="form"v-model="uploadForm" label-width="80px" class="uploadForm">
        <el-form-item label="主机地址">
          <el-input v-model="uploadForm.host" placeholder="请输入主机地址" :fous="uploadForm.errorTip = ''"></el-input>
        </el-form-item>
        <el-form-item label="数据库">
          <el-select v-model="uploadForm.dbType" placeholder="请选择数据库">
            <el-option label="mysql" value="mysql"></el-option>
            <el-option label="postgresql" value="postgresql"></el-option>
            <el-option label="sqlserver" value="sqlserver"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数据库名">
          <el-input v-model="uploadForm.dbTable" placeholder="请输入数据库名" :fous="uploadForm.errorTip = ''"></el-input>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="uploadForm.dbUser" placeholder="请输入用户名" :fous="uploadForm.errorTip = ''"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input type="password" v-model="uploadForm.dbPassword" autocomplete="new-password" placeholder="请输入密码" :fous="uploadForm.errorTip = ''"></el-input>
        </el-form-item>
        <p style="text-align: center;margin: 0px;margin-bottom: 6px;color: red;">{{uploadForm.errorTip}}</p>
        <el-form-item class="buttonItem">
          <el-button type="primary" @click="uploadSource">立即上传</el-button>
          <el-button @click="dialogSourceVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <div class="headerSearchDiv">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="">
          <span style="font-size: 16px;margin-right: 0px;">数据源列表：</span>
        </el-form-item>
        <div class="searchDiv">
          <el-form-item label="数据库类型">
            <el-select v-model="searchForm.dbType" placeholder="请选择数据库">
              <el-option label="mysql" value="mysql"></el-option>
              <el-option label="postgresql" value="postgresql"></el-option>
              <el-option label="sqlserver" value="sqlserver"></el-option>
              <el-option label="全部" value=""></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="数据库名">
            <el-input v-model="searchForm.dbDatabase" placeholder="请输入数据库名"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" style="float: right;" @click="reqSources(1)">查询</el-button>
          </el-form-item>
        </div>
      </el-form>
      <el-button type="primary" class="uploadButton pc" icon="el-icon-plus" @click="toUploadSource">新增数据源</el-button>
      <el-button type="primary" class="uploadButton mobile" icon="el-icon-plus" @click="toUploadSource">新增</el-button>
    </div>
    <div class="manageContentDiv">
      <el-table
        v-loading="loading"
        element-loading-text="数据加载中"
        element-loading-spinner="el-icon-loading"
        :data="sourceList.databaseVOS"
        class="my-table">
        <el-table-column
          prop="dbName"
          label="数据源基本地址"
          min-width="250">
        </el-table-column>
        <el-table-column
          label="操作"
          width="200">
          <template slot-scope="scope">
            <el-button type="success" size="mini" @click="seeDetail(scope.row.dbId)">查看详情</el-button>
            <el-button type="danger" size="mini" @click="changeSource(scope.row.dbId)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pages" v-if="sourceList.total>0">
        <div class="block">
          <el-pagination
            layout="prev, pager, next"
            :total="sourceList.total*1"
            :current-page="pageNum*1"
            :page-size="pageSize*1"
            @current-change="(currentPage)=>reqSources(currentPage)"
          >
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {DELETEDYNAMIC,UPLOADDYNAMIC,REQDATASOURCELIST,REQDATASOURCEDBTYPEBASE,REQDATASOURCEDBTYPE} from '../../../../api/types'
  import {mapState,mapActions} from 'vuex'
  export default {
    name: 'manageSourceList',
    data () {
      return {
        pageNum: 1,
        pageSize: 13,

        source:{},       //单一数据源的详细信息
        sourceList:[],   //模型源列表

        //查询表单
        searchForm:{
          dbType:'',     //数据库类型
          dbDatabase:'', //数据库名
        },
        dialogSourceVisible:false,   //弹出上传数据源弹窗
        //上传表单
        uploadForm:{
          dbPassword:'',                    //数据库用户密码
          dbTable:'',                       //数据库名
          dbType:'',                        //数据库类型
          dbUser:'',                        //数据库用户名
          host:'',                          //主机地址
          errorTip:''
        },

        loading:false,  //加载中
      }
    },
    methods: {
      ...mapActions(['choiceMenuId']),

      //获取数据源列表,传入num的话就请求num页数据，否则请求第一页数据
      async reqSources(num){
        this.pageNum = num || 1
        var {pageNum,pageSize,searchForm} = this
        var {dbType,dbDatabase} = searchForm
        this.loading = true
        if(dbType.trim() && dbDatabase.trim()){
          var result = await REQDATASOURCEDBTYPEBASE({pageNum,pageSize},dbType,dbDatabase)
        }else if(dbType.trim()){
          var result = await REQDATASOURCEDBTYPE({pageNum,pageSize},dbType)
        }else{
          var result = await REQDATASOURCELIST({pageNum,pageSize})
        }
        this.loading = false
        if(result && result.status === 0){
          this.sourceList = result.data
        }else{
          if(result.msg){
            var message = result.msg
          }else{
            var message = '获取数据源失败'
          }
          this.message(message,'error',1500)
        }
      },

      //查看详情
      seeDetail(dbId){
        this.$router.push({name:'SourceDetail',query:{dbId}})
      },
      //前往上传数据源
      toUploadSource(){
        this.dialogSourceVisible = true
      },
      //上传数据源
      async uploadSource(){
        var {host,dbPassword,dbTable,dbType,dbUser} = this.uploadForm
        if(host && dbPassword && dbTable && dbType && dbUser){
          this.loading = true
          var result = await UPLOADDYNAMIC({host,dbPassword,dbTable,dbType,dbUser})
          this.loading = false
          if(result && result.status === 0){
            var {sourceList,pageSize,pageNum} = this
            if(sourceList.length === pageSize){
              pageNum++
            }
            this.dialogSourceVisible = false
            this.reqSources(pageNum)
            this.message('上传成功','success',1500)
          }else{
            if(result.msg){
              this.message(result.msg,'error',1500)
            }else{
              this.message('上传失败','error',1500)
            }
          }
        }else{
          this.uploadForm.errorTip = '请输入完整信息'
        }
      },

      //删除数据源
      changeSource(dbId){
        this.$confirm("确定删除该数据源吗?", '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          this.loading = true
          var result = await DELETEDYNAMIC(dbId)
          this.loading = false
          if(result && result.status === 0){
            var {pageNum,sourceList} = this
            //如果当前页大于1且当前页数据只有1条时，需要请求上一页数据
            if(pageNum > 1 && sourceList.length === 1){
              pageNum--
            }
            this.reqSources(pageNum)               //删除/恢复成功需要刷新一下当前页的数据数据
            this.message('删除成功','success',1500)
          }else{
            this.message("删除失败",'error',1500)
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
      this.choiceMenuId('SourceList')
      this.reqSources()
    },
    watch:{
      //关闭上传弹窗清空表单数据
      dialogSourceVisible(newval,oldval){
        if(!newval){
          this.uploadForm = {
            dbPassword:'',
            dbTable:'',
            dbType:'',
            dbUser:'',
            host:'',
            errorTip:''
          }
        }
      }
    }
  }
</script>

<style lang="less">
  @import "../../../../assets/css/table/table";
  @import "../../../../assets/css/input/input";
  @import "../../../../assets/css/el-dialog/el-dialog";
  .manageSourceList{
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
    .manageSourceList{
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

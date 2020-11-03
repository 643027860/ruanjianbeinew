<template>
  <div class="manageUserList">
    <div class="headerSearchDiv">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="">
          <span style="font-size: 16px;margin-right: 20px;">用户列表：</span>
        </el-form-item>
        <el-form-item style="float: right;" class="pc" v-if="false">
          <el-button type="primary" icon="el-icon-plus" @click="toUploadUser">新增用户</el-button>
        </el-form-item>
        <el-form-item style="float: right;" class="mobile" v-if="false">
          <el-button type="primary" icon="el-icon-plus" @click="toUploadUser">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="manageContentDiv">
      <el-table
        v-loading="loading"
        element-loading-text="数据加载中"
        element-loading-spinner="el-icon-loading"
        :data="userList"
        style="width: 100%">
        <el-table-column
          prop="name"
          label="姓名"
          min-width="200">
        </el-table-column>
        <el-table-column
          prop="phone"
          label="手机"
          min-width="200">
        </el-table-column>
        <el-table-column
          prop="time"
          label="注册时间"
          min-width="160">
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="160">
          <template slot-scope="scope">
            <el-button type="success" size="mini" @click="seeDetail(scope.row.userId)">查看详情</el-button>
            <el-button type="danger" size="mini" v-if="showFlag == 1" @click="changeUser(scope.row,0)">删除</el-button>
            <el-button type="danger" size="mini" v-if="showFlag == 0" @click="changeUser(scope.row,1)">恢复</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pages" v-if="userList.total>0">
        <div class="block">
          <el-pagination
            layout="prev, pager, next"
            :total="userList.total*1"
            :current-page="pageNum*1"
            :page-size="pageSize*1"
            @current-change="(currentPage)=>reqUsers(currentPage)"
          >
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {REQUSERS,UPDATEONEUSER} from '../../../../api/types'
  import {mapState,mapActions} from 'vuex'
  export default {
    name: 'manageUserList',
    data () {
      return {
        pageNum: 1,
        pageSize: 13,
        showFlag:1,     //是否可见标志，1为显示，0为不显示

        userList:[],    //用户列表

        loading:false,  //加载中
      }
    },
    methods: {
      ...mapActions(['choiceMenuId']),

      //获取用户列表,传入num的话就请求num页数据，否则请求第一页数据
      async reqUsers(num){
        this.pageNum = num || 1
        var {pageNum,pageSize,showFlag} = this
        this.loading = true
        var result = await REQUSERS({pageNum,pageSize,showFlag})
        this.loading = false
        if(result && result.status === 0){
          this.userList = result.data
          this.showFlag = showFlag
        }else{
          if(result.msg){
            var message = result.msg
          }else{
            var message = '获取用户列表失败'
          }
          this.message(message,'error',1500)
        }
      },

      //删除/恢复用户，showFlag为0时删除学生，1为恢复学生
      async changeUser(user,showFlag){
        var {userId,pageSize} = user
        user.showFlag = showFlag
        this.loading = true
        var result = await UPDATEONEUSER({pageNum,pageSize,showFlag})
        this.loading = false
        if(result && result.status === 0){
          var {pageNum,pageSize,userList} = this
          if(pageSize > 1 && userList.length === 1){
            pageSize--
          }
          this.reqUsers(pageSize)
        }else{
          if(result.msg){
            var message = result.msg
          }else{
            var message = showFlag?'删除失败':'恢复失败'
          }
          this.message(message,'error',1500)
        }
      },

      //查看学生详情
      seeDetail(userId){
        var {showFlag} = this
        this.$router.push({name:'UserDetail',query:{userId,showFlag}})
      },
      //前往上传实例
      toUploadUser(){
        this.$router.push({name:'UploadUser'})
      },

      //消息提示
      message(message,type,duration){
        this.$message({
          message,type,duration
        })
      }
    },
    mounted () {
      this.choiceMenuId('UserList')
      this.reqUsers()
    },
  }
</script>

<style lang="less">
  @import "../../../../assets/css/table/table";
  @import "../../../../assets/css/input/input";
  .manageUserList{
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

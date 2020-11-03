<template>
  <div class="manageUserDetail"
       v-loading="loading"
       element-loading-text="数据加载中"
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(0, 0, 0, 0.1)">
    <div class="headerSearchDiv">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="">
          <span style="font-size: 16px;margin-right: 20px;">用户详细信息：</span>
        </el-form-item>
        <el-form-item style="float: right;" class="pc">
          <el-button type="primary" icon="el-icon-edit" v-if="showFlag == 1 && !edit" @click="edit = true">修改</el-button>
          <el-button type="primary" icon="el-icon-edit" v-if="showFlag == 1 && edit" @click="edit = false">取消</el-button>
          <el-button type="danger" icon="el-icon-delete" v-if="showFlag == 1" @click="changeModel(0)">删除</el-button>
          <el-button type="primary" icon="el-icon-refresh-left" v-if="showFlag == 0" @click="changeModel(1)">恢复</el-button>
        </el-form-item>
        <el-form-item style="float: right;" class="mobile">
          <el-button type="primary" icon="el-icon-edit" v-if="showFlag == 1 && !edit" @click="edit = true"></el-button>
          <el-button type="primary" icon="el-icon-edit" v-if="showFlag == 1 && edit" @click="edit = false">取消</el-button>
          <el-button type="danger" icon="el-icon-delete" v-if="showFlag == 1" @click="changeModel(0)"></el-button>
          <el-button type="primary" icon="el-icon-refresh-left" v-if="showFlag == 0" @click="changeModel(1)"></el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="detailForm">
      <el-form ref="form" :model="updateForm" label-width="90px" v-show="edit">
        <el-form-item label="模型算法：">
          <el-select v-model="updateForm.mlAlgo" placeholder="请选择">
            <el-option label="Python" value="Python"></el-option>
            <el-option label="R" value="R"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="模型名称：">
          <el-input v-model="updateForm.mlName"></el-input>
        </el-form-item>
        <el-form-item label="模型功能：">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入模型功能"
            v-model="updateForm.mlResult">
          </el-input>
        </el-form-item>
        <el-form-item label="模型介绍：">
          <el-input
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 8}"
            placeholder="请输入内容"
            v-model="updateForm.mlIntro">
          </el-input>
        </el-form-item>
        <el-form-item label="模型参数：">
          <el-table
            :data="updateForm.modelSmallPutDTOS"
            empty-text="暂无参数"
            class="myTable">
            <el-table-column
              type="index"
              width="50">
            </el-table-column>
            <el-table-column
              label="参数名"
              min-width="120">
              <template slot-scope="scope">
                <el-input placeholder="请输入参数名" v-model="updateForm.modelSmallPutDTOS[scope.$index].msName">{{scope.row.msName}}</el-input>
              </template>
            </el-table-column>
            <el-table-column
              label="参数描述"
              min-width="180">
              <template slot-scope="scope">
                <el-input placeholder="请输入参数描述" v-model="updateForm.modelSmallPutDTOS[scope.$index].msIntro">{{scope.row.msIntro}}</el-input>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="200">
              <template slot-scope="scope">
                <el-button type="danger" size="mini" @click="removeDTOS(scope.$index)">删除</el-button>
                <el-button type="primary" size="mini" v-if="scope.$index == updateForm.modelSmallPutDTOS.length-1" @click="addDTOS()">继续添加</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updateModel()">立即修改</el-button>
          <el-button @click="edit = false">取消</el-button>
        </el-form-item>
      </el-form>
      <el-form ref="form1" :model="user" label-width="90px" v-show="!edit">
        <el-form-item label="用户名：">
          <div class="pmFormWidth">
            {{model.mlAlgo}}
          </div>
        </el-form-item>
        <el-form-item label="模型名称：">
          <div class="pmFormWidth">
            {{model.mlName}}
          </div>
        </el-form-item>
        <el-form-item label="模型功能：">
          <div class="pmFormWidth">
            {{model.mlResult}}
          </div>
        </el-form-item>
        <el-form-item label="模型介绍：">
         <div class="pmFormWidth">
           {{model.mlIntro}}
         </div>
        </el-form-item>
        <el-form-item label="模型参数：">
          <el-table
            :data="model.modelSmallVOS"
            empty-text="暂无参数"
            class="myTable">
            <el-table-column
              type="index"
              width="50">
            </el-table-column>
            <el-table-column
              prop="msName"
              label="参数名"
              min-width="120">
            </el-table-column>
            <el-table-column
              prop="msIntro"
              label="参数描述"
              min-width="180">
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import {REQONEUSER,UPDATEONEUSER} from '../../../../api/types'
  import merge from 'webpack-merge'          //用于动态修改地址栏参数的
  import {mapState,mapActions} from 'vuex'
  export default {
    name: 'manageUserDetail',
    data () {
      return {
        userId:'',       //用户Id
        edit:false,      //是否可修改

        showFlag: 1,     //显示标志，1为显示，0为不显示

        user:{},         //单一用户的详细信息

        //修改模型表单
        updateForm:{
          mlAlgo:'',
          mlIntro:'',
          mlName:'',
          mlResult:'',
          modelSmallPutDTOS:[],
        },

        loading:false,
      }
    },
    methods: {
      ...mapActions(['choiceMenuId']),

      //获取一个用户的详细信息
      async reqOneUser(){
        var {userId} = this
        this.loading = true
        var result = await REQONEUSER(userId)
        this.loading = false
        if(result && result.status === 0){
          this.user = result.data
          this.fuZhi()
        }
      },

      //将用户信息复制给修改表单
      fuZhi(){
        var {mlAlgo,mlIntro,mlName,showFlag,mlResult,modelSmallVOS} = this.user
        this.updateForm.mlAlgo = mlAlgo
        this.updateForm.mlIntro = mlIntro
        this.updateForm.mlName = mlName
        this.updateForm.showFlag = showFlag
        this.updateForm.mlResult = mlResult
        modelSmallVOS.map(item => {
          this.updateForm.modelSmallPutDTOS.push({msIntro:item.msIntro,msName:item.msName})
        })
      },

      //删除/恢复用户，showFlag为0时删除学生，1为恢复学生
      changeUser(showFlag = 1){
        this.$confirm(`确定${showFlag?'恢复':'删除'}该用户吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          var {userId,user} = this
          var {mlAlgo,mlIntro,mlName,mlResult,modelSmallVOS} = user
          var modelSmallPutDTOS = modelSmallVOS
          var params = {mlAlgo,mlIntro,mlName,mlResult,modelSmallPutDTOS}
          params.showFlag = showFlag
          this.loading = true
          var result = await UPDATEONEUSER(params,userId)
          this.loading = false
          if(result && result.status === 0){
            this.message(showFlag === 0?'删除成功':'恢复成功','success',1500)
            this.showFlag = showFlag
            this.chanceUrlQuery({mlId,showFlag})
          }else{
            this.message(showFlag === 0?'删除失败':'恢复失败','error',1500)
          }
        }).catch(() => {});
      },

      //修改用户信息
      async updateUser(){
        var {mlAlgo,mlIntro,mlName,mlResult,modelSmallPutDTOS} = this.updateForm
        //过滤掉没填写完整信息的参数
        modelSmallPutDTOS = modelSmallPutDTOS.filter(item => {
          if(item.msName.trim() && item.msIntro.trim()){
            return item
          }
        })
        if(mlAlgo && mlIntro && mlName && mlResult && modelSmallPutDTOS.length > 0){
          var {userId,showFlag} = this
          var modelPutDTO  = {mlAlgo,mlIntro,mlName,mlResult,modelSmallPutDTOS,showFlag}
          this.loading = true
          var result = await UPDATEONEUSER(modelPutDTO,userId)
          this.loading = false
          if(result && result.status === 0){
            //修改成功后需要重置更新表单并获取新的模型数据和取消当前修改状态
            this.emptyForm()
            this.edit = false
            this.reqOneModel()
            this.message('修改成功','success',1500)
          }else{
            this.message('修改失败','error',1500)
          }
        }else{
          this.message('请输入完整用户信息','warning',1500)
        }
      },
      //清空表单
      emptyForm(){
        this.updateForm.mlAlgo = ''
        this.updateForm.mlIntro = ''
        this.updateForm.mlName = ''
        this.updateForm.mlResult = ''
        this.updateForm.modelSmallDTOS = []
      },
      //修改路由参数
      chanceUrlQuery(data){
        //清空所有的参数：
        this.$router.push({
          query:merge({},{})
        })
        //更新路由参数
        this.$router.push({
          query:merge(this.$route.query,data)
        })
      },
      //消息提示
      message(message,type,duration){
        this.$message({
          message,type,duration
        })
      }
    },
    watch: {
      //每次关闭上传模型窗口时就清空一次表单数据
      dialogUploadModelVisible(newval,oldval){
        if(!newval){
          this.emptyForm()
        }
      },
    },
    created () {
      if(this.$route.query.userId){
        this.userId = this.$route.query.userId
        this.showFlag = this.$route.query.showFlag
        this.choiceMenuId('UserList')
        this.reqOneUser()
      }else{
        this.$router.replace({name:'UserList'})
      }
    },
  }
</script>

<style lang="less">
  @import "../../../../assets/css/table/table";
  @import "../../../../assets/css/input/input";
  .manageUserDetail{
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
        margin-right: 20px;
        padding: 10px 15px;
      }
    }
    button{
      outline: 0;
    }
    .detailForm{
      min-height: calc(100vh - 181px);
      padding: 20px;
      background-color: rgba(0,0,0,0.25);
      .el-form{
        .el-form-item{
          min-width: 500px;
          .el-form-item__label{
            color: white;
          }
          input,textarea{
            width: 40%!important;
            min-width: 600px;
          }
          .el-select{
            input{
              width: 100%!important;
            }
          }
          th{
            padding: 5px;
          }
          .myTable{
            width: 60%;
            min-width: 600px;
            input,textarea{
              border: 1px solid rgb(128,128,128)!important;
              width: 80%!important;
            }
          }
        }
      }
    }
  }
  @media screen and (max-width: 767px) {
    .manageUserDetail{
      .headerSearchDiv{
        button{
          margin-right: 0px;
          padding: 10px 15px;
        }
      }
      .detailForm{
        padding: 10px 0px 20px;
        .el-form{
          .el-form-item{
            min-width: 100%;
            margin-bottom: 10px;
            .el-form-item__label{
              color: white;
              padding: 0;
            }
            input,textarea{
              width: calc(100% - 10px);
              min-width: calc(100% - 10px);
            }
            .el-select{
              input{
                width: 100%!important;
              }
            }
            th{
              padding: 5px;
            }
            .myTable{
              width: calc(100% - 10px);
              min-width: calc(100% - 10px);
              input,textarea{
                border: 1px solid rgb(128,128,128)!important;
                width: 80%!important;
              }
            }
          }
        }
      }
    }
  }
</style>

<template>
  <div class="manageUploadUser"
       v-loading="loading"
       element-loading-text="模型上传中"
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(0, 0, 0, 0.1)">
    <div class="headerSearchDiv">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="">
          <span style="font-size: 16px;margin-right: 20px;">上传模型：</span>
        </el-form-item>
      </el-form>
    </div>
    <div class="detailForm">
      <el-form ref="form" :model="uploadForm" label-width="90px">
        <el-form-item label="模型算法：">
          <el-select v-model="uploadForm.mlAlgo" placeholder="请选择">
            <el-option label="Python" value="Python"></el-option>
            <el-option label="R" value="R"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="模型名称：">
          <el-input  placeholder="请输入模型名称" v-model="uploadForm.mlName"></el-input>
        </el-form-item>
        <el-form-item label="模型功能：">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入模型功能"
            v-model="uploadForm.mlResult">
          </el-input>
        </el-form-item>
        <el-form-item label="模型介绍：">
          <el-input
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 8}"
            placeholder="请输入模型介绍"
            v-model="uploadForm.mlIntro">
          </el-input>
        </el-form-item>
        <el-form-item label="模型参数：">
          <el-table
            :data="uploadForm.modelSmallDTOS"
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
                <el-input placeholder="请输入参数名" v-model="uploadForm.modelSmallDTOS[scope.$index].msName">{{scope.row.msName}}</el-input>
              </template>
            </el-table-column>
            <el-table-column
              label="参数描述"
              min-width="180">
              <template slot-scope="scope">
                <el-input placeholder="请输入参数描述" v-model="uploadForm.modelSmallDTOS[scope.$index].msIntro">{{scope.row.msIntro}}</el-input>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="200">
              <template slot-scope="scope">
                <el-button type="danger" size="mini" @click="removeDTOS(scope.$index)">删除</el-button>
                <el-button type="primary" size="mini" v-if="scope.$index == uploadForm.modelSmallDTOS.length-1" @click="addDTOS()">继续添加</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="uploadModel()">立即上传</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import {REQONEMODEL,UPLOADONEMODEL} from '../../../../api/types'
  import {mapState,mapActions} from 'vuex'
  export default {
    name: 'manageUserUpload',
    data () {
      return {
        loading:false,
        //上传模型表单
        uploadForm:{
          mlAlgo:'',
          mlIntro:'',
          mlName:'',
          mlResult:'',
          modelSmallDTOS:[
            {
              msIntro:'',
              msName:'',
            }
          ],
        }
      }
    },
    methods: {
      ...mapActions(['choiceMenuId']),

      //上传一个模型
      async uploadModel(){
        var {uploadForm} = this
        var {mlAlgo,mlIntro,mlName,mlResult,modelSmallDTOS} = this.uploadForm
        //过滤掉没填写完整信息的参数
        modelSmallDTOS = modelSmallDTOS.filter(item => {
          if(item.msName.trim() && item.msIntro.trim()){
            return item
          }
        })
        if(mlAlgo && mlIntro && mlName && mlResult && modelSmallDTOS.length > 0){
          var modelDTO = {mlAlgo,mlIntro,mlName,mlResult,modelSmallDTOS}
          this.loading = true
          var result = await UPLOADONEMODEL(modelDTO)
          this.loading = false
          if(result && result.status === 0){
            this.emptyForm()
            this.message('上传成功','success',1500)
          }else{
            this.message('上传失败','error',1500)
          }
        }else{
          this.message('请输入完整模型信息','warning',1500)
        }
      },
      //添加上传模型参数
      addDTOS(){
        this.uploadForm.modelSmallDTOS.push({
          msIntro:'',
          msName:'',
        })
      },
      //删除上传模型参数
      removeDTOS(index){
        var {modelSmallDTOS} = this.uploadForm
        if(modelSmallDTOS.length > 1){
          this.uploadForm.modelSmallDTOS = modelSmallDTOS.filter((item,index1) => index1 !== index)
        }else{
          this.uploadForm.modelSmallDTOS = [{
            msIntro:'',
            msName:'',
          }]
        }
      },
      //清空表单
      emptyForm(){
        this.uploadForm.mlAlgo = ''
        this.uploadForm.mlIntro = ''
        this.uploadForm.mlName = ''
        this.uploadForm.mlResult = ''
        this.uploadForm.modelSmallDTOS = [{
          msIntro:'',
          msName:'',
        }]
      },
      //消息提示
      message(message,type,duration){
        this.$message({
          message,type,duration
        })
      }
    },
    mounted () {
      this.choiceMenuId('UploadUser')
    },
  }
</script>

<style lang="less">
  @import "../../../../assets/css/table/table";
  @import "../../../../assets/css/input/input";
  .manageUploadUser{
    background-color: transparent;
    position: relative;
    button{
      outline: 0;
      margin-right: 0px;
      padding: 10px 15px;
    }
    .headerSearchDiv{
      background-color: rgba(0,0,0,0.25);
      margin-bottom: 20px;
      padding: 10px 20px;
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
            min-width: 700px;
            input,textarea{
              border: 1px solid rgb(128,128,128)!important;
              width: 80%!important;
            }
          }
        }
      }
    }
  }
  @media screen and(max-width: 677px){
    .manageUploadUser{
      .detailForm{
        .el-form{
          .el-form-item{
            input,textarea{
              width: 80%!important;
              min-width: 300px;
            }
          }
        }
        .myTable{
          width: 80%!important;
          min-width: 300px;
        }
      }
    }
  }
</style>

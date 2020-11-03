<template>
  <div class="myMenu">
    <el-menu
      :default-active="menuId"
      class="el-menu-vertical-demo"
      :collapse="isCollapse"
      :unique-opened="true"
      :collapse-transition="false"
      background-color="rgba(0,0,0,0.1)"
      text-color="rgb(255,255,255)"
      active-text-color="rgb(64, 158, 255)"
    >
      <el-submenu index="mainPage">
        <template slot="title">
          <i class="el-icon-house"></i>
          <span slot="title">主页</span>
        </template>
        <el-menu-item-group>
          <router-link :to="{name:'mainPage'}"><el-menu-item index="mainPage" @click="close">主页</el-menu-item></router-link>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="SourceList">
        <template slot="title">
          <i class="el-icon-place"></i>
          <span slot="title">数据源</span>
        </template>
        <el-menu-item-group>
          <router-link :to="{name:'SourceList'}"><el-menu-item index="SourceList" @click="close">数据源列表</el-menu-item></router-link>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="ModelList">
        <template slot="title">
          <i class="el-icon-office-building"></i>
          <span slot="title">数据模型</span>
        </template>
        <el-menu-item-group>
          <router-link :to="{name:'ModelList'}"><el-menu-item index="ModelList" @click="close">模型列表</el-menu-item></router-link>
        </el-menu-item-group>
        <el-menu-item-group>
          <router-link :to="{name:'UploadModel'}"><el-menu-item index="UploadModel" @click="close">上传模型</el-menu-item></router-link>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="ExampleList">
        <template slot="title">
          <i class="el-icon-s-data"></i>
          <span slot="title">数据实例</span>
        </template>
        <el-menu-item-group>
          <router-link :to="{name:'ExampleList'}"><el-menu-item index="ExampleList" @click="close">实例列表</el-menu-item></router-link>
        </el-menu-item-group>
        <el-menu-item-group>
          <router-link :to="{name:'UploadExample'}"><el-menu-item index="UploadExample" @click="close">上传实例</el-menu-item></router-link>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="AnalyzeList">
        <template slot="title">
          <i class="el-icon-edit-outline"></i>
          <span slot="title">数据分析</span>
        </template>
        <el-menu-item-group>
          <router-link :to="{name:'AnalyzeList'}"><el-menu-item index="AnalyzeList" @click="close">分析列表</el-menu-item></router-link>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="Web">
        <template slot="title">
          <i class="el-icon-s-promotion"></i>
          <span slot="title">后台服务</span>
        </template>
        <el-menu-item-group>
          <router-link :to="{name:'One'}"><el-menu-item index="One" @click="close">链路追踪</el-menu-item></router-link>
        </el-menu-item-group>
        <el-menu-item-group>
          <router-link :to="{name:'Two'}"><el-menu-item index="Two" @click="close">日志系统</el-menu-item></router-link>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="User" v-if="false">
        <template slot="title">
          <i class="el-icon-user-solid"></i>
          <span slot="title">用户管理</span>
        </template>
        <el-menu-item-group>
          <router-link :to="{name:'UserList'}"><el-menu-item index="UserList" @click="close">用户列表</el-menu-item></router-link>
        </el-menu-item-group>
        <el-menu-item-group v-if="false">
          <router-link :to="{name:'UploadUser'}"><el-menu-item index="UploadUser" @click="close">注册用户</el-menu-item></router-link>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
  import {mapState,mapActions} from 'vuex'
  export default {
    computed:{
      ...mapState(['isCollapse','menuId'])
    },
    data () {
      return {

      }
    },
    mounted () {
      if($(window).width()  < 1000) {
        this.ocmenus()
      }
    },
    methods: {
      ...mapActions(['ocmenus']),
      //小于1000px时点击菜单选项隐藏菜单
      close(){
        if($(window).width()  < 1000) {
          this.ocmenus()
        }
      },
    },
  }
</script>

<style lang="less">
  .el-menu--vertical{
    li,div{
      padding: 0;
      margin: 0;
      &:hover{
        background-color: rgba(0,0,0,0.3) !important;
      }
    }
  }
  .myMenu{
    .el-menu {
      border-right: none;
      li{
        text-align: left;
        &:hover{
          background-color: rgba(0,0,0,0.1) !important;
        }
      }
      .el-submenu__title{
        background-color: rgba(0,0,0,0.1) !important;
        &:hover{
          background-color: rgba(0,0,0,0.3) !important;
        }
      }
      .el-menu-item-group__title{
        padding-bottom: 0px;
        padding-top: 0px;
      }
      a{
        text-decoration: none;
      }
      .el-menu--inline .el-menu-item{
        background-color: rgba(0,0,0,0.2) !important;
      }
      .el-menu--inline .el-menu-item:hover{
        background-color: rgba(0,0,0,0.3) !important;
        color: rgb(64, 158, 255) !important;
      }
    }
  }
</style>

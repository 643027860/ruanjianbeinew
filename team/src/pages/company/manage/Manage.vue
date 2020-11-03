<template>
  <div class="myManage">
    <el-container>
      <el-aside class="my_slider mo" width="220px">
        <Menus></Menus>
      </el-aside>
      <el-container class="my_main">
        <el-header class="my_header">
          <Nav></Nav>
        </el-header>
        <el-main class="my_mainpage">
          <transition name="component-fade" mode="out-in">
            <router-view v-if="!$route.meta.keepAlive" />
          </transition>
          <transition name="component-fade" mode="out-in">
            <keep-alive>
              <router-view v-if="$route.meta.keepAlive" />
            </keep-alive>
          </transition>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  import Nav from '../../../components/Nav/nav'
  import Menus from '../../../components/Menus/menu'
  import {mapState} from 'vuex'
  export default {
    name: 'manage',
    components: {
      Nav,
      Menus
    },
    computed: {
      ...mapState(['isCollapse'])
    },
    mounted () {},
    watch:{
      isCollapse(newval,oldval){
        if(!newval){
          $('.manage').addClass('mo_mainpage')
          $('#drawer-bg').removeClass('drawer-bg-show')
          $('.my_slider').removeClass('mo')
          $('.my_slider').removeClass('hidden1')
          $('.my_main').removeClass('tobig')
          $('.my_slider').addClass('open')
          $('.my_main').addClass('tosmall')
        }else{
          $('.manage').removeClass('mo_mainpage')
          $('.my_slider').removeClass('open')
          $('.my_slider').addClass('mo')
          $('#drawer-bg').addClass('drawer-bg-show')
          $('.my_main').removeClass('tosmall')
          $('.my_slider').addClass('hidden1')
          $('.my_main').addClass('tobig')
        }
      },
    },
  }
</script>

<style scoped lang="less">
  .myManage{
    .drawer-bg-show{
      display: none;
    }
    /*菜单栏样式*/
    .my_slider{
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      z-index: 1001;
      overflow-y: auto;
      overflow-x: hidden;
      width: 220px;
      height: 100%;
      background-color: rgba(0,0,0,0.2);
      font-size: 0;
      -webkit-transition: .4s;
      transition: .4s;
    }/*菜单栏滚动条样式*/
    .my_slider::-webkit-scrollbar {/*滚动条整体样式*/
      width: 5px;     /*高宽分别对应横竖滚动条的尺寸*/
      height: 5px;
      scrollbar-arrow-color:red;
    }
    .my_slider::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
      background: rgb(73,84,100);
      border-radius: 5px;
      -webkit-box-shadow: inset 0 0 0px rgb(50,40,50);
      scrollbar-arrow-color:red;
    }
    .my_slider::-webkit-scrollbar-track {/*滚动条里面轨道*/
      background: rgba(0,0,0,0.3);
      -webkit-box-shadow: inset 0 0 0px #304156;
      border-radius: 0;
    }
    /*主体样式*/
    .my_main{
      position: relative;
      overflow-x: hidden;
      width: 100%;
      margin-left: 220px;
      -webkit-transition: margin-left .4s;
      transition: margin-left .4s;
      .my_header{
        overflow: hidden;
        padding: 0;
      }
      .my_mainpage{
        padding: 20px;
        color: #FFFFFF;
        min-height: calc(100vh - 60px);
        //去掉滚动条
        &::-webkit-scrollbar {
          width: 0px;
        }
      }
    }
  }
  @media screen and(max-width: 999px){
    .mo_mainpage{
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      min-height: 100vh;
    }
    .myManage {
      .mo{
        width: 0px!important;
      }
      .my_main{
        margin: 0!important;
      }
      .open{
        width: 220px!important;
      }
      .my_slider{
        top: 60px!important;
      }
    }
  }
  @media screen and(min-width: 1000px) {
    .myManage{
      .hidden1{
        width: 63px!important;
      }
      .tobig{
        margin-left: 63px!important;
      }
      .open{
        width: 220px!important;
      }
      .tosmall{
        margin-left: 220px!important;
      }
    }
  }
  @media screen and(max-width: 768px) {
    .myManage{
      .my_main{
        .my_mainpage{
          padding: 10px;
        }
      }
    }
  }
</style>

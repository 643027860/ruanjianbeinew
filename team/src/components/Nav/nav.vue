<template>
  <div class="myNav clearFloat">
    <MenuControl style="float: left;"></MenuControl>
    <div class="rightAvatar clearFloat">
      <Avatar></Avatar>
      <el-badge :value="warning" v-if="false" class="item noSelect" @click.native="seeWarning()">
        <i class="el-icon-bell"></i>
      </el-badge>
    </div>
  </div>
</template>

<script>
  import Avatar from './avatar'
  import MenuControl from '../Menus/controlmenu'
  export default {
    components: {
      Avatar,
      MenuControl
    },
    data () {
      return {
        warning:300,           //警告数目
      }
    },
    methods: {
      //点击打开警告通知信息
      seeWarning(){
        console.log('warning')
        this.warning--
      },
    },
  }
</script>

<style lang="less">
  @media (any-hover: hover) {
    .myNav{
      .rightAvatar{
        .el-badge{
          &:hover{
            cursor: pointer;
            i{
              color: rgb(64,158,255);
            }
          }
        }
      }
    }
  }
  .myNav{
    height: 60px;
    background-color: rgba(0,0,0,0.3);
    .rightAvatar{
      float: right;
      padding: 10px 0;
      .el-badge{
        width: 40px;
        margin-top: 10px;
        margin-right: 30px;
        i{
          font-size: 20px;
          color: white;
          margin-left: 7.5px;
          transition: 0.3s;
        }
        .el-badge__content{
          font-size: 10px;
        }
      }
    }
  }
</style>

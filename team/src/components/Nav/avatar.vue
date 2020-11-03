<template>
  <div class="myNavIcon myAvatar">
    <el-dropdown @command="handleCommand" trigger="click">
      <span class="el-dropdown-link">
        <div class="myNavInner">
          <img class="noSelect" src="https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1463578878,1262482751&fm=26&gp=0.jpg" alt="">
          <span>{{user.name||'未登录'}}</span>
          <i class="el-icon-caret-bottom"></i>
        </div>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item divided command="out">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        user:{}
      }
    },
    mounted () {
      var user = JSON.parse(localStorage.getItem('RUANJIANBEI_USER'))
      if(user && user.user){
        this.user = user.user.sysUser
      }
    },
    methods: {
      handleCommand(command){
        if(command == 'out'){
          this.$confirm("确定退出?", '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async () => {
            this.$router.replace({name:'login'})
            localStorage.setItem('RUANJIANBEI_USER',JSON.stringify(null))
          }).catch(() => {});
        }
      },
    },
  }
</script>

<style lang="less">
  @media (any-hover: hover){      //解决hover影响移动端
    .myNavIcon:hover{
      background-color: transparent;
      cursor:pointer;
    }
  }
  .el-dropdown-menu{
    padding: 0!important;
    margin-top: 0!important;
  }
  .el-dropdown-menu__item--divided:before{
    height: 0px!important;
  }
  .el-dropdown-menu__item--divided{
    margin-top: 0;
  }
  .myAvatar{
    float: right;
    padding: 0 8px;
    margin-right: 30px;
    .myNavInner{
      position: relative;
      vertical-align: middle;
      img{
        cursor: pointer;
        width: 30px;
        height: 30px;
        border-radius: 10%;
        vertical-align: middle;
      }
      span{
        color: #FFFFFF;
        display: inline-block;
        font-size: 15px;
        line-height: 30px;
        padding: 5px 10px;
        vertical-align: middle;
      }
      i{
        cursor: pointer;
        position: absolute;
        color: #FFFFFF;
        right: -20px;
        top: 25px;
        font-size: 12px;
      }
    }
  }
</style>

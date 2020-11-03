<template>
  <div class="controlmenu" @click="ocmenus">
    <i :class="isCollapse?'el-icon-s-unfold':'el-icon-s-fold'"></i>
  </div>
</template>

<script>
  import {mapState,mapActions} from 'vuex'
  export default {
    computed:{
      ...mapState(['isCollapse'])
    },
    methods: {
      ...mapActions(['ocmenus']),
    },
  }
</script>

<style lang="less">
   @media (any-hover: hover) {
     .controlmenu:hover{
       background-color: rgba(10,10,10,0.2);
       cursor: pointer;
     }
  }
  .controlmenu{
    height: 60px;
    width: 60px;
    line-height: 60px;
    text-align: center;
    i{
      height: 30px;
      width: 30px;
      font-size: 25px;
      color: #FFFFFF;
      transition: 0.5s;
      -webkit-transition: .5s;
    }
  }
</style>

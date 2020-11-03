<template>
  <div class="error">
    <div class="errordiv">
      <el-row :gutter="10">
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <div class="imgdiv">
            <img src="./404.jpg" alt="">
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" >
          <div class="fontdiv">
            <h1>404</h1>
            <h2>哦！页面丢失</h2>
            <p>您所寻找的页面不存在。您可以点击下面的按钮，返回登陆。</p>
            <button class="error_button" @click="$router.replace({name:'login'})">
              返回首页
            </button>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  export default {}
</script>

<style lang="less">
  .error{
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: hidden;
    .errordiv{
      margin: 150px auto 0;
      color:rgb(14,6,32);
      &:before,&:after{
        content: '';
        display: table;
        clear: both;
      }
      .imgdiv{
        width: 500px;
        float: right;
        text-align: center;
        img{
          width: 320px;
          height: 320px;
        }
      }
      .fontdiv{
        max-width: 300px;
        h1{
          margin: 10px 0 0;
          font-size: 120px;
          font-weight: bold;
        }
        h2{
          margin: 20px 0;
          font-size: 32px;
          font-weight: bold;
        }
        p{
          font-size: 16px;
        }
        .error_button{
          cursor: pointer;
          border: 4px solid rgb(44,207,109);
          z-index: 1;
          overflow: hidden;
          background: transparent;
          position: relative;
          padding: 8px 50px;
          border-radius: 30px;
          font-size: 1.5em;
          letter-spacing: 2px;
          font-weight: bold;
          margin: 5px 0px;
          transition: 0.2s ease;
          -webkit-transition: 0.2s ease;
          outline:none;
        }
        .error_button:before{
          cursor: pointer;
          background-color: rgb(44,207,109);
          color: white;
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          width: 0%;
          height: 100%;
          z-index: -1;
          -webkit-transition: 0.2s ease;
          transition: 0.2s ease;
        }
        .error_button:hover::before{
          width: 100%;
        }
      }
    }
  }
  @media screen and (max-width: 1000px) and (min-width: 768px){
    .errordiv {
      .imgdiv{
        width: 350px!important;
        img{
          width: 300px;
          height: 300px;
        }
      }
    }
  }
  @media screen and (max-width: 767px) and (min-width: 500px){
    .errordiv {
      margin-top: 50px!important;
      .imgdiv{
        width: 100%!important;
        img{
          width: 200px;
          height: 200px;
        }
      }
      .fontdiv{
        min-width: 100%!important;
        text-align: center;
        h1{
          font-size: 80px!important;
        }
      }
    }
  }
  @media screen and (max-width: 500px){
    .errordiv{
      margin-top: 50px!important;
      .imgdiv{
        margin: auto;
        width: 220px;
        img{
          margin-left: -20px;
          width: 200px;
          height: 200px;
        }
      }
      .fontdiv{
        margin: 20px auto 0;
      }
      h1{
        font-size: 45px!important;
      }
      h2{
        font-size: 30px!important;
      }
    }
  }
</style>

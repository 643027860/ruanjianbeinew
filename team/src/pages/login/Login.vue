<template>
  <div class="myLogin">
    <div class="myMangeBackground" />
    <h1 class="myLoginBigTtitle noSelect pc">企业数据异构系统</h1>
    <div class="loginDivPc pc">
      <div class="formContain signInContainer">
        <el-form :model="loginForm" status-icon ref="loginForm" label-width="0px" class="demo-ruleForm">
          <h1>用户登录</h1>
          <el-form-item label="" prop="name">
            <el-input type="text" v-model="loginForm.name" placeholder="账户" autocomplete="new-password">
              <i slot="prefix" class="el-input__icon el-icon-user"></i>
            </el-input>
          </el-form-item>
          <el-form-item label="" prop="password">
            <el-input type="password" v-model="loginForm.password" placeholder="密码" autocomplete="new-password">
              <i slot="prefix" class="el-input__icon el-icon-lock"></i>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button class="myLoginButton" type="danger" round @click="Login()">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="formContain signUpContainer">
        <el-form :model="registerForm" status-icon ref="registerForm" label-width="0px" class="demo-ruleForm">
          <h1>用户注册</h1>
          <el-form-item label="" prop="name">
            <el-input type="text" v-model="registerForm.name" placeholder="账户" autocomplete="new-password">
              <i slot="prefix" class="el-input__icon el-icon-user"></i>
            </el-input>
          </el-form-item>
          <el-form-item label="" prop="password">
            <el-input type="password" v-model="registerForm.password" placeholder="密码" autocomplete="new-password">
              <i slot="prefix" class="el-input__icon el-icon-lock"></i>
            </el-input>
          </el-form-item>
          <el-form-item label="" prop="password1">
            <el-input type="password" v-model="registerForm.password1" placeholder="确认密码" autocomplete="new-password">
              <i slot="prefix" class="el-input__icon el-icon-lock"></i>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button class="myLoginButton" type="danger" round @click="resertForm('registerForm')">重置</el-button>
            <el-button class="myLoginButton" type="danger" round @click="Register()" style="margin-left: 0;">注册</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="overlayContainer">
        <div class="overlay">
          <div class="overlayPanel overlayLeft">
            <h1>欢迎回来</h1>
            <p>登录个人账号，继续我们之间的交流</p>
            <el-button class="myLoginButton" type="danger" round @click="toLogin()">登录</el-button>
          </div>
          <div class="overlayPanel overlayRight">
            <h1>欢迎光临</h1>
            <p>注册个人账号是我们相遇的第一步</p>
            <el-button class="myLoginButton" type="danger" round @click="toRegister()">注册</el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="loginDivMobile mobile">
      <div class="loginInner" v-show="loginMobile">
        <h1 class="myLoginBigTtitle noSelect">企业数据异构系统</h1>
        <p class="loginP">欢迎回来</p>
        <el-form :model="loginForm"  ref="loginForm" label-width="50px">
          <el-form-item label="账户"  prop="name">
            <el-input  prefix-icon="el-icon-s-custom" v-model.number="loginForm.name" autocomplete="off" placeholder="请输入账号"><</el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input prefix-icon="el-icon-lock" type="password" v-model="loginForm.password" autocomplete="off" placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button class="myLoginButton" type="primary" round @click="Login()">立即登录</el-button>
          </el-form-item>
          <el-form-item style="margin-top: -5px;">
            <el-button class="myLoginButton" type="" round @click="goToRegister()">注册</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="loginInner" v-show="!loginMobile">
        <h1 class="myLoginBigTtitle noSelect">企业数据异构系统</h1>
        <p class="loginP">用户注册</p>
        <el-form :model="registerForm"  ref="registerForm" label-width="50px">
          <el-form-item label="账户"  prop="name" style="margin-bottom: 20px;">
            <el-input  prefix-icon="el-icon-s-custom" v-model.number="registerForm.name" autocomplete="off" placeholder="请输入账号"><</el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password" style="margin-bottom: 20px;">
            <el-input prefix-icon="el-icon-lock" type="password" v-model="registerForm.password" autocomplete="off" placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item label="" prop="password1" style="margin-bottom: 20px;">
            <el-input prefix-icon="el-icon-lock" type="password" v-model="registerForm.password1" autocomplete="off" placeholder="再次输入密码"></el-input>
          </el-form-item>
          <el-form-item style="margin-top: -5px;">
            <el-button class="myLoginButton" type="primary" round @click="Register(true)">立即注册</el-button>
          </el-form-item>
          <el-form-item style="margin-top: -5px;">
            <el-button class="myLoginButton" type="" round @click="returnToLogin()">返回登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import {LOGIN,REGISTER} from '../../api/types'  //引入封装好的登录注册方法
  export default {
    name:'login',
    data () {
      return {
        loginMobile:true,                  //移动端显示的是否是登录界面
        loginForm:{
          name:'',             //用户账户
          password:'',         //用户密码
        },       //登录表单
        registerForm:{
          name:'',             //注册时用户账户
          password:'',         //注册时用户密码
          password1:'',        //注册时确认用户密码
        },    //注册表单
      }
    },
    methods: {
      /*移动端*/
      //返回登录
      returnToLogin(){
        this.loginMobile = true
      },
      //去注册
      goToRegister(){
        this.loginMobile = false
      },

      /*pc端*/
      //显示用户登录组件，修改对应的样式
      toLogin(){
        $('.signInContainer').css('transform','translateX(0)')
        $('.signInContainer').css('opacity','1')
        $('.signUpContainer').css('transform','translateX(0)')
        $('.signUpContainer').css('z-index','1')
        $('.signUpContainer').css('opacity','0')
        $('.overlayContainer').css('transform','translateX(0%)')
        $('.overlay').css('transform','translateX(0)')
        $('.overlayRight').css('transform','translateX(0)')
        $('.overlayLeft').css('transform','translateX(-20%)')
      },
      //用户登录
      async Login(){
        var {name,password} = this.loginForm
        if(password && name){
          var params = new FormData()
          params.append('name',name)
          params.append('password',password)
          axios.post('http://192.168.3.7:8218/user-server/login',params)
            .then(response => {
              var result = response.data
              if(result && result.code === 200){
                this.resertForm('loginForm')
                //登录成功，将用户信息以及登录时间戳保存在本地，因为登录时效为1小时，所以需要加入时间戳用于之后的判断
                localStorage.setItem('RUANJIANBEI_USER',JSON.stringify({user:result.data,time:new Date().getTime()}))
                this.$router.replace({name:'company'})
              }else{
                if(result.msg){
                  this.message(result.msg,'error',1500)
                }else{
                  this.message('登录失败','error',1500)
                }
                this.loginForm.password = ''
              }
            })
            .catch(error => {
              this.message('登录失败','error',1500)
              this.loginForm.password = ''
            })
        }else{
          this.message("请输入账户密码",'warning',1500)
        }
      },
      //显示注册组件，修改对应的样式
      toRegister(){
        $('.signInContainer').css('transform','translateX(100%)')
        $('.signInContainer').css('opacity','0')
        $('.signUpContainer').css('transform','translateX(100%)')
        $('.signUpContainer').css('z-index','5')
        $('.signUpContainer').css('opacity','1')
        $('.overlayContainer').css('transform','translateX(-100%)')
        $('.overlay').css('transform','translateX(50%)')
        $('.overlayRight').css('transform','translateX(20%)')
        $('.overlayLeft').css('transform','translateX(0)')
      },
      //用户注册
      async Register(mobile=false){
        var {name,password,password1} = this.registerForm
        if(password && name && password1){
          if(password === password1){
            var result = await REGISTER({name,password})
            if(result && result.code === 0) {
              if (mobile) {                      //移动端注册成功
                this.loginMobile = true
                this.resertForm('registerForm')
                this.message('注册成功','success',1500)
              } else {                           //pc端注册成功
                this.toLogin()
              }
            }else{
              if(result.msg){
                this.message(result.msg,'error',1500)
              }else{
                this.message('注册失败','error',1500)
              }
              this.registerForm.password1 = ''
            }
          }else{
            this.registerForm.password1 = ''
            this.message("两次密码不相同",'error',1500)
          }
        }else{
          this.message("请输入完整信息",'warning',1500)
        }
      },
      //重置注册表单
      resertForm(formName){
        this.$refs[formName].resetFields();
      },
      //消息提示
      message(message,type,duration){
        this.$message({
          message,
          type,
          duration
        })
      }
    },
  }
</script>

<style lang="less">
  .myLogin{
    display: flex;
    height: 100vh;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    /*背景样式*/
    .myMangeBackground{
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: -1;
      background-size: 100% 100%;
      background-image: url("../../../static/imgs/theme/a.jpg");
      background-repeat: no-repeat;
      transition: 0.2s;
    }
    /*流光字体*/
    @keyframes masked-animation {
      0% {
        background-position: 0 0;   /*background-position 属性设置背景图像的起始位置。*/
      }
      100% {
        background-position: -100% 0;
      }
    }
    .myLoginBigTtitle{
      position: absolute;
      top: 10%;
      text-align: center;
      /*渐变背景*/
      background-image: -webkit-linear-gradient(left, #3498db, #f47920 10%, #d71345 20%, #f7acbc 30%,
      #f7acbc 40%,#3498db 50%, #f47920 60%, #d71345 70%, #f7acbc 80%, #ffd400 90%, #3498db);
      color: transparent;                     /*文字填充色为透明*/
      -webkit-text-fill-color: transparent;
      -webkit-background-clip: text;          /*背景剪裁为文字，只将文字显示为背景*/
      background-size: 200% 100%;             /*背景图片向水平方向扩大一倍，这样background-position才有移动与变化的空间*/
      /* 动画 */
      animation: masked-animation 4s infinite linear;
    }
    /*PC登录注册样式*/
    .loginDivPc{
      position: absolute;
      overflow: hidden;
      width: 768px;
      max-width: 100%;
      min-height: 480px;
      opacity: 0.8;
      border-radius: 10px;
      box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
      .myLoginButton{
        width: 120px;
        border: 0;
      }
      .formContain{
        position: absolute;
        top: 0;
        height: 100%;
        transition: all 0.6s ease-in-out;
        form{
          height: 480px;
          padding: 20px;
          text-align: center;
          background-color: rgba(45,52,54,0.8);
          h1{
            color: rgba(233,233,233);
            margin-bottom: 30px;
          }
          .el-form-item{
            width: 80%;
            margin: 25px auto;
            input{
              height: 50px;
              line-height: 50px;
              padding-top: 8px;
              padding-bottom: 8px;
              border: 0;
              border-bottom: 1px solid white;
              border-radius: 0;
              color: white;
              font-size: 16px;
              font-weight: bold;
              text-align: center;
              /*box-shadow: inset 0 0 0 1000px transparent!important;*/
              background-color: rgba(45, 52, 54, 0);
            }
            /*去掉自动填充时输入框的背景色，通过设置颜色变化动画实现*/
            input:-internal-autofill-previewed,
            input:-internal-autofill-selected {
              -webkit-text-fill-color: #FFFFFF !important;
              transition: background-color 100000s ease-in-out 0s !important;
            }
            .el-input__icon{
              font-size: 20px;
            }
          }
        }
      }
      .signUpContainer{
        top: 0;
        left: 0;
        width: 50%;
        z-index: 1;
        opacity: 0;
      }
      .signInContainer{
        left: 0;
        width: 50%;
        z-index: 2;
      }
      .overlayContainer{
        position: absolute;
        top: 0;
        left: 50%;
        width: 50%;
        height: 100%;
        overflow: hidden;
        transition: transform 0.6s ease-in-out;
        z-index: 100;
        .overlay{
          background: transparent;
          color: white;
          position: absolute;
          left: -100%;
          width: 200%;
          height: 100%;
          transform: translateY(0);
          transition: transform 0.6s ease-in-out;
          .overlayPanel{
            position: absolute;
            top: 0;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100%;
            width: 50%;
            padding: 0px;
            text-align: center;
            transition: transform 0.6s ease-in-out;
          }
          p{
            margin-bottom: 30px;
          }
          .overlayLeft{
            transform: translateX(-20%);
          }
          .overlayRight{
            right: 0;
            transform: translateX(0);
          }
        }
      }
    }
  }
  @media screen and (max-width: 768px){
    .myLogin{
      margin: 0px;
      .loginDivMobile{
        position: absolute;
        overflow: hidden;
        width: 100%;
        padding: 40px 30px 10px 20px;
        transform: translate3d(0,-5%,0);
        .myLoginBigTtitle{
          font-size: 24px;
          position: relative;
          margin-bottom: 20px;
        }
        .loginP{
          height: 40px;
          line-height: 40px;
          text-align: center;
          font-size: 20px;
          font-weight: bold;
          letter-spacing: 5px;
          margin-left: 25px;
          margin-bottom: 20px;
        }
        .el-form-item__label{
          color: black;
          font-weight: bold;
        }
        .el-input__inner{
          border-radius: 10px;
        }
        .myLoginButton{
          height: 40px;
          width:100%;
          padding: 0px 10px;
          border: 0;
        }
      }
    }
  }
</style>

<template>
  <div class="myCompany">
    <div class="myCompanyBackground" />
    <div class="warningDiv animation-flash" v-if="warning"></div>
    <el-drawer
      title="主题"
      :visible.sync="drawer"
      :modal="false"
      direction="rtl"
      class="myDrawer"
      :size="pc?'400px':'200px'"
      >
      <el-image
        class="backImage"
        :src="url"
        @click="changeBackImage(url)"
        v-for="(url,index) in imgUels"
        :key="index"
      />
    </el-drawer>
    <div class="changeBackButton">
      <div>
        <i class="el-icon-menu" @click="drawer=true"></i>
      </div>
    </div>
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: '',
    components: {},
    data () {
      return {
        drawer: false,          //是否打开更改背景图的抽屉
        imgUels:[
          '../../../../static/imgs/theme/a.jpg',
          '../../../../static/imgs/theme/b.jpg',
          '../../../../static/imgs/theme/c.jpg',
          '../../../../static/imgs/theme/d.jpg',
          '../../../../static/imgs/theme/e.jpg',
          '../../../../static/imgs/theme/f.jpg',
          '../../../../static/imgs/theme/g.jpg',
          '../../../../static/imgs/theme/h.jpg',
          '../../../../static/imgs/theme/i.jpg',
        ],
        pc:true,                //检测当前设备为PC还是手机

        warning:false,          //是否警报
        hadReturn:false,        //是否已经有返回值了

        websock:'',             //ws对象
        wsPath:'ws://305451f414c5fc79.natapp.cc:8252/bg_to_fg', //线上ws地址
      }
    },
    methods: {
      //检测当前设备是pc还是移动端
      checkPM(){
        if($(window).width() >= 500){
          this.pc = true
        }else{
          this.pc = false
        }
      },
      //更改背景图
      changeBackImage(url){
        $('.myCompanyBackground').css('background-image', 'url('+ url +')')
      },

      //通过websocket与另外两端连接
      netToOther(){
        var {wsPath} = this
        if ('WebSocket' in window) {
          this.websock = new WebSocket(wsPath)
        } else {
          alert('当前浏览器 Not support websocket')
        }
        this.websock.onmessage = this.websocketonmessage;
        this.websock.onopen = this.websocketonopen;
        this.websock.onerror = this.websocketonerror;
        this.websock.onclose = this.websocketclose;
        //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
        window.onbeforeunload = function () {
          this.websocket.close()
        }
      },
      websocketonopen(){            //连接建立之后执行send方法发送数据
        console.log('已连接')
      },
      websocketonerror(){           //连接建立失败重连
        if(this.getWebsock){
          this.netToOther();
        }
      },
      websocketonmessage(e){        //数据接收
        var data = JSON.parse(e.data)
        console.log(data)
        console.log(e)
        if(data.alarmFlag == 1 && !this.hadReturn){
          this.hadReturn = true
          this.$alert(data.aeResult+','+'支持站内消息预警与站外邮件预警', '分析结果', {
            confirmButtonText: '确定',
            callback: action => {

            }
          });
        }else if(data.alarmFlag == 0 && !this.hadReturn){
          this.warning = true
          this.hadReturn = true
          this.$alert(data.aeResult+','+'支持站内消息预警与站外邮件预警', '预警', {
            confirmButtonText: '确定',
            callback: action => {
              this.warning = false
            }
          });
        }
      },
      websocketsend(Data){//数据发送
        //this.websock.send(Data)
      },
      websocketclose(e){  //关闭
        console.log('断开连接',e);
      },
    },
    watch: {
      //监听控制修改背景图样式的变量
      drawer(newval,oldval){
        var right = 0              //根据pc/移动端设置不同的右边距
        if(newval){                //打开修改样式的抽屉，则按钮也要向左移动400px
          if(this.pc){
            right = 404
          }else{
            right = 204
          }
          $('.changeBackButton').css('right',right)
        }else{                      //关闭修改样式的抽屉，则按钮也要向右移动400px回到原始位置
          $('.changeBackButton').css('right',8)
        }
      },
      hadReturn(newval,oldval){
        if(newval){
          setTimeout(()=>{
            this.hadReturn = false
          },10000)
        }
      }
    },

    mounted () {
      this.checkPM()                   //获取当前的设备类型
      $('.myCompanyBackground').css('background-image', 'url(../../../../static/imgs/theme/a.jpg)')   //默认背景图为第一张
      window.addEventListener("resize",()=>{
        this.checkPM()                 //屏幕大小发生变化后需要及时更新当前网页宽度大小来判断设备类型
      })
      this.netToOther()                      //通过websocket与另外两端连接
    },
  }
</script>

<style lang="less">
  /*写pc端的悬浮样式，移动端不用写*/
  @media (any-hover: hover){
    /*修改背景按钮*/
    .changeBackButton{
      i{
        animation: rotate 3s linear infinite;
        cursor: pointer;
      }
    }
  }
  .myCompany{
    position: relative;
    /*背景样式*/
    .myCompanyBackground{
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: -100;
      background-size: 100% 100%;
      background-repeat: no-repeat;
      transition: 0.2s;
    }
    .warningDiv {
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      box-sizing: border-box;
      background-color: #F56C6C;
      z-index: -9;
    }
    .animation-flash {
      animation: myfirst 0.6s linear;
      -webkit-animation: myfirst 0.6s linear;
      animation-iteration-count:infinite;
      -webkit-animation-iteration-count:infinite;
    }
    @keyframes myfirst{
      0%   { opacity:1; }
      25%  { opacity:0.85; }
      50%  { opacity:0.75; }
      75%  { opacity:0.65; }
      100% { opacity:0.25; }
    }
    @-webkit-keyframes myfirst{
      0%   { opacity:1; }
      25%  { opacity:0.85; }
      50%  { opacity:0.65; }
      75%  { opacity:0.65; }
      100% { opacity:0.25; }
    }
    /*修改背景按钮*/
    .changeBackButton{
      position: absolute;
      right: 8px;
      top: 100px;
      transition: 0.3s;
      z-index: 2;
      div{
        height: 30px;
        width: 30px;
        border-radius: 10px;
        background-color: rgba(0,0,0,0.3);
        i{
          font-size: 30px;
        }
      }
    }
    /*背景图抽屉样式*/
    .myDrawer{
      /*抽屉弹出层样式*/
      .el-drawer{
        background-color: rgba(255,255,255,0.7);  /*设置透明度*/
        .el-drawer__header{
          span{
            color: black;
          }
        }                   /*标题设置为黑色*/
      }
      /*抽屉中背景图片样式*/
      .backImage{
        width: 80px;
        height: 80px;
        margin: 10px;
        &:hover{
          cursor: pointer;
          border: 2px solid rgb(166,199,255);
          box-sizing: border-box;
        }
      }
    }
  }
  @media screen and(max-width: 499px){
    /*背景图抽屉样式*/
    .myDrawer{
      /*修改抽屉展示的样式图大小*/
      .backImage{
        width: 40px;
        height: 40px;
        margin: 5px;
      }
      /*修改抽屉头部的下边距*/
      .el-drawer .el-drawer__header{
        margin-bottom: 10px;
      }
    }
  }
  /*去掉选中抽屉的蓝色边框以及打开抽屉时自动选中标题时的蓝色边框*/
  .el-drawer,.el-drawer .el-drawer__header span:focus {
    outline: 0;
  }
</style>

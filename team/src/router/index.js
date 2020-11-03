import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

import {
  MessageBox
} from 'element-ui'

/*为了解决动态保存查询条件时导致同一个路由多次添加而报错的问题*/
const VueRouterPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (to) {
  return VueRouterPush.call(this, to).catch(err => err)
}

var router =  new VueRouter({
  routes:[
    {
      path:'/company',
      name:'company',
      component:() => import('../pages/company/index'),
      children:[
        {
          path:'manage',
          name:'manage',
          meta:{
            auth:true
          },
          component: () => import('../pages/company/manage/Manage'),
          children:[
            {
              path:'mainpage',
              name:'mainPage',
              meta:{
                auth:true
              },
              component: () => import('../pages/company/manage/MainPage'),
            },
            {
              path:'examplelist',
              name:'ExampleList',
              meta:{
                auth:true
              },
              component: () => import('../pages/company/manage/Examples/ExampleList'),
            },
            {
              path:'exampledetail',
              name:'ExampleDetail',
              meta:{
                auth:true
              },
              component: () => import('../pages/company/manage/Examples/ExampleDetail'),
            },
            {
              path:'uploadexample',
              name:'UploadExample',
              meta:{
                keepAlive:true,
                auth:true
              },
              component: () => import('../pages/company/manage/Examples/UploadExample'),
            },
            {
              path:'sourcelist',
              name:'SourceList',
              meta:{
                auth:true
              },
              component: () => import('../pages/company/manage/Sources/SourceList'),
            },
            {
              path:'sourcedetail',
              name:'SourceDetail',
              meta:{
                auth:true
              },
              component: () => import('../pages/company/manage/Sources/SourceDetail'),
            },
            {
              path:'modellist',
              name:'ModelList',
              meta:{
                auth:true
              },
              component: () => import('../pages/company/manage/Models/ModelList'),
            },
            {
              path:'modeldetail',
              name:'ModelDetail',
              meta:{
                auth:true
              },
              component: () => import('../pages/company/manage/Models/ModelDetail'),
            },
            {
              path:'uploadmodel',
              name:'UploadModel',
              meta:{
                auth:true
              },
              component: () => import('../pages/company/manage/Models/UploadModel'),
            },
            {
              path:'analyzelist',
              name:'AnalyzeList',
              meta:{
                auth:true
              },
              component: () => import('../pages/company/manage/Analyzes/AnalyzeList'),
            },
            {
              path:'analyzedetail',
              name:'AnalyzeDetail',
              meta:{
                auth:true
              },
              component: () => import('../pages/company/manage/Analyzes/AnalyzeDetail'),
            },
            {
              path:'one',
              name:'One',
              meta:{
                auth:true
              },
              component: () => import('../pages/company/manage/Web/One'),
            },
            {
              path:'two',
              name:'Two',
              meta:{
                auth:true
              },
              component: () => import('../pages/company/manage/Web/Two'),
            },
            {
              path:'userlist',
              name:'UserList',
              meta:{
                auth:true
              },
              component: () => import('../pages/company/manage/Users/UserList'),
            },
            {
              path:'userdetail',
              name:'UserDetail',
              meta:{
                auth:true
              },
              component: () => import('../pages/company/manage/Users/UserDetail'),
            },
            {
              path:'uploaduser',
              name:'UploadUser',
              meta:{
                auth:true
              },
              component: () => import('../pages/company/manage/Users/UploadUser'),
            },
          ],
          redirect:{name: 'mainPage'}
        },
      ],
       redirect:{name: 'manage'}
    },
    {
      path:'/login',
      name:'login',
      component:() => import('../pages/login/Login')
    },
    {
      path:'/error',
      name:'error',
      component:() => import('../pages/error/Error')
    },
    {
      path:'/',
      redirect:{name:'login'}
    },
    {
      path:'',
      redirect:{name:'login'}
    },
    {
      path:'*',
      redirect:{name:'error'}
    },
  ]
})

router.beforeEach(function(to, from, next) {
  if (to.meta.auth) {                                              //跳转的页面需要登录
    if(localStorage.getItem('RUANJIANBEI_USER')){
      let auth = JSON.parse(localStorage.getItem('RUANJIANBEI_USER') || '[]')
      if (!auth || !auth.time) {                                   //验证是否登录过,没登录过，返回登录界面
        if(from.path != '/login'){
          router.replace({name:'login'})
        }
      }else{                                                       //曾经登录过，判断是否失效,失效一小时
        if(new Date().getTime() - auth.time < 60 * 60 * 1000){     //之前登录过，未失效
          return next()
        }else{                                                     //之前登录过，但失效了
          MessageBox.alert('用户登录已过期，请重新登录', '警告', {
            confirmButtonText: '确定',
          }).then(()=>{
            if(from.path != '/login'){
              router.replace({name:'login'})
            }
          })
        }
      }
    }else{
      if(from.path != '/login'){
        router.replace({name:'login'})
      }
    }
  } else {
    return next()
  }
})

export default router

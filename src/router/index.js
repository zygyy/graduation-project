import Vue from 'vue'
import Router from 'vue-router'
//导入组件
import Login from '@/components/Login'
import Home from '@/components/Home'
import Welcome from '@/components/Welcome'
import User from '@/components/user/User'
import Grade from '@/components/grade/Grade'
import Total from '@/components/total/Total'
import Myself from '@/components/myself/Myself'
import Rights from '@/components/rights/Rights'
import BBS from  '@/components/BBS/BBS'


Vue.use(Router)

const router= new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path:'/login',
      component:Login
    },
    {
      path:'/home',
      component:Home,
      redirect: '/welcome',
      children:[
        {
          path:'/welcome',
          component:Welcome,
        },
        {
          path:'/users',
          component:User
        },
        {
          path:'/grade',
          component:Grade
        },
        {
          path:'/total',
          component:Total,
        },
        {
          path:'/myself',
          component:Myself,
        },
        {
          path:'/rights',
          component:Rights
        },
        {
          path:'/bbs',
          component:BBS
        }
      ]
    }
  ]
})


//挂载路由导航守卫
router.beforeEach((to, from, next) => {
  //to将要访问的路径,from代表从哪个路径跳转而来,next()是一个函数:表示放行
  if (to.path === '/login') {
    //如果访问登录页面之间放行
    return next();
  } else {
    //先获取token
    const token = window.sessionStorage.getItem('token');
    if (!token) {
      return next('/login');
    } else {
      next();
    }
  }
})

export default router

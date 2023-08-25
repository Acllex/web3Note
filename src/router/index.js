import Vue from 'vue'
import VueRouter from 'vue-router'
import Auth from '@/apis/auth'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/notebooks'
  },
  {
    path: '/login',
    name: 'Login',
    component: ()=>import('../views/Login')
  },
  {
    path: '/notebooks',
    component: ()=>import('../views/NotebookList')
  },
  {
    path: '/note',
    component: ()=>import('../views/NoteDetail')
  },
  {
    path: '/trash',
    component: ()=>import('../views/TrashDetail')
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})
router.beforeEach(async (to,from,next)=>{
  if (to.path === '/login') return next();
  const {isLogin} = await Auth.getInfo();
  if (!isLogin) return next('/login');
  next();
})
export default router

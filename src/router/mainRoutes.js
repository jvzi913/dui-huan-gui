import Vue from 'vue'
import Router from 'vue-router'
import Leftslide from '@/components/Leftslide.vue'
import Login from '@/components/Login.vue'
import Forgetpas from '@/components/Forgetpas.vue'
import Index from '@/components/Index.vue'
import Teacher from '@/components/Teacher.vue'
import Grade from '@/components/Grade.vue'
import Classes from '@/components/Classes.vue'
import Student from '@/components/Student.vue'
import Goods from '@/components/Goods.vue'
import Advertise from '@/components/Advertise.vue'
import Record from '@/components/Record.vue'
import Person from '@/components/Person.vue'


Vue.use(Router)
Vue.use(Leftslide)
Vue.use(Login)
Vue.use(Forgetpas)
Vue.use(Index)
Vue.use(Teacher)
Vue.use(Grade)
Vue.use(Classes)
Vue.use(Student)
Vue.use(Goods)
Vue.use(Advertise)
Vue.use(Record)
Vue.use(Person)

//push
const VueRouterPush = Router.prototype.push
Router.prototype.push = function push(to) {
  return VueRouterPush.call(this, to).catch(err => err)
}

//replace
const VueRouterReplace = Router.prototype.replace
Router.prototype.replace = function replace(to) {
  return VueRouterReplace.call(this, to).catch(err => err)
}

const router = new Router({
  routes: [{
      path: '',
      redirect: '/Login'
    },
    {
      path: '/Leftslide',
      component: Leftslide,
      redirect: '/Index',
      name: 'Leftslide',
      meta: {
        title: '侧边栏',
        needLogin: false
      },
      children: [{
          path: '/Index',
          component: Index,
          name: 'Index',
          meta: {
            title: '首页'
          }
        },
        {
          path: '/Teacher',
          component: Teacher,
          name: 'Teacher',
          meta: {
            title: '教师管理'
          }
        },
        {
          path: '/Grade',
          component: Grade,
          name: 'Grade',
          meta: {
            title: '年级管理'
          }
        },
        {
          path: '/Classes',
          component: Classes,
          name: 'Classes',
          meta: {
            title: '班级管理'
          }
        },
        {
          path: '/Student/:id',
          component: Student,
          name: 'Student',
          meta: {
            title: '学生管理'
          }
        },
        {
          path: '/Goods',
          component: Goods,
          name: 'Goods',
          meta: {
            title: '商品管理'
          }
        },
        {
          path: '/Advertise',
          component: Advertise,
          name: 'Advertise',
          meta: {
            title: '广告管理'
          }
        },
        {
          path: '/Record',
          component: Record,
          name: 'Record',
          meta: {
            title: '兑换记录'
          }
        },
        {
          path: '/Person',
          component: Person,
          name: 'Person',
          meta: {
            title: '个人信息'
          }
        }
      ]
    },
    {
      path: '/Login',
      component: Login,
      name: 'Login',
      meta: {
        title: '登录',
        needLogin: false
      }
    },
    {
      path: '/Forgetpas',
      component: Forgetpas,
      name: 'Forgetpas',
      meta: {
        title: '找回密码'
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
	//路由中设置的needLogin字段就在to当中
	if (localStorage.getItem('userInfo')!=null||localStorage.getItem('userInfo')!=undefined) {
		if (to.path == '/Login') {
			next({
				path: '/Leftslide'
			});
		} else {
			next();
		}
	} else {
		if (to.path == '/Login'||to.path =='/Forgetpas') { // 如果是登录页面的话，直接next() -->解决注销后的循环执行bug
			next();
		}else { // 否则 跳转到登录页面
			next({
				path: '/Login'
			});
		}
	}
})

export default router

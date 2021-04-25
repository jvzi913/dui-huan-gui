// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router/mainRoutes.js'; //引入所有路由
import rem from './assets/js/rem.js'; //引入rem的js
import './assets/icon/iconfont.css'; //引入阿里巴巴图标
import iconfont from './assets/css/iconfont.css'; //引入阿里巴巴图标
//请求方式
import Axios from 'axios'
Vue.prototype.$axios = Axios;
//引入element-ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

// 引入URL
import globalAPI from './util/globalAPI';
Vue.prototype.$globalAPI = globalAPI.commonUrl;

//引入导出表格的相关js
import Blob from './assets/excel/Blob.js';
import Export2Excel from './assets/excel/Export2Excel.js';
//引入导入表格的相关js
import XLSX from 'xlsx';
Vue.prototype.XLSX = XLSX;
//使用less
import less from 'less';
Vue.use(less);

Vue.config.productionTip = false; //判断是否为生产模式
Vue.use(ElementUI);

//监听locationStorage个人信息的变化
Vue.prototype.resetSetItem = function(key, newVal) {
  if (key === 'userInfo') {

    // 创建一个StorageEvent事件
    var newStorageEvent = document.createEvent('StorageEvent');
    const storage = {
      setItem: function(k, val) {
        localStorage.setItem(k, val);

        // 初始化创建的事件
        newStorageEvent.initStorageEvent('setItem', false, false, k, null, val, null, null);

        // 派发对象
        window.dispatchEvent(newStorageEvent)
      }
    }
    return storage.setItem(key, newVal);
  }
}
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})

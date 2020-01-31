import Vue from 'vue'
import App from './App.vue'
import router from './router'
/* import './plugins/element.js' */

/* 导入全局样式表 */
import './assets/css/global.css'
/* 导入icon图标 */
import './assets/fonts/iconfont.css'
/* 导入NProgress包   顶部进度条 */
import NProgress from 'nprogress'
/* 导入axios */
import axios from 'axios'
/* 配置请求的根路径 */
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
/* axios  request请求拦截   展示进度条*/
axios.interceptors.request.use(config => {
  NProgress.start()
  /* 为请求头对象，添加Token验证的Authorization字段 */
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
/* axios  response请求拦截   隐藏进度条*/
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})
Vue.prototype.$http = axios
Vue.config.productionTip = false

/* 树型表格插件 */
import TreeTable from 'vue-table-with-tree-grid'
Vue.component('tree-table', TreeTable)

/* 年月日插件 */
Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMonth() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

/* 富文本插件 */
import VueQuillEditor from 'vue-quill-editor'
Vue.use(VueQuillEditor)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

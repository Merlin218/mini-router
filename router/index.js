import { ref, inject } from 'vue';
import RouterLink from './RouterLink.vue';
import RouterView from './RouterView.vue';
const ROUTER_KEY = Symbol('router')

function createRouter(options) {
  return new Router(options);
}

function useRouter() {
  return inject(ROUTER_KEY);
}

function createWebHashHistory() {
  function bindEvents(fn) {
    window.addEventListener('hashchange', fn);
  }
  return {
    bindEvents,
    url: window.location.hash.slice(1) || '/', // 当前有hash，截取掉'#'，否则 '/'
  }
}

class Router {
  constructor(options) {
    this.history = options.history; // 通过createWebHashHistory()创建的history
    this.routes = options.routes; // 路由列表
    this.current = ref(this.history.url); // 当前的路由

    // 监听到路由变化时，更新current，然后也会触发路由组件的切换
    this.history.bindEvents(() => {
      this.current.value = window.location.hash.slice(1)
    })
  }
  install(app) {
    app.provide(ROUTER_KEY, this);
    app.component('router-view', RouterView)
    app.component('router-link', RouterLink)
  }
}

export { createRouter, useRouter, createWebHashHistory }

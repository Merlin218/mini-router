# mini-router

## 核心代码

路径：router目录下

### 实现功能
- [x] createRouter
- [x] createWebHashHistory（hash模块）
- [x] router-view router-link

## 实现原理

首先，vue-router实现的是无刷新的页面跳转和视图更新。

![](https://cdn.jsdelivr.net/gh/Merlin218/image-storage/picGo/202204111044344.png)


这种所有路由都渲染一个前端入口文件的方式，是单页面应用程序（SPA，single page application）应用的雏形。

在浏览器环境下的两种方式，通过URL区分路由分别是在 `HTML5 history` 和 `HashHistory` 两个类中实现的，分别对应 `history` 和 `hash` 模式，在`vue-router`中分别是 createWebHistory 和 createWebHashHistory 。

![](https://cdn.jsdelivr.net/gh/Merlin218/image-storage/picGo/202204111048502.png)

### Hash模式

- hash（#）符号的本来作用是锚点，指向页面中的某个位置
- hash虽然出现在URL中，但不会被包含在HTTP请求中。它只是用来指导浏览器动作的，对服务端完全无用，所以改变hash不会导致浏览器页面的刷新，只会触发`hashchange` 事件。
- 每次改变hash（`window.location.hash`），都会在浏览器的访问地址中新增一个记录

```js
window.addEventListener('hashchange', cb, false);
```

### History模式

在HTML5中，新增了 pushState 和 replaceState 两个API，用过这两个API，我们可以改变URL地址，但不会向服务端发送请求，这样我们就能用这种方式实现前端路由。

这种模式可以通过监听 `popstate` 事件，监听通过 `popstate` 修改路由的变化，并且在实现cb函数中，实现页面的更新。

```js
window.addEventListener('popstate', cb, false);
```

## vue-router源码解析

### vue-router入口

在vue-router4中，提供了 **createRouter** 的方法来创建路由的实例。我们可以看看都完成了哪些事情?[源码地址](https://github.com/vuejs/router/blob/main/src/router.ts#L355)

- 入口
	- routerOptions规范了我们配置的路由对象，包括了history（路由模式）、routes（所有的路由关系）等。
- 返回值
	- 返回一个包括了`addRoute`、`push`、`beforeEnter`、`install`等方法和`currentRoute`和`options`等属性的对象。

### install方法

**install** 方法实际就是vue提供的安装插件的机制，我们看一下是如何在vue应用中注入路由的。
- 注册全局组件`router-view`和`router-link`；
- 把`$router`加入到全局的属性`app.config.globalProperties`中，值为该路由实例；
- 把`$route`加入到全局属性中，值为使用`defineProperty`的形式返回`currentRoute`的`value`，可以做到实时同步；
- 使用 computed 把currentRoute变成响应式对象，存储在 reactiveRoute 对象中，再通过 app.provide 给全局注册了 `router` 和 `reactive 包裹后的 reactiveRoute 对象`。（provide 提供的数据并没有做响应式的封装）
- 最后就是重写app.unmount逻辑，添加了移除router的过程。


### router-view和router-link

RouterView 的 setup 函数返回了一个函数，这个函数就是 RouterView 组件的 render 函数。

大部分我们使用的方式就是一个组件，没有 slot 情况下返回的就是 component 变量。

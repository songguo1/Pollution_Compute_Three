import Vue from "vue";
import VueRouter from "vue-router";
import home from "../views/home/Home";
import Analysis from "../views/PollutionAnalysis/index";

Vue.use(VueRouter);

const routes = [
  {
    path: "/register",
    name: "register",
    component: () => import("../views/Register/Register"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/Login/Login"),
  },
  {
    path: "/",
    name: "main",
    component: () => import("../views/Main"),
    children: [
      {
        path: "/",
        redirect: "home", // 添加重定向
      },
      {
        path: "home",
        name: "home",
        component: home,
      },
      {
        path: "pollutionanalysis/:code/:name",
        name: "pollutionanalysis",
        component: Analysis,
      },
      

      {
        path: "projectlist",
        name: "projectlist",
        component: () => import("../views/ProjectList/index"),
      },

      {
        path: "pollutionthree/:code/:name",
        name: "threedimensional",
        component: () => import("../views/ThreeDimensional/index"),
      },
      {
        path: "infoshow",
        name: "infoshow",
        component: () => import("../views/InfoShow/index"),
      },
    ],
  },

  {
    path: "*",
    name: "404",
    component: () => import("../views/404/404.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

//路由守卫

router.beforeEach((to, from, next) => {
  const isLogin = localStorage.getItem('mytoken') ? true : false;
  if (to.path === "/login" || to.path === "/register") {
    next();
  } else {
    isLogin ? next() : next({ path: '/login' }); // 使用路由对象
  }
});

export default router;

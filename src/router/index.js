import { createWebHashHistory, createRouter } from "../../router";
import AVue from "../components/A.vue";
import BVue from "../components/B.vue";

const routes = [
  {
    path:'/a',
    component:AVue
  },
  {
    path:'/b',
    component:BVue
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router;

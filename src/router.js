import Vue from 'vue'
import Router from 'vue-router'
import Index from './views/Index.vue'
import AddSmoothie from '@/views/AddSmoothie'
import EditSmoothie from '@/views/EditSmoothie'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index
    },

    {
      path: '/add-smoothie',
      name: 'add smoothie',
      component: AddSmoothie
    },

    {
      path: '/edit-smoothie/:smoothie_slug',
      name: 'edit smoothie',
      component: EditSmoothie
    }
  ]
})

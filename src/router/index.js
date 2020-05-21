import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../pages/home'

Vue.use(VueRouter);

export default new VueRouter({
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/home',
            name: 'home',
            component: Home
        },
        {
            path: '/login',
            name: 'login',
            component: ()=>import('../pages/login')
        }
    ]
})
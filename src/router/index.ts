import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import HomePage from '../pages/HomePage.vue';
import AddReviewPage from '../pages/AddReviewPage.vue';
import ReviewDetailPage from '../pages/ReviewDetailPage.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/add-review',
    name: 'AddReview',
    component: AddReviewPage
  },
  {
    path: '/review/:id',
    name: 'ReviewDetail',
    component: ReviewDetailPage
  },
  {
    path: '/edit-review/:id',
    name: 'EditReview',
    component: AddReviewPage
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router

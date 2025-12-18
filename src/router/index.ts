import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import GameView from '@/views/GameView.vue';
import SummaryView from '@/views/SummaryView.vue';

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/game', name: 'game', component: GameView },
  { path: '/summary', name: 'summary', component: SummaryView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
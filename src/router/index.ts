import { createRouter, createWebHistory } from 'vue-router'
import RaidBuilder from '@/pages/RaidBuilder.vue'
import CharacterManager from '@/pages/CharacterManager.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'raid-builder',
      component: RaidBuilder,
    },
    {
      path: '/characters',
      name: 'characters',
      component: CharacterManager,
    },
  ],
})

export default router

import { createRouter, createWebHashHistory } from 'vue-router'
import MainMenu from '../views/MainMenu.vue'
import GameBoard from '../views/GameBoard.vue'
import Statistics from '../views/Statistics.vue'
import Preferences from '../views/Preferences.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: MainMenu },
    { path: '/game', component: GameBoard },
    { path: '/statistics', component: Statistics },
    { path: '/preferences', component: Preferences }
  ]
})

export default router

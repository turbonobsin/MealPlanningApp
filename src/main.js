import './assets/main.css'

import { computed, createApp, ref } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useProfilesStore } from './stores/profiles'
import { applyTheme } from './stores/states'

const app = createApp(App)

app.use(createPinia())
app.use(router)

document.addEventListener('keydown', e => {
    if (e.key === 'b' && e.ctrlKey){
        document.body.classList.toggle("border");
        // document.body.classList.toggle("dark-theme");
    }
})

if (!localStorage.theme){
    localStorage.setItem('theme', 'default_theme');
    localStorage.setItem('mode', 'light');
}
else{
    applyTheme();
}

app.mount('#app')

const profileStore = useProfilesStore();
profileStore.initProfiles();
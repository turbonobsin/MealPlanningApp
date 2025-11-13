import './assets/main.css'

import { computed, createApp, ref } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useProfilesStore } from './stores/profiles'

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
    localStorage.setItem('theme', 'light_mode');
}
else{
    if (localStorage.getItem('theme') === 'dark_mode'){
        document.body.classList.add('dark_mode');
    }
}

app.mount('#app')

const profileStore = useProfilesStore();
profileStore.initProfiles();
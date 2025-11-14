<script setup>
import Create_Profile from '@/components/settings/Create_Profile.vue';
import { provide, ref } from 'vue';
import { useProfilesStore } from '@/stores/profiles';
import Switch_Profile from '@/components/settings/Switch_Profile.vue';
import Delete_Profile from '@/components/settings/Delete_Profile.vue';
import Dev_Tools from '@/components/settings/Dev_Tools.vue';

const show_create_window = ref(false);
const show_switch_window = ref(false);
const show_delete_window = ref(false);
const show_dev_window = ref(false);
const profile_store = useProfilesStore();
const current_theme = ref((localStorage.getItem('theme')));

provide('show_create_window', show_create_window);
provide('show_switch_window', show_switch_window);
provide('show_delete_window', show_delete_window);
provide('show_dev_window', show_dev_window);

let counter = 0;
const showDevTools = ref(false);

function switchTheme(){
    if (counter >= 0){
        counter++;
    }
    if (counter == 15){
        showDevTools.value = true;
        counter = -1;
    }
    
    if (localStorage.getItem('theme') === 'light_mode'){
        document.body.classList.add('dark_mode');
        localStorage.setItem('theme', 'dark_mode');
        current_theme.value = 'dark_mode';
    }
    else {
        document.body.classList.remove('dark_mode');
        localStorage.setItem('theme', 'light_mode');
        current_theme.value = 'light_mode';
    }
}

</script>

<template>
    <h1 class="space_after">Settings</h1>
    <main>
        <div class="circle" :style="{'background-color': profile_store.currentProfile.color}"></div>
        <h2 class="text-center gap-after">{{profile_store.currentProfile.name}}</h2>
        <div class="menu-list">
            <div class="material-symbols-outlined">account_circle</div>
            <RouterLink class="setting" to="/profile">Configure Profile</RouterLink>
            <div class="material-symbols-outlined">swap_horiz</div>
            <span class="setting" @click="show_switch_window=true">Switch Profile</span>
            <div class="material-symbols-outlined">add_circle</div>
            <span class="setting" @click="show_create_window=true">Create New Profile</span>
            <div class="material-symbols-outlined">{{ current_theme }}</div>
            <span class="setting" @click="switchTheme">Change Theme</span>
            <div class="material-symbols-outlined red-text">delete_forever</div>
            <span class="setting red-text" @click="show_delete_window=true">Delete Profile</span>
            <div v-if="showDevTools" class="material-symbols-outlined">build</div>
            <span v-if="showDevTools" class="setting" @click="show_dev_window=true">Developer Tools</span>
        </div>
    </main>
    <Create_Profile v-if="show_create_window"></Create_Profile>
    <Switch_Profile v-if="show_switch_window"></Switch_Profile>
    <Delete_Profile v-if="show_delete_window"></Delete_Profile>
    <Dev_Tools v-if="show_dev_window"></Dev_Tools>
</template>

<style scoped>

.menu-list{
    display: grid;
    grid-template-columns: auto 1fr;
    column-gap: 10px;
    align-items: center;
}

.circle{
    height: 100px;
    align-self: center;
    border: 4px solid var(--dark);
}

h2{
    margin-top: 10px;
}

.setting{
    display: block;
    margin: 10px 0px;
    text-decoration: none;
    color: var(--dark);
    /* border-bottom: 1px solid var(--light-color); */
}
</style>
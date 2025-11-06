<script setup>
import Create_Profile from '@/components/Create_Profile.vue';
import { provide, ref } from 'vue';
import { useProfilesStore } from '@/stores/profiles';
import Switch_Profile from '@/components/Switch_Profile.vue';
import Delete_Profile from '@/components/Delete_Profile.vue';

const show_create_window = ref(false);
const show_switch_window = ref(false);
const show_delete_window = ref(false);
const profile_store = useProfilesStore();
const current_theme = ref((localStorage.getItem('theme')));

provide('show_create_window', show_create_window);
provide('show_switch_window', show_switch_window);
provide('show_delete_window', show_delete_window);

function switchTheme(){
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
        </div>
    </main>
    <Create_Profile v-if="show_create_window"></Create_Profile>
    <Switch_Profile v-if="show_switch_window"></Switch_Profile>
    <Delete_Profile v-if="show_delete_window"></Delete_Profile>
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
<script setup>
import Create_Profile from '@/components/settings/Create_Profile.vue';
import { computed, provide, ref } from 'vue';
import { useProfilesStore } from '@/stores/profiles';
import Switch_Profile from '@/components/settings/Switch_Profile.vue';
import Delete_Profile from '@/components/settings/Delete_Profile.vue';
import Dev_Tools from '@/components/settings/Dev_Tools.vue';
import { applyTheme } from '@/stores/states';

const show_create_window = ref(false);
const show_switch_window = ref(false);
const show_delete_window = ref(false);
const show_dev_window = ref(false);
const expand_themes = ref(false);
const profile_store = useProfilesStore();
const current_theme = ref((localStorage.getItem('theme')));

provide('show_create_window', show_create_window);
provide('show_switch_window', show_switch_window);
provide('show_delete_window', show_delete_window);
provide('show_dev_window', show_dev_window);

let counter = 0;
const showDevTools = ref(false);

const lightMode = ref(localStorage.getItem('mode'));
const colorMode = ref(localStorage.getItem('theme'));

// function switchTheme(){
//     if (counter >= 0){
//         counter++;
//     }
//     if (counter == 10){
//         showDevTools.value = true;
//         counter = -1;
//     }
    
//     if (localStorage.getItem('theme') === 'light_mode'){
//         document.body.classList.add('dark_mode');
//         localStorage.setItem('theme', 'dark_mode');
//         current_theme.value = 'dark_mode';
//     }
//     else {
//         document.body.classList.remove('dark_mode');
//         localStorage.setItem('theme', 'light_mode');
//         current_theme.value = 'light_mode';
//     }
// }

function changeMode(s){
    // console.log(lightMode.value);
    if (localStorage.getItem('mode') !== s){
        localStorage.setItem('mode', s);
        applyTheme();
        lightMode.value = s;
    }
}

function changeTheme(s){
    localStorage.setItem('theme', s);
    applyTheme();
    colorMode.value = s;
}

</script>

<template>
    <h1 class="space_after">Settings</h1>
    <main class="center" style="margin-top: 100px">
        <div class="circle" :style="{'background-color': profile_store.currentProfile.color}">{{ profile_store.currentProfile.name[0] }}</div>
        <h2 class="text-center gap-after">{{profile_store.currentProfile.name}}</h2>
        <div class="menu-list">
            <div class="h-center gap10">
                <div class="material-symbols-outlined">account_circle</div>
                <RouterLink class="setting" to="/profile">Configure Profile</RouterLink>
            </div>
            <div class="h-center gap10" @click="show_switch_window=true">
                <div class="material-symbols-outlined">swap_horiz</div>
                <span class="setting">Switch Profile</span>
            </div>
            <div class="h-center gap10" @click="show_create_window=true">
                <div class="material-symbols-outlined">add_circle</div>
                <span class="setting">Create New Profile</span>
            </div>
            <div class="h-center gap10" @click="expand_themes = !expand_themes" style="margin-left: 0px">
                <div class="material-symbols-outlined">colors</div>
                <span class="setting">Change Theme</span>
                <div class="material-symbols-outlined">{{ (!expand_themes) ? 'keyboard_arrow_down' : 'keyboard_arrow_up'}}</div>
            </div>

            <div :class="{'theme-window': true, 'expanded': expand_themes}">
                <div class="spread h-center space-after">
                    <span>Mode:</span>
                    <div class="flex gap10 h-center">
                        <span :class="{'material-symbols-outlined': true, 'mode-icon': true, 'selected-mode': lightMode === 'light'}" @click="changeMode('light')">light_mode</span>
                        <span :class="{'material-symbols-outlined': true, 'mode-icon': true, 'selected-mode': lightMode === 'dark'}" @click="changeMode('dark')">dark_mode</span>
                    </div>
                </div>
                <div class="spread h-center space-after">
                    <span>Color:</span>
                    <div class="themes h-center gap10">
                        <div @click="changeTheme('default_theme')" style="background-color: #6A8B52;" :class="{'material-symbols-outlined': true, 'selected-color': colorMode === 'default_theme'}">eco</div>
                        <div @click="changeTheme('cold_theme')" style="background-color: #5f8ec4;" :class="{'material-symbols-outlined': true, 'selected-color': colorMode === 'cold_theme'}">ac_unit</div>
                        <div @click="changeTheme('hot_theme')" style="background-color: #e5804e;" :class="{'material-symbols-outlined': true, 'selected-color': colorMode === 'hot_theme'}">mode_heat</div>
                    </div>
                </div>
            </div>

            <div class="h-center gap10" @click="show_delete_window=true" style="margin-top: -10px">
                <div class="material-symbols-outlined red-text">delete_forever</div>
                <span class="setting red-text">Delete Profile</span>
            </div>
            <div class="h-center gap10">

            </div>
            <div class="h-center gap10">
                <div v-if="showDevTools" class="material-symbols-outlined">build</div>
                <span v-if="showDevTools" class="setting" @click="show_dev_window=true">Developer Tools</span>
            </div>
        </div>
    </main>
    <Switch_Profile v-if="show_switch_window"></Switch_Profile>
    <Create_Profile v-if="show_create_window"></Create_Profile>
    <Delete_Profile v-if="show_delete_window"></Delete_Profile>
    <Dev_Tools v-if="show_dev_window"></Dev_Tools>
</template>

<style scoped>

.menu-list{
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}

.menu-list > div{
    margin-left: -15px;
}

.circle{
    height: 100px;
    align-self: center;
    border: 4px solid var(--dark);
    display: flex;;
    align-items: center;
    justify-content: center;
    color: var(--light-perma);
    font-size: 2rem;
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

.theme-window{
    width: 130%;
    margin-left: 0px !important;
    max-height: 0px;
    overflow: hidden;
    padding: 0px 5px;
    transition: max-height .3s ease-in-out;
}

.expanded{
    max-height: 400px;
    /* transform: scaleY(1); */
}

.mode-icon{
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    aspect-ratio: 1;
    padding: 5px;
    font-size: 1.4rem;
    line-height: 0px;
    /* height: 35px;
    width: 35px;
    text-align: center; */
}

.selected-mode{
    background-color: var(--dark);
    color: var(--light);
    animation: pop .2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.themes div{
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--light-perma);
    font-weight: lighter;
    border-radius: 50%;
    height: 30px;
    width: 30px;
    /* border: 2px solid var(--dark); */
}

.selected-color{
    outline: 2px solid var(--dark);
    animation: pop .2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

</style>
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

provide('show_create_window', show_create_window);
provide('show_switch_window', show_switch_window);
provide('show_delete_window', show_delete_window);

</script>

<template>
    <h1 class="space_after">Settings</h1>
    <main>
        <div class="circle" :style="{'background-color': profile_store.currentProfile.color}"></div>
        <h2 class="text-center">{{profile_store.currentProfile.name}}</h2>
        <div>
            <RouterLink class="setting" to="/profile">Configure Profile</RouterLink>
            <span class="setting" @click="show_switch_window=true">Switch Profile</span>
            <span class="setting" @click="show_create_window=true">Create New Profile</span>
            <span class="setting">Change Theme</span>
            <span class="setting red-text" @click="show_delete_window=true">Delete Profile</span>
        </div>
    </main>
    <Create_Profile v-if="show_create_window"></Create_Profile>
    <Switch_Profile v-if="show_switch_window"></Switch_Profile>
    <Delete_Profile v-if="show_delete_window"></Delete_Profile>
</template>

<style scoped>
.circle{
    height: 100px;
    align-self: center;
}

h2{
    margin-top: 10px;
}

.setting{
    display: block;
    margin: 20px 0px;
    text-decoration: none;
    color: var(--dark);
    /* border-bottom: 1px solid var(--light-color); */
}
</style>
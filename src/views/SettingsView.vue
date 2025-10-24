<script setup>
import Create_Profile from '@/components/Create_Profile.vue';
import { provide, ref } from 'vue';
import { useProfilesStore } from '@/stores/profiles';

const show_create_profile = ref(false);
const profile_store = useProfilesStore();

provide('show_window', show_create_profile);

// onMounted(() => {
//     show_create_profile.value = false;
// });
</script>

<template>
    <h1 class="space_after">Settings</h1>
    <main>
        <img class="profile_display" src="/Placeholder_Image.png"></img>
        <h2 class="text-center">{{profile_store.currentProfile.name}}</h2>
        <div>
            <span class="setting">Configure Profile</span>
            <span class="setting">Switch Profile</span>
            <span class="setting" @click="show_create_profile=true">Create New Profile</span>
            <span class="setting">Change Theme</span>
            <span id="delete_profile" class="setting">Delete Profile</span>
        </div>
    </main>
    <Create_Profile v-if="show_create_profile"></Create_Profile>
</template>

<style scoped>
.profile_display{
    height: 100px;
    aspect-ratio: 1;
    border-radius: 50%;
    align-self: center;
}

h2{
    margin-top: 10px;
}

.setting{
    display: block;
    margin: 20px 0px;
    /* border-bottom: 1px solid var(--light-color); */
}

#delete_profile{
    color: var(--red);
}
</style>
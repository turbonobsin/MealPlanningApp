<script setup>
import { useProfilesStore } from '@/stores/profiles';
import { inject } from 'vue';

const profile_store = useProfilesStore();
const show_dev_window = inject('show_dev_window')

function clearRecentSearches(){
    profile_store.currentProfile.recentSearches = [];
    profile_store.saveProfile();
    console.log("Cleared recentSearches");
}

</script>


<template>
    <div class="backdrop"></div>
    <div class="pop-window vertical gap10">
        <h3>Developer Tools</h3>
        <button class="red-button" @click="clearRecentSearches">Clear recentSearches</button>
        <button class="blank-button" @click="show_dev_window = false">Close</button>
    </div>
</template>

<style scoped>
</style>
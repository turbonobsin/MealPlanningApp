<script setup>
import { useProfilesStore } from '@/stores/profiles';
import { inject } from 'vue';

const profile_store = useProfilesStore();
const show_delete_window = inject('show_delete_window');


</script>

<template>
    <div class="backdrop"></div>
    <div class="pop-window vertical">
        <h3>Confirm Delete</h3>
        <div class="h-center">
            <div class="profile-icon"></div>
            <span>{{ profile_store.currentProfile.name }}</span>
        </div>
        <p>Are you sure you want to permanently delete this profile?</p>
        <div class="two-grid">
            <button class="blank-button" @click="show_delete_window=false">Cancel</button>
            <button class="red-button">Delete Profile</button>
        </div>
    </div>
</template>

<style scoped>

.vertical{
    gap: 15px;
}

.vertical > * {
    margin: unset;
}

.two-grid{
    grid-template-columns: .8fr 1.2fr;
}

</style>
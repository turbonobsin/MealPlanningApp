<script setup>
import { useProfilesStore } from '@/stores/profiles';
import { inject } from 'vue';
/*import { removeProfile } from '@/backend/removeProfile';*/

const profile_store = useProfilesStore();
const show_delete_window = inject('show_delete_window');

function confirmDelete() {
    const current = profile_store.currentProfile;
    if (!current) {
        return;
    }
    /*removeProfile(current);*/
    profile_store.removeProfile(current);
    show_delete_window.value = false;
}


</script>

<template>
    <div class="backdrop" @click.stop="show_delete_window = false"></div>
    <div class="pop-window vertical">
        <h3>Confirm Delete</h3>
        <div class="h-center">
            <div class="profile-icon" :style="{'background-color': profile_store.currentProfile.color}">{{ profile_store.currentProfile.name[0] }}</div>
            <span>{{ profile_store.currentProfile.name }}</span>
        </div>
        <p>Are you sure you want to permanently delete this profile?</p>
        <div class="two-grid">
            <button class="blank-button" @click="show_delete_window=false">Cancel</button>
            <button class="red-button" @click="confirmDelete">Delete Profile</button>
        </div>
    </div>
</template>

<style scoped>

.vertical{
    gap: 15px;
    align-items: center;
}

.h-center{
    position: relative;
    left: -5px;
}

.vertical > * {
    margin: unset;
}

.two-grid{
    grid-template-columns: .8fr 1.2fr;
    width: 100%;
}

</style>


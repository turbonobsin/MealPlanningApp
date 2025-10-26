<script setup>
import { inject, ref, useTemplateRef } from 'vue';
import { useProfilesStore } from '@/stores/profiles';

const show_create_window = inject('show_create_window');
const name_input = useTemplateRef('name_input');
const show_note = ref(false);

const profile_store = useProfilesStore();
// console.log(localStorage.profiles);

function createProfile(){
    let name = name_input.value.value;
    if (name){
        if (profile_store.profiles.some(v => v.name === name)){
            name_input.value.style.borderColor = 'var(--red)';
            show_note.value = true;
            setTimeout(() => {
                name_input.value.style.borderColor = 'revert';
                show_note.value = false;
            }, 3000);
        }
        else{
            profile_store.createDefaultProfile(name_input.value.value);
            show_create_window.value = false;
        }
    }
}

</script>

<template>
    <div class="backdrop"></div>
    <div class="pop-window vertical">
        <h3>Create New Profile</h3>
        <label for="new_name" class="text-center small">Profile Name:</label>
        <input ref="name_input" class="text-input"></input>
        <span class="small red-text" v-if="show_note">Name is already used!</span>
        <div class="two-grid space-before">
            <button class="blank-button" @click="show_create_window = false">Cancel</button>
            <button class="color-button" @click="createProfile()">Create</button>
        </div>
    </div>
</template>

<style scoped>
    .red-text{
        margin-top: 5px;
        padding-left: 10px;
    }
</style>
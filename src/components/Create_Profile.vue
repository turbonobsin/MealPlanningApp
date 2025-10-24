<script setup>
import { inject, useTemplateRef } from 'vue';
import { useProfilesStore } from '@/stores/profiles';

const show_window = inject('show_window');
const name_input = useTemplateRef('name_input');

const profile_store = useProfilesStore();

function createProfile(){
    if (name_input.value.value){
        profile_store.createDefaultProfile(name_input.value.value);
        show_window.value = false;
    }
}

</script>

<template>
    <div id="backdrop"></div>
    <div id="new_profile_window" class="vertical">
        <h3 class="space-after">Create New Profile</h3>
        <label for="new_name" class="text-center small">Profile Name:</label>
        <input ref="name_input" class="space-after text-input"></input>
        <div class="two-grid">
            <button class="blank-button" @click="show_window = false">Cancel</button>
            <button class="green-button" @click="createProfile()">Create</button>
        </div>
    </div>
</template>

<style scoped>

#new_profile_window{
    position: fixed;
    top: 30%;
    right: 40px;
    left: 40px;
    background-color: var(--light);
    border: 3px solid var(--dark);
    border-radius: 10px;
    padding: 15px;
    margin: auto;
    z-index: 2;
    animation: pop .3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

#backdrop{
    position: absolute;
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    background-color: var(--dark);
    opacity: .8;
    z-index: 1;
    animation: fade-in .2s linear;
}

h3{
    text-align: center;
    margin: 0px 0px 10px 0px;
}

</style>
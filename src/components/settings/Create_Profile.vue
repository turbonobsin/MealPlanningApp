<script setup>
import { inject, ref, useTemplateRef } from 'vue';
import { useProfilesStore } from '@/stores/profiles';

const show_create_window = inject('show_create_window');
const name_input = useTemplateRef('name_input');
const color_input = useTemplateRef('color_input');
const show_note = ref(false);

const profile_store = useProfilesStore();
// console.log(localStorage.profiles);

function createProfile(){
    let name = name_input.value.value;
    let color = color_input.value.value;
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
            profile_store.createDefaultProfile(name, color);
            show_create_window.value = false;
        }
    }
}

</script>

<template>
    <div class="backdrop"></div>
    <div class="pop-window vertical">
        <h3>Create New Profile</h3>
        <div class="h-center">
            <div class="circle color-container center">
                <input ref="color_input" type="color" class="color-input" value="#6A8B52"></input>
                <div class="material-symbols-outlined edit-icon">edit</div>
            </div>

            <div class="name-container vertical">
                <label for="new_name" class="small">Profile Name:</label>
                <input ref="name_input" class="text-input"></input>
            </div>
        </div>
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

    .color-container{
        height: 4em;
        flex-shrink: 0;
        overflow: hidden;
        position: relative;
    }

    .edit-icon{
        position: absolute;
        color: var(--light-perma);
        pointer-events: none;
    }

    .color-input{
        height: 7em;
        width: 7em;
        position: absolute;
    }

    .h-center{
        gap: 10px;
    }

    .text-input{
        /* flex-shrink: 1; */
        width: 100%;
        flex-grow: 1;
    }

</style>
<script setup>
import { useProfilesStore } from '@/stores/profiles';
import { storeToRefs } from 'pinia';
import { ref, useTemplateRef } from 'vue';
import { useRouter } from 'vue-router';

const profile_store = useProfilesStore();
const { currentProfile } = storeToRefs(profile_store);

const intolerances = ref(["Dairy", "Egg", "Gluten", "Grain", "Peanut", "Seafood", "Sesame", "Shellfish", "Soy", "Sulfite", "Tree Nut", "Wheat"]);


const edit_color = ref(false);
const edit_mode = ref(false);
const excludeInput = useTemplateRef('exclude_input');

const router = useRouter();

function toggleItem(item){
    let removed = false;
    currentProfile.value.allergies.forEach((elm, ind) => {
        if (elm === item){
            currentProfile.value.allergies.splice(ind, 1);
            removed = true;
        }
    });
    if (!removed){
        currentProfile.value.allergies.push(item);
    }
    // console.log(profile_store.currentProfile.allergies);
    profile_store.saveProfile();
}

const name_input = useTemplateRef('name_input');

function updateName(){
    
    if (name_input.value.value !== currentProfile.value.name){
        let allowed = true;
        for (let item of profile_store.profiles){
            if (item.name === name_input.value.value){
                allowed = false;
                break;
            }

        }
        if (allowed){
            profile_store.renameProfile(name_input.value.value);
            edit_mode.value = false;
        }
        else {
            name_input.value.style.borderColor = 'var(--red)';
            setTimeout(() => {
                name_input.value.style.borderColor = 'revert';
            }, 2000);
        }
    }
    else {
        edit_mode.value = false;
    }

}

function convertHexTo6(hex){
    if(hex.length != 7){
        let [r,g,b] = hex.replace("#","").split("");
        return `#${r}${r}${g}${g}${b}${b}`;
    }
    return hex;
}

const colorInput = useTemplateRef("color_input");

function toggleColorEdit(e){
    edit_color.value = !edit_color.value;

    if(edit_color.value){
        setTimeout(()=>{
            colorInput.value.click();
        },20);
    }

    else{
        currentProfile.value.color = colorInput.value.value;
        profile_store.saveProfile();
    }
}

function addExclusion(){
    let s = excludeInput.value.value;
    if (s){
        if (s.includes(',')){
            s = s.replaceAll(',', '');
        }
        let exclusions = s.split(" ");
        exclusions.forEach(item => {
            if (item){
                currentProfile.value.exclusions.push(item);
            }
        });
        profile_store.saveProfile();
        excludeInput.value.value = '';
    }
}

function removeExclusion(i){
    currentProfile.value.exclusions.splice(i, 1);
    profile_store.saveProfile();
}

</script>

<template>
    <div class="h-center">
        <div class="material-symbols-outlined xxxlarge back" @click="router.back()">chevron_left</div>
        <h1 class="title">Profile Page</h1>
    </div>
    <main class="scroll-main">
        <div class="circle-container" style="position:relative">
            <div class="profile-color center circle">
                <input ref="color_input" :disabled="!edit_color" type="color" id="profile_color" class="circle" :value="convertHexTo6(currentProfile.color)"></input>
            </div>
            <div :class="{'material-symbols-outlined': true, 'color-edit': true, 'circle': true, 'center': true, 'enabled': edit_color}" @click="toggleColorEdit">{{ (edit_color) ? 'check' : 'edit'}}</div>
            <div v-show="edit_color" class="material-symbols-outlined color-edit cancel circle center" @click="edit_color=false">close</div>
        </div>

        <div class="h-center">
            <h2 id="profile_name" v-show="!edit_mode">{{currentProfile.name}}</h2>
            <input ref="name_input" class="text-input edit-text" v-show="edit_mode" :value="currentProfile.name"></input>
            <div v-show="!edit_mode" class="material-symbols-outlined" @click="edit_mode=!edit_mode">edit</div>
            <button v-show="edit_mode" id="save" class="color-button h-center update-button" @click="updateName">
                <div class="material-symbols-outlined">check</div>
            </button>
            <button v-show="edit_mode" class="blank-button h-center update-button" @click="edit_mode = !edit_mode">
                <div class="material-symbols-outlined">close</div>
            </button>
        </div>

        <h3>Intolerances</h3>
        <div class="flex-wrap space-after">
            <div v-for="item in intolerances" @click="toggleItem(item)" 
            :class="{'list-item': true, 'small': true, 'selected': currentProfile.allergies.find(v => v === item)}">
                {{ item }}
            </div>
        </div>

        <h3>Exclude Ingredients</h3>
        <div class="text-input-button space-after">
            <input ref="exclude_input" class="text-input" placeholder="Ex. Celery, Apple, Beef..." @keypress.enter="addExclusion"></input>
            <button class="dark-button small" @click="addExclusion">Exclude</button>
        </div>
        <div class="flex-wrap">
            <div class="small list-item h-center spread medium-button" v-for="(item, i) in currentProfile.exclusions">
                <span>{{ item }}</span>
                <span class="material-symbols-outlined small" @click="removeExclusion(i)">close</span>
            </div>
        </div>
    </main>
</template>

<style scoped>

.circle-container{
    width:5em;
    height:5em;
    margin-inline: auto;
}

.profile-color{
    overflow: hidden;
    height: 5em;
    align-self: center;
    position:relative;
    outline: 4px solid var(--dark);
}

.back{
    position: absolute;
    left: .6em;
}

.color-edit{
    background-color: var(--dark);
    color: var(--light);
    font-size: 1.2em;
    padding: .3em;
    right:-.5em;
    bottom:-.3em;
    position:absolute;
    border: 2px solid var(--dark);
    flex-shrink: 0;
    flex-grow: 0;
    aspect-ratio: 1;
}

.cancel{
    right: unset;
    left: -.5em;
    bottom: -.3em;
    background-color: var(--light);
    color: var(--dark);
    border-color: var(--medium);
    animation: pop .2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.enabled{
    background-color: var(--main-color);
    border-color: var(--main-color);
    animation: pop .2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

#profile_color{
    border: none;
    border-radius: 50%;
    width: 5em;
    height: 5em;
    scale: 2;
    position: relative;
}

.list-item{
    display: inline-flex;
    padding: 5px 10px;
    border-radius: 5px;
    border: 2px solid var(--medium);
    flex-grow:1;
    max-width: 50%;
}

.selected{
    background-color: var(--main-color);
    border-color: var(--main-color) !important;
    color: var(--light-perma);
    animation: pop 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.h-center{
    gap: 10px;
    align-self: center;
}

.edit-text{
    field-sizing: content;
    font-size: 1.5em;
    font-weight: bold;
    text-align: center;
    height: unset;
    margin-block-end: 0.83em;
    margin-block-start: 0.83em;
    padding: 0px 7px;
}

#profile_name{
    border: 2px solid transparent;
    padding: 0px 5px;
}

.update-button{
    padding: 3px;
}

#save{
    border: 2px solid var(--main-color);
}

</style>
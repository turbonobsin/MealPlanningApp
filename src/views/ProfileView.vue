<script setup>
import { useProfilesStore } from '@/stores/profiles';
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';

const profile_store = useProfilesStore();
const { currentProfile } = storeToRefs(profile_store);

const intolerances = ref(["Dairy", "Egg", "Gluten", "Grain", "Peanut", "Seafood", "Sesame", "Shellfish", "Soy", "Sulfite", "Tree Nut", "Wheat"]);

const edit_mode = ref(false);

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



</script>

<template>
    <h1>Profile Page</h1>
    <main>
        <img class="circle" src="/Placeholder_Image.png"></img>
        <div class="h-center">
            <h2 id="profile_name" v-show="!edit_mode">{{currentProfile.name}}</h2>
            <input class="text-input edit-text" v-show="edit_mode" :value="currentProfile.name"></input>
            <div v-show="!edit_mode" class="material-symbols-outlined" @click="edit_mode=!edit_mode">edit</div>
            <div class="h-center">
                <button v-show="edit_mode" id="save" class="color-button h-center update-button" @click="updateName">
                    <div class="material-symbols-outlined">check</div>
                </button>
                <button v-show="edit_mode" class="blank-button h-center update-button" @click="edit_mode = !edit_mode">
                    <div class="material-symbols-outlined">close</div>
                </button>
            </div>
        </div>
        <h3>Intolerances</h3>
        <div class="flex-wrap">
            <div v-for="item in intolerances" @click="toggleItem(item)" :class="{'list-item': true, 'small': true, 'selected': currentProfile.allergies.find(v => v === item)}">{{ item }}</div>
        </div>
        <h3>Exclude Ingredients</h3>
    </main>
</template>

<style scoped>

.circle{
    height: 100px;
    align-self: center;
}

.flex-wrap{
    display: flex;
    flex-wrap: wrap;
    justify-content: stretch;
    gap: 10px;
}

.list-item{
    display: inline-block;
    padding: 5px 10px;
    border-radius: 5px;
    border: 2px solid var(--medium);
}

.selected{
    background-color: var(--main-color);
    border-color: var(--main-color);
    color: var(--light);
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
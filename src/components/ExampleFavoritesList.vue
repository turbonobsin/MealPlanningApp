<script>
import { useProfilesStore } from '@/stores/profiles';
import FavoriteRecipe from './FavoriteRecipe.vue';
import { ref } from 'vue';


const profileStore = useProfilesStore();

function onclick(){
    let item = profileStore.currentProfile.favorites.items[0];
    if(typeof item == "number"){
        // it's a recipe
        
    }
    else{
        // it's a folder
        // item.name
        // item.items
    }
}


const currentFolder = ref(profileStore.currentProfile.favorites.items);

</script>

<template>
    <div id="menu_bar">

    </div>
    <button @click="onclick">CLick</button>

    <div class="list">
        <div v-for="item in currentFolder">
            <div v-if="typeof item == 'number'">
                <FavoriteRecipe :recipe="getRecipe(item)"></FavoriteRecipe>
            </div>
            <div v-else @click="currentFolder = item">
                <div>Folder name: {{ item.name }}</div>
            </div>
        </div>
    </div>
</template>

<style scoped>
</style>
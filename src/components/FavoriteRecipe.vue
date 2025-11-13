<script setup lang="ts">
import { Recipe, useProfilesStore } from '@/stores/profiles';
import { ref } from 'vue';
import AddRecipeToCalMenu from './calendar/AddRecipeToCalMenu.vue';
import { useRouter } from 'vue-router';


const props = defineProps<{
    recipe:Recipe
}>();
// console.log(props.recipe);

const profile_store = useProfilesStore();
const router = useRouter();

const addToCalendarMenuOpen = ref(false);
const addToCalendarRecipe = ref();

function addToCalendar(e, recipe) {
    e.stopPropagation();
	console.log("Added to Calendar")
	// console.log(items.value)

	// calendarStore.addRecipe(recipe.id,prompt("Enter mealType: 'breakfast', 'lunch', 'dinner'",'lunch'),new Date());
	addToCalendarMenuOpen.value = true;
	addToCalendarRecipe.value = recipe;
}

function gotoRecipeDetails(item){
  router.push({
    path:`/details/${item}`
  });
}

const title = props.recipe.title;

let displayName = (function () {
    if (title.length > 50){
        return title.slice(0, 50) + "..."
    }
    else return title
})();


</script>

<template>
    <div v-if="recipe" class="recipe">
        <img class="recipe-image" :src="recipe.image" @click="gotoRecipeDetails(props.recipe.id)"></img>
        <div @click="gotoRecipeDetails(props.recipe.id)">
            <div class="smaller" style="font-weight: 600">{{ displayName }}</div>
            <div class="small">{{ recipe.cookingMinutes }}</div>
        </div>
        <div class="spread vertical" style="margin-left:auto">
            <div class="material-symbols-outlined" @click="addToCalendar($event, props.recipe)">add</div>
            <slot></slot>
        </div>
        <AddRecipeToCalMenu v-if="addToCalendarMenuOpen" v-model="addToCalendarMenuOpen" :recipe="addToCalendarRecipe" :date="new Date()"></AddRecipeToCalMenu>
    </div>
    <div v-else>
        Not Available
    </div>

</template> 

<style scoped>

.recipe{
    display: flex;
    height: 80px;
    gap: 10px;
}

.recipe-image {
    /* border-radius: 5px; */
    width: 35%;
    object-fit: cover;
    /* outline: 3px solid var(--medium); */
    margin: -10px 0px -10px -10px;
}


</style>
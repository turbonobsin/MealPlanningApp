<script setup lang="ts">
import { CalendarDate, DateMeal, MealType, useProfilesStore } from '@/stores/profiles';
import { computed, provide, ref } from 'vue';
import CalRecipeOptionsMenu from './CalRecipeOptionsMenu.vue';
import AddRecipeToCalMenu from './AddRecipeToCalMenu.vue';

const profileStore = useProfilesStore();

const props = defineProps<{
    data?:CalendarDate;
    meal?:DateMeal;
    heading:string;
    date:Date;
}>();

const recipe = computed(()=>{
    return profileStore.getRecipeData(props.meal?.recipeId);
});

// const headings = ref<Record<MealType,string>>({
//     breakfast:"Breakfast",
//     lunch:"Lunch",
//     dinner:"Dinner"
// });

const optionsOpen = ref(false);

</script>

<template>
    <div class="meal-item">
        <CalRecipeOptionsMenu v-if="optionsOpen" v-model="optionsOpen" :recipe :date :time="new Date(meal.time)" :meal-type="meal.mealType"></CalRecipeOptionsMenu>
        <div class="meal-column">
            <div class="flx-sb flx-ac">
                <h3>{{ heading }}</h3>
                <div v-if="recipe" class="material-symbols-outlined configure-meal" @click="optionsOpen = true">settings</div>
            </div>
            <div v-if="recipe">
                <h4>{{ new Date(meal.time).toLocaleString([],{timeStyle:'short'}) }}</h4>
                <div class="flx-ac title" style="gap:5px" v-if="recipe">
                    <div>{{ recipe.title }}</div>
                    <!-- <div class="material-symbols-outlined remove-recipe" @click="calendarStore.removeRecipe(selectedDate,meal.mealType)">close</div> -->
                </div>
            </div>
            <div v-else>
                Nothing planned yet.
            </div>
            <!-- <slot name="meal" :meal="meal" :data="data" :recipe="profileStore.getRecipeData(calData?.breakfast.recipeId)"></slot> -->
        </div>
        <!-- <div></div> -->
        <!-- <slot name="img" :recipe="profileStore.getRecipeData(calData?.breakfast.recipeId)"></slot> -->
        <img v-if="recipe" :src="recipe.image"></img>
    </div>
    <!-- <div v-else>
        <div class="meal-column">
            <div class="flx-sb flx-ac">
                <h3>{{ heading }}</h3>
            </div>
            <div class="flx-ac title" style="gap:5px" v-if="recipe">
                Nothing yet.
            </div>
        </div>
    </div> -->
</template>

<style scoped>

.configure-meal{

}

.remove-recipe{
    background-color:var(--light);
    color:var(--dark);
    border-radius:50%;
    font-size:14px;
    padding:5px;
    font-weight:bold;
    position:absolute;
    top:0px;
    right:0px;
    /* translate:25% -25%; */
    translate:50% -50%;
    border:solid 2px var(--dark);
}

.title{
    flex-direction:column;
    padding:0.5em;
    /* margin:-0.5em; */
    background-color:var(--dark);
    color:var(--light);
    border-radius:5px;
    font-size:15px;
    position:relative;
    flex-grow:1;
}

.meal-item img{
    border-radius:5px;
    margin-top:auto;
}

.meal-item{
    display:grid;
    grid-template-columns:1fr 0.8fr;
    gap:0.5em;
    min-height:100px;
}

.flx-ac{
    display:flex;
    align-items:center;
}

.flx-sb{
    display:flex;
    justify-content:space-between;
}

.meal-item h3{
    margin-block:0.25em;
}
.meal-item h4{
    margin-block:0.25em;
    margin-bottom:1em;
}

</style>
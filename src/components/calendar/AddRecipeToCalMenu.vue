<script setup lang="ts">
import { useCalendarStore } from '@/stores/calendar';
import { CalendarDate, MealType, Recipe, useProfilesStore } from '@/stores/profiles';
import { mealHours } from '@/util';
import { computed, inject, onMounted, ref, useTemplateRef } from 'vue';

const isOpen = defineModel({type:Boolean});
const profileStore = useProfilesStore();
const calendarStore = useCalendarStore();

const props = defineProps<{
    recipe:Recipe;
    date:Date;
    // mealType:MealType;
    // time:Date;
}>();

const time = computed(()=>{
    return props.date;
});

const addDate = computed(()=>{
    // let d = new Date(props.date);
    
    // if(props.mealType == "breakfast"){

    // }
});

const mealType = ref<MealType>("breakfast");

const date = ref(new Date());

const dateInput = useTemplateRef("date-input");

function updateDateInput(){
    let d = new Date(date.value);
    console.log("date",d);
    // d.setHours(mealHours[mealType.value]);
    d.setHours(mealHours[mealType.value] - d.getTimezoneOffset()/60);
    date.value.setHours(mealHours[mealType.value]);
    date.value.setMinutes(0);
    d.setMinutes(0);
    dateInput.value.value = d.toISOString().slice(0,16);
}

onMounted(()=>{
    updateDateInput();
});

</script>

<template>
    <div class="backdrop"></div>
    <div class="pop-window vertical">
        <h3>Add Recipe to Calendar</h3>
        <label for="recipe-title">Recipe</label>
        <h3 id="recipe-title space-after">
            {{ recipe.title }}
        </h3>
        <label for="recipe-time">Time</label>
        <!-- <h4>{{ date.toLocaleString([],{dateStyle:'short'}) }}, {{ time.toLocaleString([],{timeStyle:'short'}) }}</h4> -->
        <input type="datetime-local" name="recipe-time" id="recipe-time" class="text-input space-after" ref="date-input" @change="date = new Date(($event.target as any).value)">
        <!-- <input type="date" name="recipe-time" id="recipe-time" class="text-input space-after" ref="date"> -->

        <label for="recipe-meal-type">Meal</label>
        <select name="recipe-meal-type" id="recipe-meal-type" class="text-input" @change="updateDateInput" v-model="mealType">
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
        </select>
        <br>
        
        <button class="color-button" @click="calendarStore.addRecipe(recipe.id,mealType,date); isOpen = false">Add to Calendar</button>
        <button class="blank-button" @click="isOpen = false">Cancel</button>
    </div>
</template>

<style scoped>

.vertical{
    gap: 10px;
}

.note{
    font-size: small;
    font-style: italic;
    color: var(--main-color);
    text-align: right;
}

.profiles-list{
    padding: 10px;
    padding-right: 20px;
}

</style>
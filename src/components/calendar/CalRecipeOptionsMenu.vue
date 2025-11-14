<script setup lang="ts">
import { useCalendarStore } from '@/stores/calendar';
import { CalendarDate, MealType, Recipe, useProfilesStore } from '@/stores/profiles';
import { inject, onMounted, Ref, useTemplateRef } from 'vue';

const isOpen = defineModel({type:Boolean});
const profileStore = useProfilesStore();
const calendarStore = useCalendarStore();

const props = defineProps<{
    recipe:Recipe;
    mealType:MealType;
    date:Date;
    time:Date;
}>();

const addToCalendarMenuOpen = inject<Ref<boolean>>("addToCalendarMenuOpen");
const addToCalendarRecipe = inject<Ref<Recipe>>("addToCalendarRecipe");
const addToCalendarDate = inject<Ref<Date>>("addToCalendarDate");
const addToCalendarMealType = inject<Ref<MealType>>("addToCalendarMealType");

function openEdit(){
    isOpen.value = true;
    addToCalendarMenuOpen.value = true;
    addToCalendarRecipe.value = props.recipe;
    addToCalendarDate.value = props.date;
    addToCalendarMealType.value = props.mealType;
}

</script>

<template>
    <div class="recipe-options-menu">
        <div class="backdrop"></div>
        <div class="pop-window vertical">
            <h3>Planned Recipe</h3>
            <div>
                {{ recipe.title }}
            </div>
            <div>for {{ date.toLocaleString([],{dateStyle:'short'}) }} at {{ time.toLocaleString([],{timeStyle:'short'}) }}</div>
            <br>
            <button class="color-button" @click="openEdit">Edit</button>
            <button class="red-button" @click="calendarStore.removeRecipe(date,mealType); isOpen = false">Delete</button>
            <br>
            <button class="blank-button" @click="isOpen = false">Cancel</button>
        </div>
    </div>
</template>

<style scoped>

.recipe-options-menu{
    position:fixed;
    top:0px;
    left:0px;
    z-index:1;
    /* height:max-content; */
}

.vertical{
    gap: 10px;
    /* max-height:unset; */
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
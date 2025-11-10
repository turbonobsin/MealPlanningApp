<script setup lang="ts">
import { useCalendarStore } from '@/stores/calendar';
import { CalendarDate, MealType, Recipe, useProfilesStore } from '@/stores/profiles';
import { inject, onMounted, useTemplateRef } from 'vue';

const isOpen = defineModel({type:Boolean});
const profileStore = useProfilesStore();
const calendarStore = useCalendarStore();

const props = defineProps<{
    recipe:Recipe;
    mealType:MealType;
    date:Date;
    time:Date;
}>();

const addToCalendarMenuOpen = inject("addToCalendarMenuOpen");

</script>

<template>
    <div class="backdrop"></div>
    <div class="pop-window vertical">
        <h3>Planned Recipe</h3>
        <div>
            {{ recipe.title }}
        </div>
        <div>for {{ date.toLocaleString([],{dateStyle:'short'}) }} at {{ time.toLocaleString([],{timeStyle:'short'}) }}</div>
        <br>
        <button class="color-button" @click="isOpen = true; addToCalendarMenuOpen = true">Edit</button>
        <button class="red-button" @click="calendarStore.removeRecipe(date,mealType); isOpen = false">Delete</button>
        <br>
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
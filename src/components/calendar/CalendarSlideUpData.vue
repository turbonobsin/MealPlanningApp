<script setup lang="ts">
import { useCalendarStore } from '@/stores/calendar';
import { Recipe, useProfilesStore } from '@/stores/profiles';
import { computed, onMounted, provide, ref } from 'vue';
import CalMealItem from './CalMealItem.vue';
import AddRecipeToCalMenu from './AddRecipeToCalMenu.vue';

const profileStore = useProfilesStore();
const calendarStore = useCalendarStore();

const props = defineProps<{
    date:Date;
}>();

const calData = computed(()=>{
    return calendarStore.getDay(props.date);
});

const recipeId = computed(()=>{
    
});

let data = computed(()=>{
    // return profileStore.getRecipeData(recipeId.value);
});

</script>

<template>
    <div class="slide-up-details">
        <slot :data="calData"></slot>
        <div class="three-col alt-layout">
            <CalMealItem :date heading="Breakfast" :data="calData" :meal="calData?.breakfast"></CalMealItem>
            <CalMealItem :date heading="Lunch" :data="calData" :meal="calData?.lunch"></CalMealItem>
            <CalMealItem :date heading="Dinner" :data="calData" :meal="calData?.dinner"></CalMealItem>
            <!-- <div class="meal-item">
                <div class="meal-column">
                    <h3>Lunch</h3>
                    <slot name="meal" :meal="calData?.lunch" :data="calData" :recipe="profileStore.getRecipeData(calData?.lunch.recipeId)"></slot>
                </div>
                <slot name="img" :recipe="profileStore.getRecipeData(calData?.lunch.recipeId)"></slot>
            </div> -->
            <!-- <div class="meal-column">
                <h3>Dinner</h3>
                <slot name="meal" :meal="calData?.dinner" :data="calData" :recipe="profileStore.getRecipeData(calData?.dinner.recipeId)"></slot>
            </div> -->
            <!-- <div class="meal-column">
                <h3>Breakfast</h3>
                <slot name="breakfast" :meal="calData?.breakfast" :data="calData" :recipe="profileStore.getRecipeData(calData?.breakfast.recipeId)"></slot>
            </div> -->
            <!-- <div class="meal-column">
                <h3>Lunch</h3>
                <slot name="lunch" :meal="calData?.lunch" :data="calData" :recipe="profileStore.getRecipeData(calData?.lunch.recipeId)"></slot>
            </div>
            <div class="meal-column">
                <h3>Dinner</h3>
                <slot name="dinner" :meal="calData?.dinner" :data="calData" :recipe="profileStore.getRecipeData(calData?.dinner.recipeId)"></slot>
            </div> -->
        </div>
    </div>
</template>

<style scoped>

.three-col{
    display:grid;
    grid-template-columns:1fr 1fr 1fr;
    gap:0.25em;
}
.three-col.alt-layout{
    grid-template-columns:unset;
    grid-template-rows:1fr 1fr 1fr;
}

</style>
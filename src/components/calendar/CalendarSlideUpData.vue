<script setup lang="ts">
import { useCalendarStore } from '@/stores/calendar';
import { Recipe, useProfilesStore } from '@/stores/profiles';
import { computed, onMounted, ref } from 'vue';

const profileStore = useProfilesStore();
const calendarStore = useCalendarStore();

const props = defineProps<{
    date:Date;
}>();

const calData = computed(()=>{
    return calendarStore.getDay(props.date.toISOString());
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
    </div>
</template>
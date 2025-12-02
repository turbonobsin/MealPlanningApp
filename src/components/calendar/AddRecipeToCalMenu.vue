<script setup lang="ts">
import router from '@/router';
import { useCalendarStore } from '@/stores/calendar';
import { CalendarDate, MealType, Recipe, useProfilesStore } from '@/stores/profiles';
import { useStateStore } from '@/stores/states';
import { mealHours } from '@/util';
import { computed, inject, onMounted, ref, useTemplateRef } from 'vue';

const isOpen = defineModel({type:Boolean});
const profileStore = useProfilesStore();
const calendarStore = useCalendarStore();
const stateStore = useStateStore();

const props = defineProps<{
    recipe:Recipe;
    date:Date;
    // mealType:MealType;
    // time:Date;
    mode:"edit"|"add";
    customMealType?:MealType;
    customTime?:Date;
}>();

const mode = computed(()=>{
    return props.mode;
});

// const originalRecipe = ref(props.recipe);
// const originalDate = ref(props.date);

const time = computed(()=>{
    return props.date;
});

const addDate = computed(()=>{
    // let d = new Date(props.date);
    
    // if(props.mealType == "breakfast"){

    // }
});

const mealType = ref<MealType>(props.customMealType ?? "breakfast");

// const date = ref(new Date());
const date = ref(props.customTime ?? new Date());

const dateInput = useTemplateRef("date-input");

function updateDateInput(ignoreDefault=false,customTime?:Date){
    let d = new Date(date.value);
    console.log("date",d);
    // d.setHours(mealHours[mealType.value]);
    if(!ignoreDefault){
        let hours = mealHours[mealType.value];
        let minutes = 0;
        if(customTime){
            let t = new Date(customTime);
            // hours = t.getHours();
            // minutes = t.getMinutes();
        }
        d.setHours(hours - d.getTimezoneOffset()/60);
        date.value.setHours(hours);
        date.value.setMinutes(minutes);
        d.setMinutes(minutes);
    }
    try{
        dateInput.value.value = d.toISOString().slice(0,16);
    }
    catch(e){}
}

onMounted(()=>{    
    let today = calendarStore.getDay(props.date);
    if(mode.value == "edit"){
        mealType.value = getOriginalMealType(props.recipe.id);
        console.log("TIME:",new Date(today[mealType.value]?.time).toLocaleTimeString([],{timeStyle:'short'}));
        date.value = new Date(today[mealType.value]?.time ?? undefined);
        updateDateInput(false,date.value);
    }
    else{
        updateDateInput(undefined,props.customTime);
    }
});

const emit = defineEmits<{
    addRecipe:[date:Date]
}>();

function getOriginalMealType(recipeId:number){
    let original = calendarStore.getDay(props.date);
    let fromMealType:MealType = "breakfast";
    if(original.lunch?.recipeId == recipeId) fromMealType = "lunch";
    else if(original.dinner?.recipeId == recipeId) fromMealType = "dinner";
    return fromMealType;
}

async function addToCal(recipe:Recipe,mealType:MealType,date:Date){
    if(mode.value == 'edit'){
        let fromMealType = getOriginalMealType(recipe.id);
        
        calendarStore.removeRecipe(props.date,fromMealType);

        calendarStore.addRecipe(recipe.id,mealType,date);
    }
    else{
        calendarStore.addRecipe(recipe.id,mealType,date);
        isOpen.value = false;
        await router.push({
            name:"calendar",
        });
    }

    emit("addRecipe",date);
    isOpen.value = false;

    if(stateStore.selectingRecipe){
        stateStore.addToCalendarMenuOpen = false;
        stateStore.addToCalendarData = undefined;
        stateStore.selectingRecipe = undefined;
    }
}

// const mode = computed(()=>{
//     let today = calendarStore.getDay(props.date);
//     if(today && today[mealType.value] != undefined) return "edit";
//     return "add";
// });

</script>

<template>
    <div class="backdrop"></div>
    <div class="pop-window vertical">
        <h3>Add Recipe to Calendar</h3>
        <!-- <label for="recipe-title">Recipe</label> -->
        <div class="flex spread gap10 space-before space-after">
            <span class="recipe-title smaller">
                {{ recipe.title }}
            </span>
            <img class="recipe-image" :src="recipe.image"></img>
        </div>

        <div class="vertical space-after">
            <label for="recipe-meal-type">Meal</label>
            <select name="recipe-meal-type" id="recipe-meal-type" class="text-input" @change="updateDateInput(false)" v-model="mealType">
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
            </select>
        </div>

        <div class="vertical gap-after">
            <label for="recipe-time">Time</label>
            <!-- <h4>{{ date.toLocaleString([],{dateStyle:'short'}) }}, {{ time.toLocaleString([],{timeStyle:'short'}) }}</h4> -->
            <input type="datetime-local" name="recipe-time" id="recipe-time" class="text-input" ref="date-input" @change="date = new Date(($event.target as any).value)">
            <!-- <input type="date" name="recipe-time" id="recipe-time" class="text-input space-after" ref="date"> -->
        </div>
        
        <button v-if="mode == 'edit'" class="color-button space-after" @click="addToCal(recipe,mealType,date)">Save</button>
        <button v-else class="color-button space-after" @click="addToCal(recipe,mealType,date)">Add to Calendar</button>
        <button class="blank-button" @click="isOpen = false">Cancel</button>
    </div>
</template>

<style scoped>

.note{
    font-size: small;
    font-style: italic;
    color: var(--main-color);
    text-align: right;
}

.recipe-image{
    width: 30%;
    border-radius: 5px;
    border: 2px solid var(--medium);
}

.recipe-title{
    margin-right: 10px;
    margin-top: 5px;
}

label{
    font-weight: 600;
}

#recipe-meal-type{
    min-height: 35px;
}

</style>
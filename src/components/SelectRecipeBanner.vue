<script setup lang="ts">
import router from '@/router';
import { useCalendarStore } from '@/stores/calendar';
import { useStateStore } from '@/stores/states';
import { mealHours } from '@/util';
import { computed } from 'vue';

const stateStore = useStateStore();
const calendarStore = useCalendarStore();

function cancel(){
    router.push({
        path:stateStore.selectingRecipe.path
    });
    stateStore.selectingRecipe = undefined;
}

function select(){
    let r = stateStore.selectingRecipe;

    // tmp

    // let d = new Date();
    // let mealType = r.meal;
    // let hours = mealHours[mealType];
    // let minutes = 0;
    // d.setHours(hours - d.getTimezoneOffset()/60);
    // d.setMinutes(minutes);

    // 
    
    stateStore.addToCalendarMenuOpen = true;
	stateStore.addToCalendarData = {
		recipe:stateStore.currentRecipe,
		mealType:r.meal,
        // date:d
		date:r.date,
	};
    // calendarStore.addRecipe(stateStore.currentRecipe.id,r.meal,r.date);
}

</script>

<template>
    <div class="select-recipe">
        <div>
            <h3>Select recipe</h3>
            <p>For {{ stateStore.selectingRecipe.meal }}, {{ stateStore.selectingRecipe.date.toLocaleString([],{dateStyle:'short'}) }}</p>
        </div>
        <div class="actions">
            <button class="dark-button" @click="cancel">Cancel</button>
            <button class="dark-button" @click="select" :disabled="stateStore.currentRecipe == undefined">Select</button>
        </div>
	</div>
</template>

<style scoped>

.select-recipe{
    position:fixed;
    top:0px;
    left:0px;
    width:100%;
    padding:0.75em 1em;
    color:var(--light-perma);
    background-color:var(--main-color);
    border-bottom:solid 5px var(--dark);
    box-shadow:0px 5px 5px 0px rgba(0,0,0,0.05);

    display:grid;
    grid-template-columns:auto 1fr;
    align-items:center;
    box-sizing:border-box;

    gap:1em;
}

h3,h4{
    margin:0px;
    margin-bottom:0.25em;
}
p{
    margin:0px;
}

.actions{
    display:flex;
    align-items:center;
    justify-content:end;
    box-sizing:border-box;
    gap:0.5em;
}

</style>
<script setup>
import { useCalendarStore } from '@/stores/calendar';
import { computed, inject } from 'vue';

const calendarStore = useCalendarStore();

const props = defineProps({
    date:Date,
    selectedDate:{
        type:Date,
        required:false
    },
});

const clickDate = inject("clickDate");

const day = computed(()=>{
    return calendarStore.getDay(props.date);
});

</script>

<template>
    <div :class="['date',{selected:selectedDate?.toISOString() == date?.toISOString()}]" @click="clickDate(date)">
        <div>{{ date.getDate() }}</div>
    </div>
    <div class="meals" v-if="day">
        <div class="meal0" :valid="day.breakfast?.recipeId != undefined"></div>
        <div class="meal1" :valid="day.lunch?.recipeId != undefined"></div>
        <div class="meal2" :valid="day.dinner?.recipeId != undefined"></div>
    </div>
</template>

<style scoped>

.meals{
    display:flex;
    gap:3px;
}
.meals > *{
    width:0.4em;
    height:0.4em;
    border-radius:50%;
    background-color:transparent;
    transition:all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    /* outline:solid 2px var(--dark); */
}
.meals > *[valid="true"]{
    background-color:var(--main-color);
    /* outline-color:var(--main-color); */
}

.cal2-nav-buttons{
    font-size:2em;
    margin-inline:0.1em;
}

.calendar-header{
    display:flex;
    align-items:center;
    justify-content:space-between;
}

.calendar2 {
    display: flex;
    flex-wrap: wrap;
    height: max-content;
}

.calendar2 > div {
    width: calc(100% / 7);
    height: 3em;
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
    gap:5px;
    aspect-ratio: 5;
    --accent: transparent;
    --bg: transparent;
}
.calendar2 > div.today {
    --accent: var(--red);
    /* --color: var(--light); */
}
.selected{
    --bg: var(--main-color);
    --color: var(--light-perma);
}

.cal2-day {
    opacity: 0.5;
}

.cal2-date {

}

.cal2-previous-date,
.cal2-after-date {
    opacity:0.5;
}

.date {
    background-color:var(--bg);
    outline:solid 3px var(--accent);
    color:var(--color,inherit);
    width:50%;
    aspect-ratio:1;
    border-radius:50%;
    display:flex;
    align-items:center;
    justify-content:center;
    flex-direction:column;
}

</style>
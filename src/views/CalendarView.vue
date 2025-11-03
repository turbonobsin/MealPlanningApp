<script setup lang="ts">
import CalMonthItem from '@/components/calendar/CalMonthItem.vue';
import { getMonthLength, weekday, weekdayAbbr } from '@/util';
import { computed, ref } from 'vue';

const today = ref(new Date());

const monthOffset = ref(0); // going forward or back by months

let itemCount = ref(3);
// let itemCount = ref(10);

const days = computed(() => {
    let list: {
        d: Date,
        i: number,
        day: number,
        date: number,
        today: boolean
    }[] = [];
    let td = today.value;

    for (let i = -Math.floor(itemCount.value / 2); i < Math.ceil(itemCount.value / 2); i++) {
        let d = new Date(td.getFullYear(), td.getMonth(), td.getDate() + i);
        list.push({
            d,
            i,
            day: d.getDay(),
            date: d.getDate(),
            today: i == 0
        });
    }

    return list;
});

const previousDays = computed(() => {
    let firstDay = thisMonthDate.value;
    return firstDay.getDay();
});

const previousMonthLength = computed(() => {
    let td = today.value;
    return getMonthLength(new Date(td.getFullYear(), td.getMonth() + monthOffset.value - 1, 1, 0, 0, 0, 0));
});

const afterDays = computed(() => {
    let td = today.value;
    let thisMonthLen = getMonthLength(thisMonthDate.value);
    let lastDay = new Date(td.getFullYear(), td.getMonth() + monthOffset.value, thisMonthLen, 0, 0, 0, 0);
    console.log("after days",thisMonthLen,lastDay.getDay(),6 - lastDay.getDay());
    return (6 - lastDay.getDay()) || 7;
});

function navForward(){
    monthOffset.value++;
}
function navBack(){
    monthOffset.value--;
}

const thisMonthDate = computed(()=>{
    let td = today.value;
    return new Date(td.getFullYear(),td.getMonth()+monthOffset.value,1,0,0,0,0);
});

</script>

<template>
    <h1>Calendar</h1>
    <main>
        <header class="calendar-header">
            <h2>{{ thisMonthDate.toLocaleString([], { month: "long" }) }} {{ thisMonthDate.getFullYear() }}</h2>
            <div>
                <button @click="navBack" class="material-symbols-outlined cal2-nav-buttons">arrow_left</button>
                <button @click="navForward" class="material-symbols-outlined cal2-nav-buttons">arrow_right</button>
            </div>
        </header>
        <div class="calendar2">
            <div v-for="day in weekdayAbbr" class="cal2-day">
                {{ day }}
            </div>
            <div v-for="i in previousDays" class="cal2-previous-date">
                {{ previousMonthLength - previousDays + i }}
            </div>
            <div v-for="i in getMonthLength(thisMonthDate)" :class="['cal2-date',{today:i == today.getDate() && monthOffset == 0}]">
                <div class="date">{{ i }}</div>
                <div class="meals">
                    <!-- <div class="meal0 valid"></div> -->
                    <!-- <div class="meal1 valid"></div> -->
                    <!-- <div class="meal2 valid"></div> -->
                </div>
            </div>
            <div v-for="i in afterDays" class="cal2-after-date">
                {{ i }}
            </div>
        </div>

        <!-- <div class="calendar">
            <div class="day-list" :style="{'--columns':`${itemCount}`}">
                <div v-for="day in days" :class="['calendar-column', { today: day.today }]">
                    <header class="header">
                        <div>{{ weekdayAbbr[day.day] }}</div>
                        <div>{{ day.date }}</div>
                    </header>
                </div>
            </div>
        </div> -->
    </main>
</template>

<style scoped>

.meals{
    display:flex;
    gap:3px;
}
.meals > *{
    width:0.4em;
    height:0.4em;
    background-color:var(--main-color);
    border-radius:50%;
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
}

/*  */

main {
    height: calc(100vh - 7rem - 155px);
    display: grid;
    grid-template-rows: auto 1fr;
}

.calendar {
    /* margin: -2em; */
    /* margin-top: 3em; */
    display: flex;
}

.day-list {
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: repeat(var(--columns), 1fr);
    width: 100%;
    position: relative;
    background-color: var(--light);
    --border-radius: 2rem;
    border-radius: var(--border-radius);
    border: solid 1px gray;
    /* box-shadow:0px 5px 5px rgba(0,0,0,0.05); */
}

.calendar-column {
    /* width: 40px; */
    flex-shrink: 0;
    text-align: center;
    position: relative;
    z-index: 0;
}

.calendar-column:not(:last-child) {
    border-right: solid 1px gray;
}

.calendar-column.today {
    /* outline: solid 3px var(--red); */
    z-index: 1;

    & .header {
        background-color: var(--red);
    }
}

.calendar-column .header {
    background-color: var(--dark);
    color: var(--light);
    padding: 5px;
    margin: 5px;
    border-radius: var(--border-radius);
}

/* .calendar-column:first-child .header{
    border-top-left-radius:var(--border-radius);
    border-bottom-left-radius:var(--border-radius);
}
.calendar-column:last-child .header{
    border-top-right-radius:var(--border-radius);
    border-bottom-right-radius:var(--border-radius);
} */
</style>
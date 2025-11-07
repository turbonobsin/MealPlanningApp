<script setup lang="ts">
import CalDate from '@/components/calendar/CalDate.vue';
import CalendarSlideUpData from '@/components/calendar/CalendarSlideUpData.vue';
import CalMonthItem from '@/components/calendar/CalMonthItem.vue';
import { useCalendarStore } from '@/stores/calendar';
import { getMonthLength, weekday, weekdayAbbr } from '@/util';
import { computed, provide, ref, toRaw, Transition } from 'vue';

const today = ref(new Date());

const monthOffset = ref(0); // going forward or back by months

const calendarStore = useCalendarStore();

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

function clickDate(date:Date){
    console.log("clicked date: ",date.toLocaleString([],{dateStyle:"short"}));
    if(selectedDate.value?.toISOString() == date.toISOString()) selectedDate.value = undefined; // deselect
    else selectedDate.value = date; // select

    console.log("date data",toRaw(calendarStore.getDay(date)));
}

provide("clickDate",clickDate);

const selectedDate = ref<Date>();

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
                <!-- {{ previousMonthLength - previousDays + i }} -->
                <CalDate :date="new Date(today.getFullYear(),today.getMonth()+monthOffset-1,previousMonthLength - previousDays + i)" :selected-date="selectedDate"></CalDate>
            </div>
            <div v-for="i in getMonthLength(thisMonthDate)" :class="['cal2-date',{today:i == today.getDate() && monthOffset == 0}]">
                <!-- <div class="date">{{ i }}</div> -->
                <CalDate :date="new Date(thisMonthDate.getFullYear(),thisMonthDate.getMonth()+monthOffset,i)" :selected-date="selectedDate"></CalDate>
                <!-- <div class="meals"> -->
                    <!-- <div class="meal0 valid"></div> -->
                    <!-- <div class="meal1 valid"></div> -->
                    <!-- <div class="meal2 valid"></div> -->
                <!-- </div> -->
            </div>
            <div v-for="i in afterDays" class="cal2-after-date">
                <!-- {{ i }} -->
                <CalDate :date="new Date(thisMonthDate.getFullYear(),thisMonthDate.getMonth()+monthOffset+1,i)" :selected-date="selectedDate"></CalDate>
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
        <Transition name="slide-up">
            <div class="slide-up-window" v-if="selectedDate != undefined">
                <!-- <h3>The slide up menu</h3> -->
                <div style="display:flex;justify-content:space-between;margin-bottom:0.5em">
                    <div>{{ selectedDate.toLocaleString([],{dateStyle:'long'}) }}</div>
                    <div class="material-symbols-outlined" @click="selectedDate = undefined">close</div>
                </div>
                <!-- <div>some</div> -->
                <!-- <div>more</div> -->
                <!-- <div>data</div> -->
                <CalendarSlideUpData :date="selectedDate">
                    <template v-slot="{data}">
                        <!-- {{ data }} -->
                    </template>
                    <template #meal="{meal,recipe}">
                        
                    </template>
                </CalendarSlideUpData>
            </div>
        </Transition>
    </main>
</template>

<style scoped>

.slide-up-window{
    margin:-20px;
    --pad-bottom:130px;
}

.slide-up-enter-active,
.slide-up-leave-active {
    /* transition: translate 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); */
    /* transition: translate 0.3s cubic-bezier(0.175, 0.885, 0.032, 0.99025); */
    /* transition: all 0.3s cubic-bezier(0.075, 0.82, 0.165, 1); */
    /* transition: all 0.1s cubic-bezier(0.165, 0.84, 0.44, 1); */
    transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.slide-up-enter-from,
.slide-up-leave-to {
    /* translate:0px calc(100% + var(--pad-bottom)); */
    scale:0.9;
    opacity:0;
}


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
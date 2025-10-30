<script setup lang="ts">
import CalMonthItem from '@/components/calendar/CalMonthItem.vue';
import { weekdayAbbr } from '@/util';
import { computed, ref } from 'vue';

let today = ref(new Date());

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

    for (let i = -Math.floor(itemCount.value/2); i < Math.ceil(itemCount.value/2); i++) {
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

</script>

<template>
    <h1>Calendar</h1>
    <main>
        <h2>{{ today.toLocaleString([],{month:"long"}) }}</h2>
        <div class="calendar">
            <div class="day-list" :style="{'--columns':`${itemCount}`}">
                <div v-for="day in days" :class="['calendar-column', { today: day.today }]">
                    <header class="header">
                        <div>{{ weekdayAbbr[day.day] }}</div>
                        <div>{{ day.date }}</div>
                    </header>
                </div>
            </div>
        </div>
    </main>
</template>

<style scoped>

main{
    height:calc(100vh - 7rem - 155px);
    display:grid;
    grid-template-rows:auto 1fr;
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
    --border-radius:2rem;
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

.calendar-column:not(:last-child){
    border-right: solid 1px gray;
}

.calendar-column.today {
    /* outline: solid 3px var(--red); */
    z-index: 1;

    & .header{
        background-color:var(--red);
    }
}

.calendar-column .header {
    background-color: var(--dark);
    color: var(--light);
    padding:5px;
    margin:5px;
    border-radius:var(--border-radius);
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
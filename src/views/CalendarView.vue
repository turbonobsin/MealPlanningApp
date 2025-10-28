<script setup lang="ts">
import CalMonthItem from '@/components/calendar/CalMonthItem.vue';
import CalMonthList from '@/components/calendar/CalMonthList.vue';
import { getMonthLength } from '@/util';
import { ref } from 'vue';

let today = ref(new Date());

</script>

<template>
    <h1>Calendar</h1>
    <main>
        <!-- <div class="calendar-list">
            <CalMonthList v-for="i in 12" :i></CalMonthList>
        </div> -->
        <div class="calendar-list">
            <CalMonthItem :today="new Date(today.getFullYear(),today.getMonth()-1)"></CalMonthItem>
            <CalMonthItem :today></CalMonthItem>
            <CalMonthItem :today="new Date(today.getFullYear(),today.getMonth()+1)"></CalMonthItem>
        </div>
    </main>
</template>

<style scoped>

.calendar-list{
    overflow:hidden;
    overflow-x:scroll;
    border:solid 1px gray;
    margin:-2em;
    margin-top:3em;
    display:flex;
}

</style>
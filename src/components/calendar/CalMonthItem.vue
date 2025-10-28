<script setup>
import { getMonthLength } from '@/util';
import { ref } from 'vue';


const props = defineProps({
    today:Date
});

const days = ref([
    "S",
    "M",
    "T",
    "W",
    "TH",
    "F",
    "ST"
]);

</script>

<template>
    <div>{{ today.toLocaleString([],{month:"long"}) }}</div>
    <!-- <div>Days ({{ getMonthLength(new Date(new Date().setFullYear(today.getFullYear(),today.getMonth()+1,0))) }})</div> -->
    <div class="month-days">
        <div v-for="i in getMonthLength(new Date(new Date().setFullYear(today.getFullYear(),today.getMonth()+1,0)))">
            {{ days[new Date(today.getFullYear(),today.getMonth(),i).getDay()] }} <br> {{ i }}
        </div>
    </div>
</template>

<style scoped>

.month-days{
    display:flex;
    align-items:center;
}
.month-days > div{
    width:40px;
    flex-shrink:0;
    border-right:solid 1px gray;
    text-align:center;
    height:300px;
}

</style>
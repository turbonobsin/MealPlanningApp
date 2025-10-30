<script setup>
import { getMonthLength, weekdayAbbr } from '@/util';
import { computed, ref } from 'vue';


const props = defineProps({
    today: Date,
    include: Number
});

const dateRange = computed(() => {
    let start = 0;
    let end = getMonthLength(new Date(new Date().setFullYear(props.today.getFullYear(), props.today.getMonth() + 1, 0)));

    if (props.include != undefined) {

    }

    return new Array(end - start).map((v, i) => i + start);
});

</script>

<template>
    <div>{{ today.toLocaleString([], { month: "long" }) }}</div>
    <!-- <div>Days ({{ getMonthLength(new Date(new Date().setFullYear(today.getFullYear(),today.getMonth()+1,0))) }})</div> -->
    <div class="month-days">
        <div v-for="i in dateRange">
            <div>{{ weekdayAbbr[new Date(today.getFullYear(), today.getMonth(), i).getDay()] }}</div>
            <div>{{ i }}</div>
        </div>
    </div>
</template>

<style scoped>
.month-days {
    display: flex;
    align-items: center;
}

.month-days>div {
    width: 40px;
    flex-shrink: 0;
    border-right: solid 1px gray;
    text-align: center;
    height: 300px;
}
</style>
<script setup>
import { getMonthLength } from '@/util';

const props = defineProps({
    i:Number
});

</script>

<template>
    <div class="calendar-month">
        <div>Days ({{ getMonthLength(new Date(new Date().setFullYear(2025,i,0))) }})</div>
        <div class="day-list">
            <div style="margin-left:2em" v-for="j in getMonthLength(new Date(new Date().setFullYear(2025,i,0)))">
                <div>{{ j }}</div>
            </div>
        </div>
    </div>
</template>

<style scoped>

.calendar-month{
    border:solid 1px gray;
}

.day-list{
    display:flex;
    flex-wrap:wrap;
}
.day-list > div{
    width:20px;
    height:20px;
    text-align:center;
}

</style>
<script setup>
import { onMounted, useTemplateRef } from 'vue';

const props = defineProps({s:String});

const elm = useTemplateRef("elm");

onMounted(()=>{
    if(elm.value) elm.value.innerHTML = props.s;
});

</script>

<template>
    <span ref="elm"></span>
</template>
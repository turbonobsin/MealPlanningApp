<script setup>
import { useTemplateRef, watch } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps({
    label: String,
    destination: String
})

</script>

<template>
    <router-link ref="item" class="menu_item vertical center" :to="props.destination">{{ props.label }}</router-link>
</template>

<style scoped>
.menu_item{
    text-decoration: none;
    height: 60px;
    aspect-ratio: 1;
    text-align: center;
    border-radius: 15px;
    margin: 0px;
}

* {
-webkit-tap-highlight-color: transparent;
}

.router-link-active{
    background-color: var(--dark);
    color: var(--light) !important;
}

.menu_item:visited {
    color: var(--dark);
}
</style>
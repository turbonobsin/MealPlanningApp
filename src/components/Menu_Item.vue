<script setup>

const props = defineProps({
    label: String,
    destination: String
})

</script>

<template>
    <router-link :to="props.destination">{{ props.label }}</router-link>
</template>

<style scoped>
.menu_item{
    height: 50px;
    aspect-ratio: 1;
}
</style>
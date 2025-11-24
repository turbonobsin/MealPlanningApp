<script setup lang="ts">

const props = defineProps<{
    loading:boolean;
}>();

</script>

<template>
    <Transition name="loading">
        <div class="cont" v-if="loading">
            <div class="material-symbols-outlined">egg</div>
        </div>
    </Transition>
</template>

<style scoped>

.loading-active-from,
.loading-active-to{
    transition:opacity 0.5s;
}

.loading-enter-to,
.loading-leave-from{
    opacity:0;
}

.cont{
    display:flex;
    justify-content:center;
    align-items:center;
}

</style>
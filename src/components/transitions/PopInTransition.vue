<template>
    <Transition name="slide-up">
        <slot></slot>
    </Transition>
</template>

<style scoped>

.slide-up-enter-active,
.slide-up-leave-active {
    transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.slide-up-enter-from,
.slide-up-leave-to {
    scale:0.9;
    opacity:0;
}

</style>
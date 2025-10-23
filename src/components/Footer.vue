<script setup>
import Menu_Item from './Menu_Item.vue';
</script>

<template>
    <nav id="menu_bar" class="spread">
        <Menu_Item label="x" to="/"></Menu_Item>
        <Menu_Item label="x" to="/calendar"></Menu_Item>
        <Menu_Item label="x" to="/favorites"></Menu_Item>
        <Menu_Item label="x" to="/settings"></Menu_Item>
    </nav>
</template>

<style scoped>

#menu_bar{
    position: fixed;
    bottom: 20px;
    right: 30px;
    left: 30px;
    padding: 10px;
    border: 3px solid var(--medium);
    border-radius: 15px;
}
</style>
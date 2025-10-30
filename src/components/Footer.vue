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
    right: 40px;
    left: 40px;
    padding: 7px;
    border: 3px solid var(--medium);
    border-radius: 20px;
    background-color: var(--light);
    /* margin-top:auto; */
    /* height:max-content; */
}
</style>
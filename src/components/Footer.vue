<script setup>
import Menu_Item from './Menu_Item.vue';
</script>

<template>
    <nav id="menu_bar" class="spread">
        <Menu_Item label="Home" to="/"></Menu_Item>
        <Menu_Item label="Calendar" to="/calendar"></Menu_Item>
        <Menu_Item label="Favorites" to="/favorites"></Menu_Item>
        <Menu_Item label="Settings" to="/settings"></Menu_Item>
    </nav>
</template>

<style scoped>

#menu_bar{
    position: fixed;
    bottom: 20px;
    right: 20px;
    left: 20px;
    padding: 10px;
}
</style>
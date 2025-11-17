<script setup>
import Menu_Item from './Menu_Item.vue';


function moveSelector(){

}

</script>

<template>
    <div id="overflow_cover"></div>
    <nav id="menu_bar" class="spread h-center">
        <Menu_Item label="search" to="/"></Menu_Item>
        <Menu_Item label="edit_calendar" to="/calendar"></Menu_Item> <!-- calendar_month is another possible icon -->
        <Menu_Item label="book" to="/favorites"></Menu_Item>
        <Menu_Item label="settings" to="/settings"></Menu_Item>
        <!-- <div class="selector"></div> -->
    </nav>
</template>

<style scoped>

#menu_bar{
    position: fixed;
    gap: 15px;
    /* justify-self: center; */
    bottom: 20px;
    left: 15vw;
    right: 15vw;
    padding: .3em;
    border: 3px solid var(--medium);
    border-radius: 20px;
    background-color: var(--light);
    /* margin-top:auto; */
    /* height:max-content; */
}

#overflow_cover{
    position: fixed;
    bottom: 0px;
    right: 0px;
    left: 0px;
    height: 15vh;
    background: linear-gradient(transparent 0%, var(--light) 40%);
    user-select: none;
}

/* .selector{
    position: absolute;
    background-color: var(--dark);
    height: 85%;
    aspect-ratio: 1;
    border-radius: 15px;
    z-index: -1;
    transform: translateX(calc(100% + 20px));
} */
</style>
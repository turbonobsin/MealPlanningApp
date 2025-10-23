<script setup>
</script>

<template>
    <h1 class="space_after">Settings</h1>
    <main>
        <img class="profile_display" src="/Placeholder_Image.png"></img>
        <h2 class="text-center">Username</h2>
        <div>
            <span class="setting">Configure Profile</span>
            <span class="setting">Switch Profile</span>
            <span class="setting">Create New Profile</span>
            <span class="setting">Change Theme</span>
            <span id="delete_profile" class="setting">Delete Profile</span>
        </div>
    </main>
</template>

<style scoped>
.profile_display{
    height: 100px;
    aspect-ratio: 1;
    border-radius: 50%;
    align-self: center;
}

h2{
    margin-top: 10px;
}

.setting{
    display: block;
    padding: 10px 0px;
    /* border-bottom: 1px solid var(--light-color); */
}

#delete_profile{
    color: var(--red);
}
</style>
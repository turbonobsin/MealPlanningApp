<script setup>
import { useProfilesStore } from '@/stores/profiles';
import { inject, onMounted, useTemplateRef } from 'vue';

const show_switch_window = inject('show_switch_window');
const show_create_window = inject('show_create_window');
const profile_store = useProfilesStore();

const profiles_list = useTemplateRef('profiles_list');

onMounted(() => {
    if (profiles_list.value.scrollHeight > profiles_list.value.clientHeight){
        profiles_list.value.style.background = "linear-gradient(var(--light) 0%, var(--light) 85%, var(--medium) 150%)"
    }
})


</script>

<template>
    <div class="backdrop"></div>
    <div class="pop_window vertical">
        <h3>Select Profile</h3>
        <div ref="profiles_list" class="scroll vertical space-after">
            <div class="h-center" v-for="profile in profile_store.profiles" @click="profile_store.switchProfile(profile); show_switch_window = false">
                <div class="circle"></div>
                <span>{{ profile.name }}</span>
            </div>
        </div>
        <button class="color-button" @click="show_switch_window=false; show_create_window=true">+ Create New</button>
        <button class="blank-button" @click="show_switch_window=false">Cancel</button>
    </div>
</template>

<style scoped>

.circle{
    height: 50px;
    background-color: var(--main-color);
    margin-right: 10px;
}

.vertical{
    gap: 10px;
}

</style>
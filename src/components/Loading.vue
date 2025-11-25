<script setup lang="ts">
import { wait } from '@/util';
import { onUnmounted, ref, watch } from 'vue';


const props = defineProps<{
    loading:boolean;
}>();

const actualLoading = ref(props.loading);

watch(()=>props.loading,async (v,ov)=>{
    if(v) actualLoading.value = true;
    else{
        // await wait(100);
        actualLoading.value = false;
    }
});

</script>

<template>
    <Transition name="loading">
        <div class="cont" v-if="actualLoading">
            <div v-if="loading" class="material-symbols-outlined icon spin">egg</div>
            <div v-else class="material-symbols-outlined icon">egg_alt</div>
        </div>
    </Transition>
</template>

<style scoped>

.spin{
    animation:Spin 1s forwards infinite cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes Spin{
    0%{
        rotate:0deg;
    }
    100%{
        rotate:720deg;
    }
}

.loading-enter-active,
.loading-leave-active{
    transition:all 0.2s;
}

.loading-enter-from,
.loading-leave-to{
    opacity:0;
    scale:1.5;
    /* scale:0.5; */
}

.icon{
    font-size:50px;
}

.cont{
    display:flex;
    justify-content:center;
    align-items:center;
    position:fixed;
    top:50vh;
    left:50vw;
    translate:-50% -50%;
    z-index:99;
    background-color:var(--light);
    border-radius:3em;
    padding:3em;
    border-bottom:solid 5px var(--dark);
}

</style>
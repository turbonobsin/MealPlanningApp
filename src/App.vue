<script setup>
import Footer from './components/Footer.vue';
import SelectRecipeBanner from './components/SelectRecipeBanner.vue';
import PopInTransition from './components/transitions/PopInTransition.vue';
import { useStateStore } from './stores/states';

const stateStore = useStateStore();

</script>

<template>
	<RouterView />
	<Footer></Footer>
	<PopInTransition>
		<SelectRecipeBanner v-if="stateStore.selectingRecipe"></SelectRecipeBanner>
	</PopInTransition>
</template>

<style scoped>
</style>
 
<script setup>
import { RouterLink } from 'vue-router';

</script>

<template>
	<main>
		<h1>This is the home page</h1>

		<ul>
			<li><RouterLink to="/details">Details</RouterLink></li>
			<li><RouterLink to="/profile">Profile</RouterLink></li>
			<li><RouterLink to="/favorites">Favorites</RouterLink></li>
			<li><RouterLink to="/calendar">Calendar</RouterLink></li>
		</ul>
	</main>
</template>

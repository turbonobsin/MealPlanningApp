<script setup>
import { useProfilesStore } from '@/stores/profiles';


const profileStore = useProfilesStore();
profileStore.currentProfile.allergies = []
await profileStore.saveProfile()

document.getElementById('profileForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('username').ariaValueMax;
    const diet = document.getElementById('diet').ariaValueMax;
    const allergies = document.getElementById('allergies').ariaValueMax;

    const profileData = {
        username,
        diet,
        allergies
    };

    try {
        const response = await fetch('https://localhost:300/profile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(profileData)
        });
        if (!response.ok) {
            throw new Error('Failed to save profile data.');
        }
        const result = await response.json();
        console.log("Profile saved:", result);
        document.getElementById('results').innerHTML = `
        <h3>${result.username}'s Profile</h3>
        <p><strong>Diet:</strong> ${result.diet}</p>
        <p><strong>Allergies:</strong> ${result.allergies}</p>`
        ;
    } catch (error) {
        console.error('Error:', error);
        alert('Could not save profile data.');
    }
});
</script>

<template>
    <h1>Update User Dietary Information</h1>
    <form id="profileForm">
        <label for="username">Username:</label>
        <input type="text" id="username" required>

        <label for="diet">Dietary Preference (e.g., vegetarian, vegan, pescatarian, etc):</label>
        <input type="text" id="diet">

        <label for="allergies">Allergies/Intolerances (comma-separated):</label>
        <input type="text" id="allergies">

        <button type="submit">Save Profile</button>
    </form>

    <h2>Your Profile</h2>
    <div id="results">
        <p>No profile data has been saved yet.</p>
    </div>
</template>

<style scoped>
body { 
    font-family: sans-serif;
    padding: 20px;
}
        form { margin-bottom: 20px; }
        label, input {display: block; margin-bottom: 10px; }
        #results { border: 1px solid #ccc; padding: 15px; }
</style>
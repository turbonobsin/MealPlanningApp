<script setup>
import { ref } from 'vue'

const favoriteFolders = ref([
  { id: 1, name: 'Folder #1' },
  { id: 2, name: 'Folder #2' },
  { id: 3, name: 'Folder #3' },
])

const createNewFolder = () => {
  const newId = favoriteFolders.value.length + 1
  favoriteFolders.value.push({ id: newId, name: `Folder #${newId}` })
}

const deleteFolder = (id) => {
  const folder = favoriteFolders.value.find(f => f.id === id)
  const confirmDelete = confirm(`Are you sure you want to delete "${folder.name}"?`)
  if (confirmDelete) {
    favoriteFolders.value = favoriteFolders.value.filter(folder => folder.id !== id)
  }
}
</script>

<template>
  <div class="favorites-page">
    <header class="header">
      <h1>Favorites</h1>
    </header>

    <section class="favorites-container">
      <!-- Folder Cards -->
      <div
        v-for="folder in favoriteFolders"
        :key="folder.id"
        class="folder-card"
      >
        <div class="folder-header">
          <h3>{{ folder.name }}</h3>
          <button class="delete-btn" @click="deleteFolder(folder.id)">✕</button>
        </div>
        <p class="description">Description:</p>
      </div>

      <!-- Add Folder Button -->
      <div class="add-folder-card" @click="createNewFolder">
        <span class="plus-icon">+</span>
        <p>Add Folder</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.favorites-page {
  font-family: 'Inter', sans-serif;
  padding: 1.5rem;
}

.header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.favorites-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.folder-card,
.add-folder-card {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  text-align: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
  position: relative;
}

.folder-card:hover,
.add-folder-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

.folder-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.folder-card h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.delete-btn {
  background: none;
  border: none;
  color: #888;
  font-size: 1.1rem;
  cursor: pointer;
  transition: color 0.2s ease;
}

.delete-btn:hover {
  color: #e53935;
}

.description {
  font-size: 0.875rem;
  color: #666;
  margin-top: 0.5rem;
}

.add-folder-card {
  background-color: #f3f4f6;
  color: #555;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.plus-icon {
  font-size: 2rem;
  font-weight: bold;
  line-height: 1;
  margin-bottom: 0.25rem;
}
</style>

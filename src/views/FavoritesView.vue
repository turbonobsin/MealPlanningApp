<script setup>
import { FavoriteFolder, useProfilesStore } from '@/stores/profiles'
import { ref, computed } from 'vue'
import FavoriteRecipe from '@/components/FavoriteRecipe.vue'

const profileStore = useProfilesStore()
const rootFavorites = ref(profileStore.currentProfile.favorites)
const myProfile = ref(profileStore.currentProfile)
const currentFolder = ref(profileStore.currentProfile.favorites)
const folderHistory = ref([])
const draggedRecipeId = ref(null)
const showFolderInput = ref(false)
const newFolderName = ref('')

const dragStartEvent = (e, recipeId) => {
  draggedRecipeId.value = recipeId
  e.dataTransfer.effectAllowed = 'move'
}

const dropRecipeIntoFolder = (folder) => {
  if (!draggedRecipeId.value) return

  profileStore.removeFolderFromFavorites(draggedRecipeId.value, currentFolder.value)
  profileStore.addItemToFavorites(draggedRecipeId.value, folder)
  draggedRecipeId.value = null
}



// myProfile.value.favorites.name = "Favorites"
// profileStore.saveProfile()

const getRecipe = (id) => profileStore.getRecipeData(id);

const openFolder = (folder) => {
  if (!folder || !folder.items) return
  folderHistory.value.push(currentFolder.value)
  currentFolder.value = folder
}

const goBack = () => {
  if (folderHistory.value.length > 0) {
    currentFolder.value = folderHistory.value.pop()
  }
}

const createNewFolder = () => {
  showFolderInput.value = !showFolderInput.value
}

const confirmCreateFolder = () => {
  if (!newFolderName.value.trim()) return
  profileStore.addFolderToFavorites(
    new FavoriteFolder(newFolderName.value.trim()),
    currentFolder.value
  )
  newFolderName.value = ''
  showFolderInput.value = false
}

const cancelCreate = () => {
    newFolderName.value = ''
  showFolderInput.value = false;
}

// const createNewRecipe = () => {
//   profileStore.addItemToFavorites(50, currentFolder.value)
// }

const deleteItem = (item) => {
  profileStore.removeFolderFromFavorites(item, currentFolder.value)
}
</script>

<template>
  <div class="favorites-page">
    <header class="header">
      <h1>{{ currentFolder.name }}</h1>
      <button v-if="folderHistory.length" class="back-btn" @click="goBack">← Back</button>
    </header>

    <section class="favorites-container">
      <div v-for="item in currentFolder.items" :key="item.id || item">
        <div v-if="typeof item === 'number'" class="recipe-card" draggable="true"
          @dragstart="(e) => dragStartEvent(e, item)">
          <FavoriteRecipe :recipe="getRecipe(item)" draggable="true" />
          <button class="delete-btn" @click.stop="deleteItem(item)">✕</button>
        </div>

        <div v-else class="folder-card" @dragover.prevent @drop="dropRecipeIntoFolder">
          <div class="folder-header" @click="openFolder(item)">
            <h3>{{ item.name }}</h3>
          </div>
          <button class="delete-btn" @click.stop="deleteItem(item)">✕</button>
        </div>
      </div>


      <div class="add-folder-card">
        <template v-if="!showFolderInput">
          <div @click="createNewFolder">
            <span class="plus-icon">+</span>
            <p>Add Folder</p>
          </div>
        </template>

        <template v-else>
          <input v-model="newFolderName" type="text" placeholder="Folder name" class="folder-input" />
          <div class="btn-container">
            <button class="confirm-btn" @click="confirmCreateFolder">Create</button>
            <button class="cancel-btn" @click="cancelCreate">Cancel</button>
          </div>
        </template>
      </div>

    </section>
  </div>
</template>

<style scoped>
.folder-input {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  width: 100%;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.btn-container {
  display: flex;
  flex-direction: row;
  gap: 10px;
}

.confirm-btn:hover {
  color: var(--main-color);
  cursor: pointer;
}

.cancel-btn:hover {
  color: red;
  cursor: pointer;
}

.favorites-page {
  font-family: 'Inter', sans-serif;
  padding: 1.5rem;
}

.header {
  text-align: center;
  margin-bottom: 1.5rem;
  position: relative;
}

.back-btn {
  position: absolute;
  left: 1rem;
  top: 0.5rem;
  cursor: pointer;
  font-weight: 500;
}

.favorites-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1rem;
}

.folder-card,
.recipe-card,
.add-folder-card {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  text-align: center;
  position: relative;
}

.folder-card:hover,
.recipe-card:hover,
.add-folder-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

.folder-header {
  cursor: pointer;
}

.delete-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  background: none;
  border: none;
  color: #888;
  font-size: 1.1rem;
  cursor: pointer;
}

.delete-btn:hover {
  color: #e53935;
}

.add-folder-card {
  background-color: #f3f4f6;
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

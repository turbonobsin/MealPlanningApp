<script setup>
import { FavoriteFolder, useProfilesStore } from '@/stores/profiles'
import { ref, computed } from 'vue'
import FavoriteRecipe from '@/components/FavoriteRecipe.vue'
import router from '@/router'

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

function gotoRecipeDetails(item){
  router.push({
    path:`/details/${item}`
  });
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

const sortedItems = computed(()=>{
  return currentFolder.value.items.sort((a,b)=>{
    let w1 = (typeof a == "number" ? 0 : 1);
    let w2 = (typeof b == "number" ? 0 : 1);
    return w2 - w1;
  });
});

</script>

<template>
  <div class="h-center">
    <div v-if="folderHistory.length" class="material-symbols-outlined xxxlarge back" @click="goBack">chevron_left</div>
    <h1 class="title">{{ currentFolder.name }}</h1>
  </div>

  <main class="scroll-main">
    <section class="flex-wrap" style="gap: 15px">

      <div class="add-folder-card card">

        <div class="h-center gap10" v-if="!showFolderInput" @click="createNewFolder">
          <span class="material-symbols-outlined large">add</span>
          <span>New Folder</span>
        </div>

        <div v-else class="h-center gap10">
          <input v-model="newFolderName" type="text" placeholder="Folder name" class="text-input create-input" @keypress.enter="confirmCreateFolder"/>
          <button class="material-symbols-outlined color-button create-button" @click="confirmCreateFolder">check</button>
          <button class="material-symbols-outlined blank-button create-button" @click="cancelCreate">close</button>
        </div>

      </div>

      <div class="favorite-item" v-for="item in sortedItems" :key="item.id || item">
        
        <div v-if="typeof item === 'number'" class="favorite-card card" draggable="true"
          @dragstart="(e) => dragStartEvent(e, item)">
          <FavoriteRecipe :recipe="getRecipe(item)" draggable="true">
            <div class="material-symbols-outlined" @click="deleteItem(item)">delete</div>
          </FavoriteRecipe>
        </div>

        <div v-else class="favorite-folder card h-center spread" @click="openFolder(item)" draggable="true" @dragstart="(e) => dragStartEvent(e, item)" @dragover.prevent @drop="dropRecipeIntoFolder(item)">
          <div class="h-center gap10">
            <div class="delete-btn material-symbols-outlined large" @click.stop="deleteItem(item)">delete</div>
            <span>{{ item.name }}</span>
          </div>
          <div class="material-symbols-outlined large">folder</div>
        </div>

      </div>
    </section>
  </main>
</template>

<style scoped>

.back{
    position: absolute;
    left: .6em;
}

.card{
  padding: 10px;
  border-radius: 10px;
  border: 2px solid;
  flex-grow: 1;
  overflow: hidden;
}

.favorite-folder{
  background-color: var(--light);
  color: var(--dark);
  border-color: var(--medium);
  box-shadow: 0px 5px 0px 0px var(--medium);
  gap: 10px;
}

.add-folder-card {
  background-color: var(--light);
  border-color: var(--main-color);
  box-shadow: 0px 5px 0px 0px var(--main-color);
  width: 100%;
}

.favorite-card{
  border-color: var(--dark);
  box-shadow: 0px 5px 0px 0px var(--dark);
}

.favorite-item{
  flex-grow: 1;
}


.folder-input {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  width: 100%;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.create-input{
  width: 85%;
}

.create-button{
  padding: 5px;
}

/* .btn-container {
  display: flex;
  flex-direction: row;
  gap: 10px;
} */

/* .confirm-btn:hover {
  color: var(--main-color);
  cursor: pointer;
}

.cancel-btn:hover {
  color: red;
  cursor: pointer;
} */

/* .header {
  text-align: center;
  margin-bottom: 1.5rem;
  position: relative;
} */

/* .back-btn {
  position: absolute;
  left: 1rem;
  top: 0.5rem;
  cursor: pointer;
  font-weight: 500;
} */

/* .favorites-container {
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1rem;
} */

/* .folder-card,
.recipe-card,
.add-folder-card {
  background-color: var(--light-color);
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  text-align: center;
  position: relative;
} */

/* .folder-card:hover,
.recipe-card:hover,
.add-folder-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
} */

/* .folder-header {
  cursor: pointer;
  gap: 10px;
} */

/* .delete-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  font-size: 1.1rem;
  cursor: pointer;
} */

.delete-btn:hover {
  color: var(--red);
}

/* .plus-icon {
  font-size: 2rem;
  font-weight: bold;
  line-height: 1;
  margin-bottom: 0.25rem;
} */
</style>

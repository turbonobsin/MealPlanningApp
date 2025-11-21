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

const openMoveWindow = ref(false);
const movingItem = ref({});
const movingItemIndex = ref(-1);
const moveFolderHistory = ref([]);
const moveOpenFolder = ref(profileStore.currentProfile.favorites);

function startMove(item, i){
    openMoveWindow.value = true;
    movingItem.value = item;
    movingItemIndex.value = i;
}

function openMoveFolder(folder){
  moveFolderHistory.value.push(moveOpenFolder.value);
  moveOpenFolder.value = folder;
}

function endMove(folder){
    currentFolder.value.items.splice(movingItemIndex.value, 1);
    folder.items.push(movingItem.value);
    profileStore.saveProfile();
    openMoveWindow.value = false;
}

function backMoveFolder(){
  moveOpenFolder.value = moveFolderHistory.value.pop();
}

// searching
const searchTerm = ref("");
const searchResults = ref([]);
const isSearching = ref(false);
function strMatch(s1="",s2=""){
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();
  return s1.includes(s2) || s2.includes(s1);
}
function search(){
  if(searchTerm.value.length == 0){
    cancelSearch();
    return;
  }

  isSearching.value = true;
  searchResults.value = [];

  // 

  function loop(folder){
    if(!folder) return;
    for(const item of folder.items){
      console.log("ITEM",item,typeof item);
      if(typeof item != "number"){
        loop(item);
        continue;
      }

      let details = profileStore.getRecipeData(item);
      console.log(details);
      if(!details){
        console.warn("skipped recipe when searching because there was no data found in the cache, id:",item);
        continue;
      }
      if(strMatch(details.title,searchTerm.value)){
        searchResults.value.push(item);
      }
    }
  }
  loop(currentFolder.value);
}
function cancelSearch(){
  isSearching.value = false;
  searchResults.value = [];
  searchTerm.value = "";
}

const finalList = computed(()=>{
  if(isSearching.value) return searchResults.value;
  return sortedItems.value;
});

</script>

<template>
  <div class="h-center">
    <div v-if="folderHistory.length" class="material-symbols-outlined xxxlarge back" @click="goBack">chevron_left</div>
    <h1 class="title">{{ currentFolder.name }}</h1>
  </div>
  <div class="search-bar h-center space-after spread">
    <input class="text-input search-input" type="text" :placeholder="folderHistory.length == 0 ? 'Search your favorites...' : 'Search within this folder...'" v-model="searchTerm" @keypress.enter="search"/>
    <button class="material-symbols-outlined search-button dark-button" @click="search">search</button>
  </div>

  <main class="scroll-main">
    <section class="flex-wrap" style="gap: 15px; padding-bottom: 100px">

      <div class="add-folder-card card" v-if="!isSearching">

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

      <div v-if="isSearching" class="full-width">
        <div class="h-center spread" style="padding: 0px 15px; margin-top: -5px">
          <h3>Found results:</h3>
          <span class="material-symbols-outlined" style="font-weight: 700" @click="cancelSearch">close</span>
        </div>
        <div v-if="finalList.length === 0" class="no-results">
          No recipes found.
        </div>
      </div>
      <div class="favorite-item" v-for="(item, i) in finalList" :key="item.id || item">
        
        <!-- Recipe Card -->

        <div v-if="typeof item === 'number'" class="favorite-card card" draggable="true"
          @dragstart="(e) => dragStartEvent(e, item)">
          <FavoriteRecipe :recipe="getRecipe(item)" draggable="true">
            <div class="material-symbols-outlined" @click="startMove(item, i)">drive_file_move</div>
            <div class="material-symbols-outlined" @click="deleteItem(item)">delete</div>
          </FavoriteRecipe>
        </div>

        <!-- Folder Card -->

        <div v-else class="favorite-folder card h-center spread" @click="openFolder(item)" draggable="true" @dragstart="(e) => dragStartEvent(e, item)" @dragover.prevent @drop="dropRecipeIntoFolder(item)">
          <div class="h-center gap10">
            <div class="material-symbols-outlined large">folder</div>
            <span>{{ item.name }}</span>
          </div>
          <div class="delete-btn material-symbols-outlined" @click.stop="deleteItem(item)">delete</div>
          <!-- <div class="flex gap10">
            <div class="material-symbols-outlined large" @click.stop="renameFolder(item)">edit</div>
            <div class="material-symbols-outlined large" @click.stop="deleteItem(item)">more_horiz</div>
          </div> -->
        </div>

      </div>
    </section>
  </main>

  <!-- Move Window -->

  <div v-show="openMoveWindow" class="backdrop"></div>
  <div v-show="openMoveWindow" class="pop-window">
    <h3 class="gap-after">Move to folder</h3>
    <div class="h-center gap10">
      <span v-if="moveFolderHistory.length > 0" class="material-symbols-outlined" @click="backMoveFolder">keyboard_arrow_left</span>
      <h4>{{ moveOpenFolder.name }}</h4>
    </div>
    <div class="scroll">
      <div class="vertical gap10">

        <div class="favorite-folder card spread" v-if="moveOpenFolder.items" v-for="item in moveOpenFolder.items.filter(v => v.name)">
          <div class="h-center gap10">
            <div class="material-symbols-outlined large">folder</div>
            <span>{{ item.name }}</span>
          </div>
          <div class="flex gap10">
            <button class="color-button" @click="endMove(item)">Move</button>
            <button class="blank-button" @click.stop="openMoveFolder(item)">Open</button>
          </div>
        </div>

      </div>
    </div>
    <div class="two-grid gap-before">
      <button class="blank-button" @click="openMoveWindow = false">Cancel</button>
      <button class="color-button" @click="endMove(moveOpenFolder)">Move here</button>
    </div>
  </div>
</template>

<style scoped>

/* search */

.search-bar {
	padding: 5px;
	gap: 10px;
	border-radius: 12px;
	border: 2px solid var(--medium);
	box-shadow: 0 3px 0px 0px var(--medium);
	background-color: var(--light);
}

.search-input{
	display: inline-block;
	width: 80%;
}

.search-button{
	padding: 7px;
}

/*  */

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
  background-color: var(--light);
}

.favorite-folder{
  background-color: var(--light);
  color: var(--dark);
  border-color: var(--medium);
  box-shadow: 0px 5px 0px 0px var(--medium);
  gap: 10px;
}

/* Fun pressing down animation on add-folder-card */
.favorite-folder:active{
  box-shadow: 0px 0px 0px 0px var(--medium);
  margin-top:5px;
  margin-bottom:-5px;
}

.add-folder-card {
  background-color: var(--light);
  border-color: var(--main-color);
  box-shadow: 0px 5px 0px 0px var(--main-color);
  width: 100%;
}

/* Fun pressing down animation on add-folder-card */
.add-folder-card:active{
  box-shadow: 0px 0px 0px 0px var(--main-color);
  margin-top:5px;
  margin-bottom:-5px;
}

.favorite-card{
  border-color: var(--dark);
  box-shadow: 0px 5px 0px 0px var(--dark);
}

.favorite-item{
  flex-grow: 1;
}

.scroll{
  max-height: 400px;
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

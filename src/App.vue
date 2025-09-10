<template>
  <div class="w-full">
    <header class="w-full">
      <div class="max-w-6xl mx-auto flex flex-col items-center pt-8 pb-4 px-4">
        <img
          src="./assets/logo.png"
          alt="Logo"
          class="w-24 h-24 mb-2 rounded-full object-cover shadow-md"
        />
        <h1 class="text-xl font-semibold text-gray-800">Pams Menu</h1>
      </div>
    </header>

    <main class="w-full">
      <div class="max-w-6xl mx-auto px-4 pb-10">
        <div v-if="isLoading" class="text-gray-600 text-center py-8">Yükleniyor...</div>
        <div v-else-if="error" class="text-red-600 text-center py-8">Hata: {{ error }}</div>
        <div v-else>
          <MenuComponent />
        </div>
      </div>
    </main>
  </div>
</template>



<script setup>
import { onMounted, computed } from "vue";
import { useStore } from "vuex";
import MenuComponent from "./components/menuComponent.vue";

const store = useStore();
const error = computed(() => store.getters.error);

onMounted(() => {
  store.dispatch("fetchAllData"); // Yeni action'ı dispatch edin
});
</script>
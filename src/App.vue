<template>
  <div class="flex flex-col items-center justify-center min-h-screen pt-8 w-full px-4 bg-green-100">
    <img
      src="./assets/logo.png"
      alt="Logo"
      class="w-32 h-32 mb-4 rounded-full object-cover shadow-lg"
    />

    <div v-if="isLoading" class="text-gray-500">Yükleniyor...</div>
    <div v-else-if="error" class="text-red-500">Hata: {{ error }}</div>

    <!-- MenuComponent artık full width kapsayıcıda -->
    <div v-else  class="w-full max-w-5xl">
      <MenuComponent />
    </div>
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
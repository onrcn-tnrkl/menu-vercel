<template>
  <div class="w-full">
    <header class="w-full">
      <!-- Banner Alanı -->
      <div class="relative w-full h-64 overflow-hidden">
        <transition-group name="fade" tag="div">
          <img
            v-for="(image, index) in bannerImages"
            v-show="currentBanner === index"
            :key="index"
            :src="image"
            alt="Banner"
            class="absolute inset-0 w-full h-full object-cover brightness-95"
          />
        </transition-group>

        <!-- Küçük Nokta Göstergeleri -->
        <div
          v-if="bannerImages.length > 1"
          class="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2"
        >
          <button
            v-for="(image, index) in bannerImages"
            :key="'dot-' + index"
            @click="currentBanner = index"
            class="w-3 h-3 rounded-full transition-all duration-300"
            :class="currentBanner === index ? 'bg-emerald-500' : 'bg-white/70'"
          ></button>
        </div>
      </div>

      <!-- Logo ve Başlık -->
      <div class="max-w-6xl mx-auto flex flex-col items-center pt-8 pb-4 px-4">
        <img
          src="./assets/logo.png"
          alt="Logo"
          class="w-48 h-48 mb-2 rounded-full object-cover shadow-md"
        />
        <h1 class="text-xl font-semibold text-gray-800">Pams No : 49</h1>
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

    <footer class="w-full">
      <div
        class="max-w-6xl mx-auto px-4 py-6 border-t border-emerald-100 text-center text-sm text-emerald-900/70"
      >
        © {{ currentYear }} Onurcan Tanrıkulu. Tüm hakları saklıdır.
      </div>
    </footer>
  </div>
</template>

<script setup>
import { onMounted, computed, ref } from "vue";
import { useStore } from "vuex";
import MenuComponent from "./components/menuComponent.vue";

const store = useStore();
const error = computed(() => store.getters.error);
const currentYear = new Date().getFullYear();

// Banner Görselleri (isteğe göre ./assets klasörüne koy)
const bannerImages = ref([
  "./assets/banner1.jpg",
  "./assets/banner2.jpg",
  "./assets/banner3.jpg",
]);

const currentBanner = ref(0);
let intervalId = null;

onMounted(() => {
  store.dispatch("fetchAllData");

  if (bannerImages.value.length > 1) {
    intervalId = setInterval(() => {
      currentBanner.value =
        (currentBanner.value + 1) % bannerImages.value.length;
    }, 4000); // 4 saniyede bir geçiş
  }
});

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

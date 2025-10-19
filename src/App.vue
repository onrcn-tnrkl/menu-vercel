<template>
  <div class="w-full">
    <!-- Üst Kısım -->
    <header class="w-full">
      <div class="max-w-6xl mx-auto flex flex-col items-center pt-8 pb-4 px-4">
        <img
          src="./assets/logo.png"
          alt="Logo"
          class="w-48 h-48 mb-2 rounded-full object-cover shadow-md"
        />
        <h1 class="text-xl font-semibold text-gray-800">Pams No : 49</h1>
      </div>
    </header>

    <!-- Ana İçerik -->
    <main class="w-full">
      <div class="max-w-6xl mx-auto px-4 pb-10">
        <div v-if="isLoading" class="text-gray-600 text-center py-8">Yükleniyor...</div>
        <div v-else-if="error" class="text-red-600 text-center py-8">Hata: {{ error }}</div>
        <div v-else>
          <!-- Menü Bileşeni -->
          <MenuComponent
            :show-banner="true"
            banner-text="Güncel menüyü görüntülüyorsunuz. Fiyatlar ₺ cinsindendir."
            :banner-images="bannerImages"
          />
        </div>
      </div>
    </main>

    <!-- Alt Bilgi -->
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
import { onMounted, computed } from "vue";
import { useStore } from "vuex";
import MenuComponent from "./components/menuComponent.vue";

const store = useStore();
const error = computed(() => store.getters.error);
const currentYear = new Date().getFullYear();

// Banner görseli public klasöründe (örnek: public/banner.png)
const bannerImages = ["/banner.png"];

const isLoading = computed(() => store.getters.isLoading);

onMounted(() => {
  store.dispatch("fetchAllData");
});
</script>

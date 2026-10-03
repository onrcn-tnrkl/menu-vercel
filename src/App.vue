<template>
  <div class="w-full min-h-screen">
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

    <main class="w-full">
      <div class="max-w-6xl mx-auto px-3 sm:px-4 pb-10">
        <!-- Menü kartı -->
        <div class="bg-[#fffaf0]/90 rounded-2xl shadow-sm p-4 sm:p-8">
          <div v-if="error" class="text-red-600 text-center py-8">Hata: {{ error }}</div>
          <div v-else>
            <MenuComponent
              :show-banner="true"
              banner-text="Güncel menüyü görüntülüyorsunuz. Fiyatlar ₺ cinsindendir."
              :banner-images="bannerImages"
            />
          </div>
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
import { onMounted, computed } from "vue";
import { useStore } from "vuex";
import MenuComponent from "./components/menuComponent.vue";

const store = useStore();
const error = computed(() => store.getters.error);
const currentYear = new Date().getFullYear();

// Banner resmini `public/` klasörüne koy (örnek: public/banner.png)
const bannerImages = ["/banner.png"];

onMounted(() => {
  store.dispatch("fetchAllData");
});
</script>

<style>
body {
  margin: 0;
  background-color: #fbebd6;
}

/* Sabit arka plan (masaüstü / yatay ekran) */
body::before {
  content: "";
  position: fixed;
  inset: 0;
  background: url("./assets/background.jpeg") center / cover no-repeat;
  z-index: -1;
}

/* Telefon / dikey ekran */
@media (max-width: 768px), (orientation: portrait) {
  body::before {
    background-image: url("./assets/phone-background.jpeg");
  }
}
</style>

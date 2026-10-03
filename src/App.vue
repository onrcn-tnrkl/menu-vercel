<template>
  <div class="w-full min-h-screen">
    <!-- Açılış pop-up'ı -->
    <Transition name="fade">
      <div
        v-if="showPopup"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
        @click.self="closePopup"
      >
        <div class="relative">
          <button
            @click="closePopup"
            aria-label="Kapat"
            class="absolute -top-3 -right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-xl font-bold leading-none text-gray-800 shadow-lg hover:bg-gray-100"
          >
            ✕
          </button>
          <img
            :src="popupImage"
            alt="Duyuru"
            class="block max-h-[80vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl sm:max-w-md"
          />
        </div>
      </div>
    </Transition>

    <header class="w-full">
      <div class="max-w-6xl mx-auto flex flex-col items-center pt-8 pb-4 px-4">
        <!-- Dönen logo: tıklayınca Instagram'a gider -->
        <a
          :href="instagramUrl"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram sayfamıza git"
          class="logo-scene mb-2 block h-48 w-48"
        >
          <div class="logo-card" :class="{ flipped: isFlipped }">
            <!-- Ön yüz: normal logo -->
            <img
              src="./assets/logo.png"
              alt="Logo"
              class="logo-face h-full w-full rounded-full object-cover shadow-md"
            />
            <!-- Arka yüz: Instagram -->
            <div
              class="logo-face logo-back flex flex-col items-center justify-center rounded-full text-white shadow-md"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="h-20 w-20"
              >
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
              </svg>
              <span class="mt-2 text-lg font-semibold">@pams_no49</span>
              <span class="mt-2 text-lg font-semibold">Bizi takip edin</span>
            </div>
          </div>
        </a>
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
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useStore } from "vuex";
import MenuComponent from "./components/menuComponent.vue";
import popupImage from "./assets/pop-up.jpeg";

const store = useStore();
const error = computed(() => store.getters.error);
const currentYear = new Date().getFullYear();

// Instagram sayfanın adresini buraya yaz
const instagramUrl = "https://www.instagram.com/pams_no49/";

// Banner resmini `public/` klasörüne koy (örnek: public/banner.png)
const bannerImages = ["/banner.png"];

// Pop-up
const showPopup = ref(true);
const closePopup = () => {
  showPopup.value = false;
};
const onKeydown = (e) => {
  if (e.key === "Escape") closePopup();
};

// Logo dönme animasyonu
const isFlipped = ref(false);
const SHOW_LOGO_MS = 4000; // normal logo ekranda kalma süresi
const SHOW_INSTAGRAM_MS = 3000; // Instagram yüzü ekranda kalma süresi
let flipTimer = null;

const scheduleFlip = () => {
  const wait = isFlipped.value ? SHOW_INSTAGRAM_MS : SHOW_LOGO_MS;
  flipTimer = setTimeout(() => {
    isFlipped.value = !isFlipped.value;
    scheduleFlip();
  }, wait);
};

onMounted(() => {
  store.dispatch("fetchAllData");
  window.addEventListener("keydown", onKeydown);
  scheduleFlip();
});

onUnmounted(() => {
  window.removeEventListener("keydown", onKeydown);
  clearTimeout(flipTimer);
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

/* Pop-up geçiş efekti */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Dönen logo */
.logo-scene {
  perspective: 1000px;
}
.logo-card {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.9s cubic-bezier(0.4, 0.2, 0.2, 1);
}
.logo-card.flipped {
  transform: rotateY(180deg);
}
.logo-face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}
.logo-back {
  transform: rotateY(180deg);
  background: linear-gradient(45deg, #f09433, #dc2743, #bc1888);
}

/* Hareketi azaltmayı tercih eden kullanıcılar için */
@media (prefers-reduced-motion: reduce) {
  .logo-card {
    transition-duration: 0.01s;
  }
}
</style>

<template>
  <div class="max-w-5xl mx-auto p-4 bg-transparent">
    <h1 class="text-3xl md:text-4xl font-semibold text-center mb-6 text-emerald-900">Menü</h1>

   <!-- Üstteki banner -->
<div
  v-if="props.showBanner"
  class="mb-6 rounded-2xl overflow-hidden border-none shadow-none bg-transparent p-0"
>

  <!-- Yoksa sabit banner -->
  <div class="relative w-full overflow-hidden rounded-2xl flex justify-center items-center bg-white">
    <img
      src="/banner.png"
      alt="Banner"
      class="max-w-full h-auto object-contain object-center block"
      style="width:100%; height:auto;"
    />
    
  </div>
</div>

    <!-- Kategori Seçim Bölümü -->
    <div class="mb-6">
      <div class="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        <button
          type="button"
          class="shrink-0 px-3 py-1.5 rounded-full border text-sm transition-colors"
          :class="
            selectedCategoryId === 'all'
              ? 'bg-emerald-600 text-white border-emerald-600'
              : 'bg-white text-emerald-800 border-emerald-200 hover:bg-emerald-50'
          "
          @click="selectedCategoryId = 'all'"
        >
          Tümü
        </button>
        <button
          v-for="category in nonEmptyCategories"
          :key="category.id"
          type="button"
          class="shrink-0 px-3 py-1.5 rounded-full border text-sm transition-colors"
          :class="
            selectedCategoryId === category.id
              ? 'bg-emerald-600 text-white border-emerald-600'
              : 'bg-white text-emerald-800 border-emerald-200 hover:bg-emerald-50'
          "
          @click="selectedCategoryId = category.id"
        >
          {{ category.name }}
        </button>
      </div>
    </div>

    <!-- Menü Kategorileri -->
    <div v-for="category in visibleCategories" :key="category.id" class="mb-8">
      <h2
        class="text-xl md:text-2xl font-semibold text-emerald-800 mb-3 flex items-center gap-2"
      >
        <span class="inline-block h-2 w-2 rounded-full bg-emerald-500"></span>
        {{ category.name }}
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 grid-auto-rows-fr">
        <div
          v-for="item in menuItems
            .filter(i => i.category_id === category.id && i.is_active)
            .sort((a, b) => a.price - b.price)"
          :key="item.id"
          class="bg-white/90 backdrop-blur rounded-2xl shadow-md border border-emerald-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02] flex flex-col"
          :class="{
            'opacity-50 blur-[1px] pointer-events-none':
              item.is_active === false
          }"
        >
          <!-- Ürün Resmi -->
          <div class="relative w-full aspect-square overflow-hidden flex-shrink-0">
            <img
              v-if="item.image_path"
              :src="item.image_path"
              :alt="item.name"
              class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              @error="handleImageError"
            />
            <div
              v-else
              class="w-full h-full bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center"
            >
              <svg class="w-16 md:w-20 h-16 md:h-20 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
          </div>
          
          <!-- Ürün Bilgileri -->
          <div class="p-4 flex flex-col flex-grow">
            <div class="flex items-start justify-between gap-3 mb-2">
              <h3 class="font-semibold text-gray-900 text-lg leading-tight">{{ item.name }}</h3>
              <span
                class="shrink-0 inline-flex items-center px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-sm font-bold"
              >
                ₺
                {{
                  Number(item.price).toLocaleString("tr-TR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })
                }}
              </span>
            </div>
            <p
              v-if="item.description"
              class="text-sm text-emerald-900/70 leading-relaxed line-clamp-3 flex-grow"
            >
              {{ item.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed, ref } from "vue";
import BannerSlider from "./BannerSlider.vue";
import { useStore } from "vuex";

// Props
const props = defineProps({
  bannerText: {
    type: String,
    default: "Güncel menüyü görüntülüyorsunuz. Fiyatlar ₺ cinsindendir."
  },
  showBanner: {
    type: Boolean,
    default: true
  },
  bannerImages: {
    type: Array,
    default: () => []
  }
});

// Vuex bağlantısı
const store = useStore();
const menuItems = computed(() => store.getters.menuItems);
const categories = computed(() => store.getters.categories);
const isLoading = computed(() => store.getters.isLoading);
const error = computed(() => store.getters.error);

// Kategori seçimi
const selectedCategoryId = ref("all");

const nonEmptyCategories = computed(() => {
  const idsWithItems = new Set(menuItems.value.map(item => String(item.category_id)));
  return categories.value
    .filter(category => idsWithItems.has(String(category.id)))
    .sort((a, b) => {
      const aOrder =
        typeof a.order === "number"
          ? a.order
          : Number(a.order ?? Number.MAX_SAFE_INTEGER);
      const bOrder =
        typeof b.order === "number"
          ? b.order
          : Number(b.order ?? Number.MAX_SAFE_INTEGER);
      return aOrder - bOrder;
    });
});

const visibleCategories = computed(() => {
  if (selectedCategoryId.value === "all") {
    return nonEmptyCategories.value;
  }
  return nonEmptyCategories.value.filter(
    category => category.id === selectedCategoryId.value
  );
});

// Resim yükleme hatası yönetimi
const handleImageError = (event) => {
  event.target.style.display = 'none';
  const fallbackDiv = event.target.nextElementSibling;
  if (fallbackDiv) {
    fallbackDiv.style.display = 'flex';
  }
};

onMounted(() => {
  store.dispatch("fetchAllData");
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>

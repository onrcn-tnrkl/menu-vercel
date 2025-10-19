<template>
  <div class="max-w-5xl mx-auto p-4">
    <h1 class="text-3xl md:text-4xl font-semibold text-center mb-6 text-emerald-900">Menü</h1>

    <!-- İnce ve tema-uyumlu banner -->
    <div v-if="props.showBanner" class="mb-6">
      <div
        class="rounded-2xl border border-emerald-100 bg-emerald-50/70 px-4 py-2.5 shadow-sm"
        role="status"
        aria-live="polite"
      >
        <div class="flex items-center gap-2 text-emerald-900/80">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="w-4 h-4 text-emerald-700"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"/></svg>
          <span class="text-sm">{{ props.bannerText }}</span>
        </div>
      </div>
    </div>

    <!-- Kategori Seçim Bölümü -->
    <div class="mb-6">
      <div class="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        <button
          type="button"
          class="shrink-0 px-3 py-1.5 rounded-full border text-sm transition-colors"
          :class="selectedCategoryId === 'all' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-emerald-800 border-emerald-200 hover:bg-emerald-50'"
          @click="selectedCategoryId = 'all'"
        >
          Tümü
        </button>
        <button
          v-for="category in nonEmptyCategories"
          :key="category.id"
          type="button"
          class="shrink-0 px-3 py-1.5 rounded-full border text-sm transition-colors"
          :class="selectedCategoryId === category.id ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-emerald-800 border-emerald-200 hover:bg-emerald-50'"
          @click="selectedCategoryId = category.id"
        >
          {{ category.name }}
        </button>
      </div>
    </div>

    <div
      v-for="category in visibleCategories"
      :key="category.id"
      class="mb-8"
    >
      <h2 class="text-xl md:text-2xl font-semibold text-emerald-800 mb-3 flex items-center gap-2">
        <span class="inline-block h-2 w-2 rounded-full bg-emerald-500"></span>
        {{ category.name }}
      </h2>

      <ul class="bg-white/90 backdrop-blur rounded-2xl shadow-md border border-emerald-100 divide-y divide-emerald-50">
       <li
          v-for="item in menuItems
            .filter(i => i.category_id === category.id && i.is_active)
            .sort((a, b) => a.price - b.price)"
          :key="item.id"
          class="relative p-4 hover:bg-emerald-50/60 transition-colors rounded-lg"
        >
          <!-- Ürün içeriği -->
          <div
            class="flex items-start justify-between gap-4"
            :class="{ 'opacity-50 blur-[1px] pointer-events-none': item.is_active === false }"
          >
            <div class="flex-1 min-w-0">
              <p class="font-medium text-gray-900 truncate">{{ item.name }}</p>
              <p v-if="item.description" class="mt-1 text-sm text-emerald-900/70 leading-snug line-clamp-2">
                {{ item.description }}
              </p>
            </div>
            <span class="shrink-0 inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-sm font-semibold">
              ₺ {{ Number(item.price).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
            </span>
          </div>          
        </li>




      </ul>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed, ref } from "vue";
// Banner metni ve görünürlüğü için yapılandırılabilir props
const props = defineProps({
  bannerText: {
    type: String,
    default: 'Güncel menüyü görüntülüyorsunuz. Fiyatlar ₺ cinsindendir.'
  },
  showBanner: {
    type: Boolean,
    default: true
  }
});
import { useStore } from "vuex";

const store = useStore();

const menuItems = computed(() => store.getters.menuItems);
const categories = computed(() => store.getters.categories);
const isLoading = computed(() => store.getters.isLoading);
const error = computed(() => store.getters.error);

// Kategori filtresi için seçim durumu
const selectedCategoryId = ref('all');

// Ürünü olmayan kategorileri gizlemek için filtrelenmiş kategori listesi
const nonEmptyCategories = computed(() => {
  const idsWithItems = new Set(menuItems.value.map(item => String(item.category_id)));
  return categories.value
    .filter(category => idsWithItems.has(String(category.id)))
    .sort((a, b) => {
      const aOrder = typeof a.order === 'number' ? a.order : Number(a.order ?? Number.MAX_SAFE_INTEGER);
      const bOrder = typeof b.order === 'number' ? b.order : Number(b.order ?? Number.MAX_SAFE_INTEGER);
      return aOrder - bOrder;
    });
});

// Seçime göre görüntülenecek kategoriler
const visibleCategories = computed(() => {
  if (selectedCategoryId.value === 'all') {
    return nonEmptyCategories.value;
  }
  return nonEmptyCategories.value.filter(category => category.id === selectedCategoryId.value);
});

onMounted(() => {
  store.dispatch("fetchAllData");
});
</script>
  

<template>
  <div class="max-w-5xl mx-auto p-4">
    <h1 class="text-3xl md:text-4xl font-semibold text-center mb-6 text-emerald-900">Menü</h1>

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
          v-for="category in categoriesWithProducts"
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
            .filter(i => i.category_id === category.id)
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
        
          <!-- Mevcut değil mesajı -->
          <div
            v-if="item.is_active === false"
            class="absolute inset-0 flex items-center justify-center text-red-600 font-semibold text-sm bg-white/70 rounded-lg"
          >
            Şu an mevcut değil
          </div>
        </li>




      </ul>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed, ref, watch } from "vue";
import { useStore } from "vuex";

const store = useStore();

const menuItems = computed(() => store.getters.menuItems);
const categories = computed(() => store.getters.categories);
const isLoading = computed(() => store.getters.isLoading);
const error = computed(() => store.getters.error);

// Kategori filtresi için seçim durumu
const selectedCategoryId = ref('all');

// Ürünü olmayan kategorileri gizlemek için, ürünü olan kategorileri hesapla
const categoriesWithProducts = computed(() => {
  const items = menuItems.value ?? [];
  const existingCategoryIds = new Set(items.map(item => item.category_id));
  return (categories.value ?? []).filter(category => existingCategoryIds.has(category.id));
});

// Seçime göre görüntülenecek kategoriler (yalnızca ürünü olanlar)
const visibleCategories = computed(() => {
  if (selectedCategoryId.value === 'all') {
    return categoriesWithProducts.value;
  }
  return categoriesWithProducts.value.filter(category => category.id === selectedCategoryId.value);
});

// Seçili kategori artık yoksa veya ürünü kalmadıysa, 'all' konumuna dön
watch([categoriesWithProducts, selectedCategoryId], ([availableCategories, selected]) => {
  if (selected !== 'all' && !availableCategories.some(category => category.id === selected)) {
    selectedCategoryId.value = 'all';
  }
});

onMounted(() => {
  store.dispatch("fetchAllData");
});
</script>
  

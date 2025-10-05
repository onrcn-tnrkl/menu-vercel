<template>
  <div class="max-w-5xl mx-auto p-4">
    <h1 class="text-3xl md:text-4xl font-semibold text-center mb-6 text-emerald-900">Menü</h1>

    <div
      v-for="category in categories"
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
          :class="[
            'flex items-start justify-between gap-4 p-4 hover:bg-emerald-50/60 transition-colors',
            { 'opacity-50 blur-[1px] pointer-events-none': item.is_active === false }
          ]"
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
        </li>


      </ul>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from "vue";
import { useStore } from "vuex";

const store = useStore();

const menuItems = computed(() => store.getters.menuItems);
const categories = computed(() => store.getters.categories);
const isLoading = computed(() => store.getters.isLoading);
const error = computed(() => store.getters.error);

onMounted(() => {
  store.dispatch("fetchAllData");
});
</script>
  

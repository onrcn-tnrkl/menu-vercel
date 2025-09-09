<template>
  <div class="max-w-5xl mx-auto p-4">
    <h1 class="text-3xl font-bold text-center mb-6"><i>Menü</i></h1>

    <!-- Grid ile 2 sütun -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div
        v-for="category in categories"
        :key="category.id"
        class="mb-8 bg-gray-50 rounded-xl shadow p-4"
      >
        <b class="text-2xl block text-center mb-2">{{ category.name }}</b>
        <hr class="border-t-2 border-gray-400 mb-2" />
        <ol>
          <li
            v-for="item in menuItems.filter(i => i.category_id === category.id)"
            :key="item.id"
            class="flex justify-between border-b py-2"
          >
            <span>{{ item.name }}</span>
            <span>{{ item.price }} TL</span>
          </li>
        </ol>
      </div>
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
  
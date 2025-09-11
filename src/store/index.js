import { createStore } from "vuex";
import { get, ref, onValue } from "firebase/database";
import { db } from "../firebase";

export default createStore({
  state: {
    menuItems: [],
    categories: [], // Kategoriler için yeni bir state ekliyoruz
    loading: false,
    error: null 
  },
  mutations: {
    SET_MENU(state, payload) {
      state.menuItems = payload;
    },
    SET_CATEGORIES(state, payload) { // Kategoriler için yeni bir mutation
      state.categories = payload;
    },
    SET_LOADING(state, payload) {
      state.loading = payload;
    },
    SET_ERROR(state, payload) {
      state.error = payload;
    }
  },
  actions: {
    async fetchAllData({ commit }) { // Tüm verileri çekecek yeni bir action
      commit("SET_LOADING", true);
      try {
        // Ürünleri çekme
        const productsRef = ref(db, 'products'); 
        const productsSnapshot = await get(productsRef);
        if (productsSnapshot.exists()) {
          const products = Object.values(productsSnapshot.val()).map((item, index) => ({
            id: index,
            ...item,
          }));
          commit("SET_MENU", products);
        } else {
          commit("SET_MENU", []);
        }

        // Kategorileri çekme
        const categoriesRef = ref(db, 'category'); // Veritabanı yoluna göre
        const categoriesSnapshot = await get(categoriesRef);
        if (categoriesSnapshot.exists()) {
          const categories = Object.values(categoriesSnapshot.val()).map((item, index) => ({
            id: index,
            ...item,
          }));
          commit("SET_CATEGORIES", categories);
        } else {
          commit("SET_CATEGORIES", []);
        }

      } catch (err) {
        commit("SET_ERROR", err.message);
      } finally {
        commit("SET_LOADING", false);
      }
    },
    subscribeRealtime({ commit }) {
      // İlk yükleme göstergesi
      commit('SET_LOADING', true);

      // Products
      const productsRef = ref(db, 'products');
      const unsubscribeProducts = onValue(productsRef, (snapshot) => {
        if (snapshot.exists()) {
          const products = Object.values(snapshot.val()).map((item, index) => ({ id: index, ...item }));
          commit('SET_MENU', products);
        } else {
          commit('SET_MENU', []);
        }
        commit('SET_LOADING', false);
      }, (error) => {
        commit('SET_ERROR', error.message);
        commit('SET_LOADING', false);
      });

      // Categories
      const categoriesRef = ref(db, 'category');
      const unsubscribeCategories = onValue(categoriesRef, (snapshot) => {
        if (snapshot.exists()) {
          const categories = Object.values(snapshot.val()).map((item, index) => ({ id: index, ...item }));
          commit('SET_CATEGORIES', categories);
        } else {
          commit('SET_CATEGORIES', []);
        }
      }, (error) => {
        commit('SET_ERROR', error.message);
      });

      // Unsubscribe handler'ı döndür
      return () => {
        try { unsubscribeProducts && unsubscribeProducts(); } catch {}
        try { unsubscribeCategories && unsubscribeCategories(); } catch {}
      };
    }
  },
  getters: {
    menuItems: state => state.menuItems,
    categories: state => state.categories, // Kategoriler için yeni bir getter
    isLoading: state => state.loading,
    error: state => state.error,
    getCategoryNameById: (state) => (categoryId) => {
     const category = state.categories.find(cat => cat.id === categoryId);
     return category ? category.name : 'Bilinmeyen Kategori';
   }
  }
});
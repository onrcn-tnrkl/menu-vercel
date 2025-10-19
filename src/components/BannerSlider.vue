<template>
  <div class="relative w-full bg-white">
    <div class="max-w-6xl mx-auto px-4">
      <div
        class="relative overflow-hidden rounded-2xl shadow-md border border-emerald-100"
        @mouseenter="pause"
        @mouseleave="resume"
      >
        <!-- Slides wrapper -->
        <div
          class="flex transition-transform duration-500 ease-out"
          :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
        >
          <div
            v-for="(img, idx) in images"
            :key="idx"
            class="shrink-0 w-full aspect-[16/6] bg-emerald-50 flex items-center justify-center"
          >
            <img
              v-if="typeof img === 'string'"
              :src="img"
              class="w-full h-full object-cover"
              :alt="`Banner ${idx + 1}`"
              loading="lazy"
              decoding="async"
            />
            <img
              v-else
              :src="img.src"
              class="w-full h-full object-cover"
              :alt="img.alt ?? `Banner ${idx + 1}`"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>

        <!-- Dots -->
        <div
          v-if="images.length > 1"
          class="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-2"
        >
          <button
            v-for="(img, idx) in images"
            :key="`dot-${idx}`"
            type="button"
            class="w-2.5 h-2.5 rounded-full border transition-colors"
            :class="idx === currentIndex ? 'bg-emerald-600 border-emerald-600' : 'bg-white/70 border-white hover:bg-white'"
            @click="goTo(idx)"
            aria-label="Slide dot"
          />
        </div>

        <!-- Arrows -->
        <button
          v-if="images.length > 1"
          type="button"
          class="absolute left-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/80 hover:bg-white border border-emerald-100 shadow-sm"
          @click="prev"
          aria-label="Previous"
        >
          <span class="sr-only">Previous</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="w-5 h-5 text-emerald-800"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <button
          v-if="images.length > 1"
          type="button"
          class="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/80 hover:bg-white border border-emerald-100 shadow-sm"
          @click="next"
          aria-label="Next"
        >
          <span class="sr-only">Next</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="w-5 h-5 text-emerald-800"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  images: {
    type: Array,
    default: () => []
  },
  intervalMs: {
    type: Number,
    default: 3500
  }
})

const currentIndex = ref(0)
const timerId = ref(null)
const isPaused = ref(false)

function start() {
  stop()
  if (!Array.isArray(props.images) || props.images.length <= 1) return
  timerId.value = setInterval(() => {
    if (isPaused.value) return
    next()
  }, Math.max(1500, props.intervalMs))
}

function stop() {
  if (timerId.value) {
    clearInterval(timerId.value)
    timerId.value = null
  }
}

function pause() { isPaused.value = true }
function resume() { isPaused.value = false }

function next() {
  const total = props.images.length
  if (total <= 1) return
  currentIndex.value = (currentIndex.value + 1) % total
}

function prev() {
  const total = props.images.length
  if (total <= 1) return
  currentIndex.value = (currentIndex.value - 1 + total) % total
}

function goTo(idx) {
  if (idx < 0 || idx >= props.images.length) return
  currentIndex.value = idx
}

watch(() => props.images, () => {
  currentIndex.value = 0
  start()
}, { immediate: true, deep: true })

onMounted(() => {
  start()
})

onBeforeUnmount(() => {
  stop()
})
</script>

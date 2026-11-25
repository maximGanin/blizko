<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import AppHeader from './components/AppHeader.vue'
import ControlPanel from './components/ControlPanel.vue'
import InfoModal from './components/InfoModal.vue'
import MapView from './components/MapView.vue'
import type { CategoryId } from './data/categories'
import type { ChainFilterValue } from './data/chains'
import { getCategoryStats, statForStore } from './lib/savings'

const categoryId = ref<CategoryId>('cheese')
const chainFilter = ref<ChainFilterValue>('all')
const selectedStoreId = ref<string | null>(null)
const infoOpen = ref(false)

const stats = computed(() => getCategoryStats(categoryId.value))
const selectedStat = computed(() => statForStore(stats.value, selectedStoreId.value))

watch(chainFilter, (filter) => {
  if (filter === 'all' || !selectedStoreId.value) return
  const stat = stats.value.stores.find((entry) => entry.store.id === selectedStoreId.value)
  if (stat && stat.store.chain !== filter) selectedStoreId.value = null
})

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && selectedStoreId.value && !infoOpen.value) {
    selectedStoreId.value = null
  }
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <div class="app">
    <AppHeader @info="infoOpen = true" />

    <main class="workspace">
      <ControlPanel
        :stats="stats"
        :category-id="categoryId"
        :chain-filter="chainFilter"
        :selected-store-id="selectedStoreId"
        :selected-stat="selectedStat"
        @update:category-id="categoryId = $event"
        @update:chain-filter="chainFilter = $event"
        @select-store="selectedStoreId = $event"
        @close-store="selectedStoreId = null"
      />

      <section class="map-stage" aria-label="Карта выгодных магазинов">
        <MapView
          :stats="stats"
          :chain-filter="chainFilter"
          :selected-store-id="selectedStoreId"
          :selected-stat="selectedStat"
          @select="selectedStoreId = $event"
          @clear="selectedStoreId = null"
        />
      </section>
    </main>

    <InfoModal :open="infoOpen" @close="infoOpen = false" />
  </div>
</template>

<style scoped>
.app {
  height: 100dvh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.workspace {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: clamp(352px, 27.5vw, 424px) minmax(0, 1fr);
  gap: 18px;
  padding: 0 22px 22px;
}

.map-stage {
  position: relative;
  min-height: 0;
  overflow: hidden;
  border-radius: var(--radius-xl);
  background: #e8eee1;
  box-shadow: var(--shadow-lg);
}

@media (max-width: 1023px) {
  .workspace {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 0 10px calc(10px + env(safe-area-inset-bottom, 0px));
  }

  .map-stage {
    order: -1;
    flex: none;
    height: 42dvh;
    min-height: 240px;
    max-height: 420px;
    border-radius: 24px;
    box-shadow: var(--shadow-md);
  }
}
</style>

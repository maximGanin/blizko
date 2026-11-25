<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import type { CategoryId } from '../data/categories'
import type { ChainFilterValue } from '../data/chains'
import type { CategoryStats, StoreCategoryStat } from '../lib/savings'
import CategorySelect from './CategorySelect.vue'
import ChainFilter from './ChainFilter.vue'
import SavingsHero from './SavingsHero.vue'
import StoreDetailCard from './StoreDetailCard.vue'
import StoreList from './StoreList.vue'

const props = defineProps<{
  stats: CategoryStats
  categoryId: CategoryId
  chainFilter: ChainFilterValue
  selectedStoreId: string | null
  selectedStat: StoreCategoryStat | null
}>()

const emit = defineEmits<{
  'update:categoryId': [CategoryId]
  'update:chainFilter': [ChainFilterValue]
  selectStore: [string]
  closeStore: []
}>()

const panel = ref<HTMLElement | null>(null)

const hasSelection = computed(() => props.selectedStat !== null)

watch(
  () => props.selectedStat,
  async (stat) => {
    if (!stat) return
    if (typeof window === 'undefined' || !window.matchMedia('(max-width: 1023px)').matches)
      return
    await nextTick()
    panel.value?.scrollTo({ top: 0, behavior: 'smooth' })
  },
)
</script>

<template>
  <aside ref="panel" class="panel" :class="{ 'has-selection': hasSelection }">
    <div class="panel__head">
      <div class="intro">
        <span class="intro__eyebrow">
          <i class="intro__pulse" aria-hidden="true" />
          Москва · 15 точек
        </span>
        <h1 class="intro__title">Где закупаться <em>дешевле</em>?</h1>
        <p class="intro__text">
          Выберите категорию — покажем магазины, где корзина стоит меньше средней
          «Пятёрочки».
        </p>
      </div>

      <StoreDetailCard
        v-if="selectedStat"
        class="panel__detail"
        :stat="selectedStat"
        :category-label="stats.category.label"
        @close="emit('closeStore')"
      />

      <CategorySelect
        :model-value="categoryId"
        @update:model-value="emit('update:categoryId', $event)"
      />
      <SavingsHero :stats="stats" />
      <ChainFilter
        :model-value="chainFilter"
        @update:model-value="emit('update:chainFilter', $event)"
      />
    </div>

    <div class="panel__list">
      <StoreList
        :stats="stats"
        :selected-store-id="selectedStoreId"
        :chain-filter="chainFilter"
        @select="emit('selectStore', $event)"
      />
    </div>

    <p class="panel__foot">
      <span class="panel__foot-dot" aria-hidden="true" />
      Демо-проект · адреса реальные, цены — пример
    </p>
  </aside>
</template>

<style scoped>
.panel {
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-width: thin;
  scrollbar-color: var(--line-strong) transparent;
  border: 1px solid rgba(226, 232, 217, 0.9);
  border-radius: var(--radius-xl);
  background: var(--surface);
  box-shadow: var(--shadow-md);
}

.panel__head {
  flex: none;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 22px 20px 0;
}

.intro {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.intro__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.13em;
  text-transform: uppercase;
  color: var(--ink-3);
}

.intro__pulse {
  position: relative;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--green);
}

.intro__pulse::after {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  border: 1px solid rgba(28, 154, 91, 0.4);
  animation: pulse 2.4s ease-out infinite;
}

.intro__title {
  margin: 0;
  font-size: clamp(25px, 2.1vw, 30px);
  font-weight: 800;
  letter-spacing: -0.045em;
  line-height: 1.06;
  color: var(--ink);
}

.intro__title em {
  font-style: normal;
  background: linear-gradient(
    180deg,
    transparent 54%,
    var(--lime) 54%,
    var(--lime) 90%,
    transparent 90%
  );
  padding: 0 2px;
}

.intro__text {
  margin: 0;
  max-width: 320px;
  font-size: 11.5px;
  line-height: 1.55;
  font-weight: 500;
  color: var(--ink-2);
}

.panel__detail {
  display: none;
}

.panel__list {
  flex: none;
  padding: 14px 12px 0;
}

.panel__foot {
  flex: none;
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0;
  padding: 9px 22px 16px;
  font-size: 9.5px;
  font-weight: 600;
  color: var(--ink-3);
}

.panel__foot-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--line-strong);
}

@keyframes pulse {
  0% {
    transform: scale(0.7);
    opacity: 0.9;
  }
  70%,
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

@media (max-width: 1023px) {
  .panel {
    border-radius: 24px;
  }

  .panel__head {
    gap: 11px;
    padding: 14px 12px 0;
  }

  .intro {
    display: none;
  }

  .panel__detail {
    display: block;
    margin-bottom: 2px;
  }

  .panel.has-selection :deep(.hero) {
    display: none;
  }

  .panel__list {
    padding: 12px 4px 0;
  }

  .panel__foot {
    padding: 10px 16px 14px;
  }
}

@media (max-width: 380px) {
  .panel__foot {
    font-size: 9px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .intro__pulse::after {
    animation: none;
  }
}
</style>

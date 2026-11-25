<script setup lang="ts">
import { Sparkles } from 'lucide-vue-next'
import { computed, nextTick, ref, watch } from 'vue'
import { chains, type ChainFilterValue } from '../data/chains'
import type { CategoryStats, StoreCategoryStat } from '../lib/savings'
import { formatRub, savingsLabel } from '../lib/format'

const props = defineProps<{
  stats: CategoryStats
  selectedStoreId: string | null
  chainFilter: ChainFilterValue
}>()

const emit = defineEmits<{ select: [string] }>()

const root = ref<HTMLElement | null>(null)

const visible = computed(() =>
  props.stats.stores.filter(
    (stat) => props.chainFilter === 'all' || stat.store.chain === props.chainFilter,
  ),
)

function tagline(stat: StoreCategoryStat): string {
  if (Math.abs(stat.savingsPct) < 0.5) return 'как в среднем'
  const amount = formatRub(Math.abs(stat.savingsRub))
  return stat.savingsPct > 0 ? `выгода ${amount}` : `переплата ${amount}`
}

function select(storeId: string) {
  emit('select', storeId)
}

watch(
  () => props.selectedStoreId,
  async (storeId) => {
    if (!storeId) return
    if (typeof window !== 'undefined' && !window.matchMedia('(min-width: 1024px)').matches) return
    await nextTick()
    const element = root.value?.querySelector<HTMLElement>(`[data-store-id="${storeId}"]`)
    element?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  },
)
</script>

<template>
  <section ref="root" class="stores" aria-labelledby="stores-title">
    <div class="stores__head">
      <div>
        <h2 id="stores-title" class="stores__title">Точки на карте</h2>
        <p class="stores__subtitle">
          {{ visible.length }} из {{ stats.stores.length }} · к средней «Пятёрочке»
        </p>
      </div>
      <span class="stores__sort">по выгоде</span>
    </div>

    <TransitionGroup v-if="visible.length" tag="div" name="store" class="stores__list">
      <button
        v-for="(stat, index) in visible"
        :key="stat.store.id"
        type="button"
        class="store"
        :class="{ 'is-selected': stat.store.id === selectedStoreId }"
        :data-store-id="stat.store.id"
        :aria-pressed="stat.store.id === selectedStoreId"
        :aria-label="`${chains[stat.store.chain].name}, ${stat.store.address}, ${savingsLabel(stat.savingsPct)} относительно средней «Пятёрочки»`"
        @click="select(stat.store.id)"
      >
        <span class="store__rank" :class="{ 'is-top': index === 0 }" aria-hidden="true">
          {{ String(index + 1).padStart(2, '0') }}
        </span>

        <span class="store__body">
          <span class="store__row">
            <span class="store__chain">
              <i class="store__dot" :style="{ background: chains[stat.store.chain].color }" />
              {{ chains[stat.store.chain].name }}
            </span>
            <span v-if="stat.promoPct > 0" class="store__promo">
              <Sparkles :size="9" :stroke-width="2.4" aria-hidden="true" />
              акция
            </span>
          </span>
          <span class="store__address">{{ stat.store.address }}</span>
          <span class="store__meta">{{ stat.store.district }} · {{ stat.store.hours }}</span>
        </span>

        <span class="store__saving" :class="{ 'is-negative': stat.savingsPct < -0.5 }">
          <strong>{{ savingsLabel(stat.savingsPct) }}</strong>
          <small>{{ tagline(stat) }}</small>
        </span>
      </button>
    </TransitionGroup>

    <p v-else class="stores__empty">В этой сети пока нет точек. Выберите другую сеть.</p>
  </section>
</template>

<style scoped>
.stores {
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.stores__head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  padding: 2px 4px 10px;
}

.stores__title {
  margin: 0;
  font-size: 15px;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--ink);
}

.stores__subtitle {
  margin: 2px 0 0;
  font-size: 10.5px;
  font-weight: 500;
  color: var(--ink-3);
}

.stores__sort {
  flex: none;
  padding: 4px 8px;
  border-radius: 7px;
  background: var(--surface-2);
  color: var(--ink-3);
  font-size: 9.5px;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.stores__list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.store {
  display: grid;
  grid-template-columns: 25px minmax(0, 1fr) auto;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 10px 10px 9px;
  border: 1px solid transparent;
  border-radius: 15px;
  background: transparent;
  color: var(--ink);
  font: inherit;
  text-align: left;
  transition:
    background 0.18s ease,
    border-color 0.18s ease,
    transform 0.18s ease;
}

.store:hover {
  background: var(--surface-2);
  border-color: var(--line);
}

.store:active {
  transform: scale(0.995);
}

.store.is-selected {
  background: var(--mint);
  border-color: #bcdcc2;
}

.store__rank {
  display: grid;
  place-items: center;
  width: 25px;
  height: 25px;
  border-radius: 8px;
  background: var(--surface-2);
  color: var(--ink-3);
  font-size: 9.5px;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.02em;
  transition: background 0.18s ease;
}

.store.is-selected .store__rank {
  background: #fff;
}

.store__rank.is-top {
  background: var(--lime-soft);
  color: #3e5e0a;
}

.store__body {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}

.store__row {
  display: flex;
  align-items: center;
  gap: 5px;
  min-height: 15px;
}

.store__chain {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.01em;
  color: var(--ink-2);
}

.store__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex: none;
}

.store__promo {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 1px 5px 1px 4px;
  border-radius: 5px;
  background: var(--lime-soft);
  color: #517012;
  font-size: 8.5px;
  font-weight: 800;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

.store__address {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: -0.015em;
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.store__meta {
  font-size: 10px;
  font-weight: 500;
  color: var(--ink-3);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.store__saving {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 1px;
  padding-left: 2px;
  font-variant-numeric: tabular-nums;
}

.store__saving strong {
  font-size: 15px;
  font-weight: 800;
  letter-spacing: -0.035em;
  line-height: 1;
  color: var(--green-deep);
}

.store__saving small {
  font-size: 9px;
  font-weight: 600;
  color: var(--ink-3);
  white-space: nowrap;
}

.store__saving.is-negative strong {
  color: var(--clay);
}

.stores__empty {
  margin: 8px 4px;
  padding: 20px;
  border-radius: 14px;
  background: var(--surface-2);
  font-size: 12px;
  color: var(--ink-3);
  text-align: center;
}

.store-move,
.store-enter-active,
.store-leave-active {
  transition:
    transform 0.32s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.22s ease;
}

.store-enter-from,
.store-leave-to {
  opacity: 0;
  transform: translateY(6px);
}

.store-leave-active {
  position: absolute;
  width: calc(100% - 8px);
}

@media (max-width: 1023px) {
  .stores__head {
    padding: 4px 4px 8px;
  }

  .store {
    padding: 9px 8px;
    gap: 9px;
  }

  .store__address {
    font-size: 12.5px;
  }

  .store__saving strong {
    font-size: 14px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .store,
  .store-move,
  .store-enter-active,
  .store-leave-active {
    transition: none;
  }
}
</style>

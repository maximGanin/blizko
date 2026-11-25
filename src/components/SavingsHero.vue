<script setup lang="ts">
import { computed } from 'vue'
import { chains, type ChainId } from '../data/chains'
import type { CategoryStats } from '../lib/savings'
import { formatRub } from '../lib/format'
import { useCountUp } from '../composables/useCountUp'
import CategoryIcon from './CategoryIcon.vue'

const props = defineProps<{ stats: CategoryStats }>()

const target = computed(() => Math.round(props.stats.cheaperChainSavingsPct))
const displayed = useCountUp(target)

const baselineChain = computed<ChainId>(() =>
  props.stats.cheaperChain === 'chizhik' ? 'pyaterochka' : 'chizhik',
)
const cheaper = computed(() => chains[props.stats.cheaperChain])
const baseline = computed(() => chains[baselineChain.value])

const maxPrice = computed(() =>
  Math.max(props.stats.chainAverage.chizhik, props.stats.chainAverage.pyaterochka),
)

function width(chain: ChainId): string {
  return `${(props.stats.chainAverage[chain] / maxPrice.value) * 100}%`
}

const order = computed<ChainId[]>(() => [props.stats.cheaperChain, baselineChain.value])
</script>

<template>
  <section
    class="hero"
    aria-live="polite"
    :aria-label="`${cheaper.name}: экономия ${target}% относительно средней ${baseline.genitive}`"
  >
    <div class="hero__top">
      <span class="hero__category">
        <span class="hero__icon" aria-hidden="true">
          <CategoryIcon :id="stats.category.id" :size="18" />
        </span>
        <span class="hero__category-name">{{ stats.category.label }}</span>
      </span>
      <span class="hero__items">корзина · {{ stats.category.items.length }} товара</span>
    </div>

    <div class="hero__main">
      <div class="hero__number" aria-hidden="true">
        −{{ Math.round(displayed) }}<span class="hero__percent">%</span>
      </div>
      <p class="hero__caption">
        дешевле средней<br />
        <strong>«{{ baseline.name }}»</strong>
      </p>
    </div>

    <div class="hero__bars" aria-hidden="true">
      <div v-for="chain in order" :key="chain" class="bar">
        <span class="bar__name">
          <i class="bar__dot" :style="{ background: chains[chain].color }" />
          {{ chains[chain].name }}
        </span>
        <span class="bar__track">
          <span
            class="bar__fill"
            :class="{ 'is-baseline': chain === baselineChain }"
            :style="{ width: width(chain), background: chains[chain].color }"
          />
        </span>
        <span class="bar__price">{{ formatRub(stats.chainAverage[chain]) }}</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  overflow: hidden;
  padding: 15px 16px 14px;
  border: 1px solid #d8e9c7;
  border-radius: 22px;
  background:
    radial-gradient(130% 150% at 100% 0%, #eafabf 0%, rgba(234, 250, 191, 0) 52%),
    linear-gradient(145deg, #eef8e4 0%, #e3f3d9 58%, #eef8d9 100%);
}

.hero::after {
  content: '';
  position: absolute;
  right: -44px;
  top: -60px;
  width: 154px;
  height: 154px;
  border: 22px solid rgba(255, 255, 255, 0.34);
  border-radius: 50%;
  pointer-events: none;
}

.hero > * {
  position: relative;
  z-index: 1;
}

.hero__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.hero__category {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  min-width: 0;
}

.hero__icon {
  width: 27px;
  height: 27px;
  flex: none;
  display: grid;
  place-items: center;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.72);
  color: var(--green-deep);
  box-shadow: inset 0 0 0 1px rgba(18, 100, 63, 0.08);
}

.hero__category-name {
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.02em;
  color: var(--green-deep);
  text-transform: uppercase;
}

.hero__items {
  font-size: 10.5px;
  font-weight: 600;
  color: #5f7a4d;
  white-space: nowrap;
}

.hero__main {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 9px 0 11px;
}

.hero__number {
  font-size: clamp(42px, 4.4vw, 52px);
  font-weight: 800;
  line-height: 0.92;
  letter-spacing: -0.06em;
  color: var(--forest);
  font-variant-numeric: tabular-nums;
}

.hero__percent {
  font-size: 0.48em;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin-left: 2px;
  color: var(--green-deep);
}

.hero__caption {
  margin: 0;
  font-size: 12px;
  line-height: 1.25;
  font-weight: 600;
  color: #46603a;
  letter-spacing: -0.005em;
}

.hero__caption strong {
  font-weight: 800;
  color: var(--forest);
}

.hero__bars {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.bar {
  display: grid;
  grid-template-columns: 72px minmax(0, 1fr) auto;
  align-items: center;
  gap: 8px;
}

.bar__name {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 10.5px;
  font-weight: 700;
  color: #4f6a41;
  white-space: nowrap;
}

.bar__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex: none;
}

.bar__track {
  position: relative;
  height: 5px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.72);
  overflow: hidden;
}

.bar__fill {
  display: block;
  height: 100%;
  border-radius: inherit;
  transition: width 0.55s cubic-bezier(0.22, 1, 0.36, 1);
  opacity: 0.9;
}

.bar__fill.is-baseline {
  opacity: 0.34;
}

.bar__price {
  font-size: 10.5px;
  font-weight: 800;
  color: var(--forest);
  font-variant-numeric: tabular-nums;
}

@media (max-width: 1023px) {
  .hero {
    padding: 12px 14px;
    border-radius: 18px;
  }

  .hero__main {
    margin: 7px 0 9px;
  }

  .hero__number {
    font-size: 40px;
  }

  .hero__items {
    display: none;
  }
}
</style>

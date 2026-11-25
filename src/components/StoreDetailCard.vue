<script setup lang="ts">
import { ArrowUpRight, Clock3, MapPin, Sparkles, X } from 'lucide-vue-next'
import { computed } from 'vue'
import { chains } from '../data/chains'
import type { StoreCategoryStat } from '../lib/savings'
import { formatRub, savingsLabel } from '../lib/format'

const props = defineProps<{
  stat: StoreCategoryStat
  categoryLabel: string
}>()

defineEmits<{ close: [] }>()

const chain = computed(() => chains[props.stat.store.chain])
const isCheaper = computed(() => props.stat.savingsPct > 0.5)
const isPricier = computed(() => props.stat.savingsPct < -0.5)
const isEven = computed(() => !isCheaper.value && !isPricier.value)

const mapsUrl = computed(() => {
  const [lat, lon] = props.stat.store.coords
  return `https://yandex.ru/maps/?ll=${lon}%2C${lat}&z=17&pt=${lon}%2C${lat}`
})

const savingCaption = computed(() => {
  if (isEven.value) return 'на уровне средней «Пятёрочки»'
  return `${isCheaper.value ? 'дешевле' : 'дороже'} средней «Пятёрочки»`
})

const savingAmount = computed(() => {
  if (isEven.value) return 'как в среднем по сети'
  const amount = formatRub(Math.abs(props.stat.savingsRub))
  return `${isCheaper.value ? 'экономия' : 'переплата'} ${amount}`
})

function itemDelta(price: number, baseline: number): number {
  if (!baseline) return 0
  return ((baseline - price) / baseline) * 100
}
</script>

<template>
  <article class="detail" aria-label="Информация о магазине">
    <header class="detail__head">
      <span class="detail__chain">
        <i class="detail__chain-dot" :style="{ background: chain.color }" aria-hidden="true" />
        <span>{{ chain.name }}</span>
        <span v-if="stat.promoPct > 0" class="detail__promo">
          <Sparkles :size="9" :stroke-width="2.4" aria-hidden="true" />
          акция
        </span>
      </span>
      <button class="detail__close" type="button" aria-label="Закрыть карточку" @click="$emit('close')">
        <X :size="17" :stroke-width="2.2" aria-hidden="true" />
      </button>
    </header>

    <h3 class="detail__address">{{ stat.store.address }}</h3>
    <p class="detail__meta">
      <span><MapPin :size="12" :stroke-width="2" aria-hidden="true" />{{ stat.store.district }}</span>
      <span class="detail__meta-sep" aria-hidden="true" />
      <span><Clock3 :size="12" :stroke-width="2" aria-hidden="true" />{{ stat.store.hours }}</span>
    </p>

    <div
      class="detail__saving"
      :class="{ 'is-negative': isPricier, 'is-even': isEven }"
    >
      <div class="detail__pct">{{ savingsLabel(stat.savingsPct) }}</div>
      <div class="detail__saving-text">
        <strong>{{ savingCaption }}</strong>
        <span>{{ savingAmount }}</span>
      </div>
    </div>

    <div class="detail__basket">
      <div class="detail__basket-row">
        <span>Корзина «{{ categoryLabel }}»</span>
        <strong>{{ formatRub(stat.price) }}</strong>
      </div>
      <div class="detail__basket-row is-muted">
        <span>Средняя «Пятёрочка»</span>
        <span>{{ formatRub(stat.baselinePrice) }}</span>
      </div>

      <div class="detail__products" aria-label="Цены на товары категории">
        <div v-for="item in stat.items" :key="item.name" class="product">
          <span class="product__name">
            {{ item.name }}
            <small>{{ item.unit }}</small>
          </span>
          <span class="product__price">{{ formatRub(item.price) }}</span>
          <span
            class="product__delta"
            :class="{ 'is-negative': itemDelta(item.price, item.baselinePrice) < -0.5 }"
          >
            {{ savingsLabel(itemDelta(item.price, item.baselinePrice)) }}
          </span>
        </div>
      </div>
    </div>

    <div class="detail__tags">
      <span v-for="feature in stat.store.features" :key="feature">{{ feature }}</span>
    </div>

    <a class="detail__cta" :href="mapsUrl" target="_blank" rel="noopener noreferrer">
      Маршрут в Яндекс Картах
      <ArrowUpRight :size="15" :stroke-width="2.2" aria-hidden="true" />
    </a>
  </article>
</template>

<style scoped>
.detail {
  width: 100%;
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.7);
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.94);
  box-shadow:
    0 30px 70px -34px rgba(11, 42, 27, 0.5),
    0 2px 8px rgba(11, 42, 27, 0.06);
  backdrop-filter: blur(18px);
}

.detail__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.detail__chain {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: var(--ink-2);
}

.detail__chain-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex: none;
}

.detail__promo {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 2px 6px 2px 5px;
  border-radius: 5px;
  background: var(--lime-soft);
  color: #517012;
  font-size: 8.5px;
  font-weight: 800;
  letter-spacing: 0.02em;
}

.detail__close {
  flex: none;
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  margin: -4px -4px 0 0;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: var(--surface-2);
  color: var(--ink-2);
  transition:
    background 0.18s ease,
    color 0.18s ease;
}

.detail__close:hover {
  background: var(--surface-3);
  color: var(--ink);
}

.detail__address {
  margin: 9px 0 0;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.2;
  color: var(--ink);
}

.detail__meta {
  display: flex;
  align-items: center;
  gap: 7px;
  margin: 5px 0 0;
  font-size: 10.5px;
  font-weight: 600;
  color: var(--ink-3);
}

.detail__meta span {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  white-space: nowrap;
}

.detail__meta svg {
  color: var(--ink-3);
}

.detail__meta-sep {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: var(--line-strong);
}

.detail__saving {
  display: flex;
  align-items: center;
  gap: 11px;
  margin-top: 12px;
  padding: 10px 12px;
  border-radius: 15px;
  background: var(--mint);
}

.detail__saving.is-negative {
  background: var(--clay-soft);
}

.detail__saving.is-even {
  background: var(--surface-2);
}

.detail__pct {
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.05em;
  line-height: 1;
  color: var(--green-deep);
  font-variant-numeric: tabular-nums;
}

.detail__saving.is-negative .detail__pct {
  color: var(--clay);
}

.detail__saving.is-even .detail__pct {
  color: var(--ink-2);
}

.detail__saving-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.detail__saving-text strong {
  font-size: 11px;
  font-weight: 800;
  line-height: 1.25;
  color: var(--ink);
}

.detail__saving-text span {
  font-size: 10px;
  font-weight: 600;
  color: var(--ink-2);
}

.detail__basket {
  margin-top: 12px;
}

.detail__basket-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  font-size: 11.5px;
  font-weight: 700;
  color: var(--ink);
}

.detail__basket-row strong {
  font-size: 13px;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.detail__basket-row.is-muted {
  margin-top: 2px;
  font-size: 10.5px;
  font-weight: 600;
  color: var(--ink-3);
}

.detail__products {
  margin-top: 9px;
  border-top: 1px solid var(--line);
}

.product {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto 40px;
  align-items: center;
  gap: 8px;
  padding: 6px 0;
  border-bottom: 1px solid #edf1e7;
  font-size: 10.5px;
}

.product:last-child {
  border-bottom: none;
}

.product__name {
  display: flex;
  align-items: baseline;
  gap: 4px;
  min-width: 0;
  font-weight: 600;
  color: var(--ink-2);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product__name small {
  flex: none;
  font-size: 9px;
  font-weight: 500;
  color: var(--ink-3);
}

.product__price {
  font-weight: 800;
  color: var(--ink);
  font-variant-numeric: tabular-nums;
}

.product__delta {
  justify-self: end;
  padding: 2px 5px;
  border-radius: 5px;
  background: var(--mint);
  color: var(--green-deep);
  font-size: 9px;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
}

.product__delta.is-negative {
  background: var(--clay-soft);
  color: var(--clay);
}

.detail__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 10px;
}

.detail__tags span {
  padding: 3px 7px;
  border-radius: 6px;
  background: var(--surface-2);
  color: var(--ink-3);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.detail__cta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 38px;
  margin-top: 12px;
  border-radius: 12px;
  background: var(--forest);
  color: #fff;
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: -0.005em;
  text-decoration: none;
  transition:
    background 0.18s ease,
    transform 0.18s ease;
}

.detail__cta:hover {
  background: #123a26;
}

.detail__cta:active {
  transform: scale(0.99);
}

@media (max-width: 1023px) {
  .detail {
    padding: 14px;
    border-radius: 20px;
    background: var(--surface);
    box-shadow: 0 14px 34px -26px rgba(11, 42, 27, 0.4);
    backdrop-filter: none;
  }

  .detail__address {
    font-size: 17px;
  }

  .detail__pct {
    font-size: 26px;
  }
}
</style>

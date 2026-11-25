<script setup lang="ts">
import { chains, type ChainFilterValue } from '../data/chains'
import { stores } from '../data/stores'

defineProps<{ modelValue: ChainFilterValue }>()
const emit = defineEmits<{ 'update:modelValue': [ChainFilterValue] }>()

const options: { id: ChainFilterValue; label: string; count: number }[] = [
  { id: 'all', label: 'Все', count: stores.length },
  {
    id: 'chizhik',
    label: chains.chizhik.name,
    count: stores.filter((store) => store.chain === 'chizhik').length,
  },
  {
    id: 'pyaterochka',
    label: chains.pyaterochka.name,
    count: stores.filter((store) => store.chain === 'pyaterochka').length,
  },
]
</script>

<template>
  <div class="filter" role="group" aria-label="Фильтр по сети магазинов">
    <button
      v-for="option in options"
      :key="option.id"
      type="button"
      class="filter__button"
      :class="{ 'is-active': modelValue === option.id }"
      :aria-pressed="modelValue === option.id"
      @click="emit('update:modelValue', option.id)"
    >
      <i
        v-if="option.id !== 'all'"
        class="filter__dot"
        :style="{ background: option.id === 'chizhik' ? chains.chizhik.color : chains.pyaterochka.color }"
        aria-hidden="true"
      />
      <span>{{ option.label }}</span>
      <span class="filter__count">{{ option.count }}</span>
    </button>
  </div>
</template>

<style scoped>
.filter {
  display: flex;
  gap: 3px;
  padding: 3px;
  border-radius: 14px;
  background: var(--surface-2);
  border: 1px solid var(--line);
}

.filter__button {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  height: 36px;
  padding: 0 6px;
  border: none;
  border-radius: 11px;
  background: transparent;
  color: var(--ink-2);
  font: inherit;
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: -0.01em;
  white-space: nowrap;
  transition:
    background 0.2s ease,
    color 0.2s ease,
    box-shadow 0.2s ease;
}

.filter__button:hover {
  color: var(--ink);
}

.filter__button.is-active {
  background: var(--forest);
  color: #fff;
  box-shadow: 0 6px 14px -8px rgba(11, 42, 27, 0.7);
}

.filter__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex: none;
}

.filter__button.is-active .filter__dot {
  background: var(--lime) !important;
}

.filter__count {
  display: inline-grid;
  place-items: center;
  min-width: 17px;
  height: 17px;
  padding: 0 4px;
  border-radius: 6px;
  background: rgba(11, 42, 27, 0.06);
  color: var(--ink-3);
  font-size: 9.5px;
  font-weight: 800;
}

.filter__button.is-active .filter__count {
  background: rgba(255, 255, 255, 0.14);
  color: rgba(255, 255, 255, 0.8);
}

@media (max-width: 1023px) {
  .filter__button {
    height: 34px;
  }
}
</style>

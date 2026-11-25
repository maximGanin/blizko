<script setup lang="ts">
import { Check, ChevronDown } from 'lucide-vue-next'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { categories, type CategoryId } from '../data/categories'
import { getCategoryStats } from '../lib/savings'
import CategoryIcon from './CategoryIcon.vue'

const props = defineProps<{ modelValue: CategoryId }>()
const emit = defineEmits<{ 'update:modelValue': [CategoryId] }>()

const open = ref(false)
const activeIndex = ref(0)
const root = ref<HTMLElement | null>(null)
const trigger = ref<HTMLButtonElement | null>(null)

const selectedIndex = computed(() =>
  Math.max(
    categories.findIndex((category) => category.id === props.modelValue),
    0,
  ),
)
const selected = computed(() => categories[selectedIndex.value] ?? categories[0])
const selectedSavings = computed(() =>
  Math.round(getCategoryStats(selected.value.id).cheaperChainSavingsPct),
)

const categorySavings = new Map(
  categories.map((category) => [
    category.id,
    Math.round(getCategoryStats(category.id).cheaperChainSavingsPct),
  ]),
)

function openMenu() {
  activeIndex.value = selectedIndex.value
  open.value = true
  nextTick(() => scrollActiveIntoView())
}

function closeMenu(returnFocus = false) {
  open.value = false
  if (returnFocus) trigger.value?.focus()
}

function toggleMenu() {
  if (open.value) closeMenu()
  else openMenu()
}

function move(delta: number) {
  const count = categories.length
  activeIndex.value = (activeIndex.value + delta + count) % count
  nextTick(() => scrollActiveIntoView())
}

function scrollActiveIntoView() {
  document.getElementById(`category-option-${activeIndex.value}`)?.scrollIntoView({
    block: 'nearest',
  })
}

function choose(id: CategoryId) {
  emit('update:modelValue', id)
  closeMenu(true)
}

function onTriggerKeydown(event: KeyboardEvent) {
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      if (open.value) move(1)
      else openMenu()
      break
    case 'ArrowUp':
      event.preventDefault()
      if (open.value) move(-1)
      else openMenu()
      break
    case 'Home':
      if (open.value) {
        event.preventDefault()
        activeIndex.value = 0
        nextTick(() => scrollActiveIntoView())
      }
      break
    case 'End':
      if (open.value) {
        event.preventDefault()
        activeIndex.value = categories.length - 1
        nextTick(() => scrollActiveIntoView())
      }
      break
    case 'Enter':
    case ' ':
      if (open.value) {
        event.preventDefault()
        choose(categories[activeIndex.value].id)
      }
      break
    case 'Escape':
      if (open.value) {
        event.preventDefault()
        closeMenu()
      }
      break
    case 'Tab':
      closeMenu()
      break
  }
}

function onPointerDown(event: PointerEvent) {
  if (!open.value) return
  if (root.value && !root.value.contains(event.target as Node)) closeMenu()
}

function onFocusOut(event: FocusEvent) {
  const next = event.relatedTarget as Node | null
  if (next && root.value?.contains(next)) return
  closeMenu()
}

watch(open, (isOpen) => {
  if (isOpen) nextTick(() => scrollActiveIntoView())
})

onMounted(() => document.addEventListener('pointerdown', onPointerDown))
onBeforeUnmount(() => document.removeEventListener('pointerdown', onPointerDown))
</script>

<template>
  <div ref="root" class="category" @focusout="onFocusOut">
    <span id="category-label" class="category__label">Что покупаем?</span>

    <button
      ref="trigger"
      class="category__trigger"
      type="button"
      role="combobox"
      aria-haspopup="listbox"
      aria-controls="category-listbox"
      aria-labelledby="category-label category-value"
      :aria-expanded="open"
      :aria-activedescendant="open ? `category-option-${activeIndex}` : undefined"
      @click="toggleMenu"
      @keydown="onTriggerKeydown"
    >
      <span class="category__icon" aria-hidden="true">
        <CategoryIcon :id="selected.id" :size="21" />
      </span>
      <span id="category-value" class="category__value">
        <span class="category__name">{{ selected.label }}</span>
        <span class="category__hint">{{ selected.description }}</span>
      </span>
      <span class="category__badge" aria-hidden="true">−{{ selectedSavings }}%</span>
      <ChevronDown class="category__chevron" :class="{ 'is-open': open }" :size="18" aria-hidden="true" />
    </button>

    <Transition name="dropdown">
      <ul
        v-if="open"
        id="category-listbox"
        class="category__list"
        role="listbox"
        aria-labelledby="category-label"
      >
        <li
          v-for="(category, index) in categories"
          :id="`category-option-${index}`"
          :key="category.id"
          class="category__option"
          :class="{
            'is-active': index === activeIndex,
            'is-selected': category.id === modelValue,
          }"
          role="option"
          :aria-selected="category.id === modelValue"
          @click="choose(category.id)"
          @mousemove="activeIndex = index"
        >
          <span class="category__option-icon" aria-hidden="true">
            <CategoryIcon :id="category.id" :size="18" />
          </span>
          <span class="category__option-text">
            <span class="category__option-name">{{ category.label }}</span>
            <small class="category__option-hint">{{ category.description }}</small>
          </span>
          <span class="category__option-saving">−{{ categorySavings.get(category.id) }}%</span>
          <Check
            v-if="category.id === modelValue"
            class="category__option-check"
            :size="16"
            :stroke-width="2.5"
            aria-hidden="true"
          />
        </li>
      </ul>
    </Transition>
  </div>
</template>

<style scoped>
.category {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.category__label {
  font-size: 10.5px;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ink-3);
  padding-left: 4px;
}

.category__trigger {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  min-height: 64px;
  padding: 10px 14px 10px 10px;
  border: 1px solid var(--line);
  border-radius: 18px;
  background: var(--surface-2);
  color: var(--ink);
  font: inherit;
  text-align: left;
  transition:
    border-color 0.2s ease,
    background 0.2s ease,
    box-shadow 0.2s ease;
}

.category__trigger:hover {
  border-color: var(--line-strong);
  background: #f9fbf5;
}

.category__trigger[aria-expanded='true'] {
  background: var(--surface);
  border-color: #bfd7b2;
  box-shadow: 0 0 0 4px rgba(28, 154, 91, 0.08);
}

.category__icon {
  flex: none;
  width: 43px;
  height: 43px;
  display: grid;
  place-items: center;
  border-radius: 13px;
  background: var(--mint);
  color: var(--green-deep);
}

.category__value {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
  flex: 1;
}

.category__name {
  font-size: 15.5px;
  font-weight: 800;
  letter-spacing: -0.015em;
  line-height: 1.25;
}

.category__hint {
  font-size: 11px;
  font-weight: 500;
  color: var(--ink-3);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.category__badge {
  flex: none;
  padding: 5px 8px;
  border-radius: 8px;
  background: var(--lime-soft);
  color: #3e5e0a;
  font-size: 11.5px;
  font-weight: 800;
  letter-spacing: -0.01em;
}

.category__chevron {
  flex: none;
  color: var(--ink-3);
  transition: transform 0.25s ease;
}

.category__chevron.is-open {
  transform: rotate(180deg);
}

.category__list {
  position: absolute;
  z-index: 70;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  max-height: min(340px, 52vh);
  overflow-y: auto;
  margin: 0;
  padding: 6px;
  list-style: none;
  border: 1px solid var(--line);
  border-radius: 20px;
  background: var(--surface);
  box-shadow:
    0 24px 60px -24px rgba(11, 42, 27, 0.35),
    0 2px 6px rgba(11, 42, 27, 0.04);
  overscroll-behavior: contain;
}

.category__option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 9px;
  border-radius: 13px;
  cursor: pointer;
  outline: none;
  transition: background 0.15s ease;
}

.category__option.is-active {
  background: var(--surface-2);
}

.category__option.is-selected {
  background: var(--mint);
}

.category__option-icon {
  flex: none;
  width: 33px;
  height: 33px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  background: var(--surface-3);
  color: var(--ink-2);
}

.category__option.is-selected .category__option-icon {
  background: rgba(255, 255, 255, 0.75);
  color: var(--green-deep);
}

.category__option-text {
  display: flex;
  flex-direction: column;
  min-width: 0;
  flex: 1;
}

.category__option-name {
  font-size: 13.5px;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.category__option-hint {
  font-size: 10.5px;
  color: var(--ink-3);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.category__option-saving {
  flex: none;
  font-size: 11px;
  font-weight: 800;
  color: var(--green-deep);
}

.category__option-check {
  flex: none;
  color: var(--green-deep);
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition:
    opacity 0.16s ease,
    transform 0.16s ease;
  transform-origin: top center;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.985);
}

@media (max-width: 1023px) {
  .category__trigger {
    min-height: 58px;
    border-radius: 16px;
  }

  .category__icon {
    width: 38px;
    height: 38px;
    border-radius: 11px;
  }

  .category__list {
    max-height: min(280px, 28vh);
  }
}
</style>

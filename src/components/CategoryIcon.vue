<script setup lang="ts">
import { Apple, Candy, Croissant, CupSoda, Drumstick, Milk, Snowflake, SprayCan, Wheat } from 'lucide-vue-next'
import type { Component } from 'vue'
import type { CategoryId } from '../data/categories'

withDefaults(defineProps<{ id: CategoryId; size?: number }>(), { size: 20 })

const icons: Record<Exclude<CategoryId, 'cheese'>, Component> = {
  dairy: Milk,
  bread: Croissant,
  meat: Drumstick,
  produce: Apple,
  grocery: Wheat,
  drinks: CupSoda,
  frozen: Snowflake,
  sweets: Candy,
  household: SprayCan,
}
</script>

<template>
  <svg
    v-if="id === 'cheese'"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path d="M3 19 12.2 5 21 9.1v9.1a1.7 1.7 0 0 1-2.2 1.6L3 19Z" />
    <path d="m3 19 18-5.9" />
    <circle cx="15.6" cy="12.3" r="1.25" />
    <circle cx="10.4" cy="15.1" r=".95" />
    <circle cx="17.4" cy="15.7" r=".8" />
  </svg>
  <component
    :is="icons[id as Exclude<CategoryId, 'cheese'>]"
    v-else
    :size="size"
    :stroke-width="1.8"
    aria-hidden="true"
  />
</template>

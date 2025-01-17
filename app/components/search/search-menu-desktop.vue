<script setup lang="ts">
import type { ProductFragment } from '@@/types/shopify';

// Props
const props = defineProps<{
  products: ProductFragment[];
  searchQuery: string;
}>();

// Stores
const appStore = useAppStore();

// Suggested links
const defaulSearchLinks = [
  { label: 'Mens tops', path: '/' },
  { label: 'Womens tops', path: '/' },
  { label: 'Womens Pants', path: '/' }
];

// State
const input = ref<HTMLInputElement | null>(null);

// Emits
const emit = defineEmits([
  'debounceQuery',
  'submitQuery',
  'closeSearch'
]);

// Emit events
const setQuery = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('debounceQuery', target.value);
};

const onKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    emit('submitQuery');
  }
};

const closeSearch = () => {
  emit('closeSearch');
};

// Watchers
watch(
  () => appStore.searchMenuOpen,
  () => {
    nextTick(() => {
      input.value?.focus();
    });
  }
);
</script>

<template>
  <Transition name="slider" mode="out-in" appear>
    <aside
      v-if="appStore.searchMenuOpen"
      class="hidden fixed top-0 left-0 z-[80] w-full bg-white lg:flex lg:min-h-[400px]"
    >
      <div class="flex flex-col gap-6 w-full px-6 pt-16 pb-10 mx-auto xl:max-w-6xl">
        <div class="relative w-full">
          <input
            ref="input"
            type="text"
            name="searchInput"
            placeholder="Search products"
            autocapitalize="off"
            autocomplete="off"
            autocorrect="off"
            class="peer flex w-full py-2 pl-8 normal-case bg-white border-b border-zinc-300 appearance-none rounded-none placeholder:text-zinc-400 focus:border-black focus:outline-none"
            @input="setQuery"
            @keydown="onKeyDown"
          >
          <div class="absolute flex inset-y-0 start-0 items-center text-zinc-400 peer-focus:text-black select-none">
            <Icon name="ph:magnifying-glass" class="h-5 w-5 shrink-0"/>
          </div>
          <button
            class="absolute flex inset-y-0 end-0 items-center text-zinc-400 peer-focus:text-black active:text-black"
            @click="closeSearch"
          >
            <Icon name="ph:x" class="h-5 w-5 shrink-0" />
          </button>
        </div>
        <div class="grid grid-cols-[280px_1fr] gap-12">
          <div class="flex flex-col gap-4">
            <h3 class="text-sm">Suggestions</h3>
            <div v-if="props.searchQuery.length && props.products?.length" class="flex flex-col">
              <SuggestedLink
                v-for="product in products"
                :key="product.id"
                :product="product"
              />
            </div>
            <div v-else class="flex flex-col">
              <NuxtLink
                v-for="link in defaulSearchLinks"
                :key="link.label"
                :to="link.path"
                class="max-w-fit normal-case hover:text-gray-500"
              >
                {{ link.label }}
              </NuxtLink>
            </div>
          </div>
          <div v-if="props.searchQuery.length && props.products?.length" class="flex flex-col gap-4">
            <h3 class="text-sm">Products</h3>
            <div class="grid grid-cols-2 gap-8 w-full">
              <SuggestedProductCard
                v-for="product in products"
                :key="product.id"
                :product="product"
              />
            </div>
          </div>
        </div>
      </div>
    </aside>
  </Transition>
  <Transition name="fade" mode="out-in" appear>
    <div
      v-if="appStore.searchMenuOpen"
      class="hidden fixed inset-0 z-[50] pointer-events-auto bg-black/50 lg:flex"
      @click="closeSearch"
    />
  </Transition>
</template>

<style lang="css" scoped>
.slider-enter-active,
.slider-leave-active {
  @apply transform translate-x-0 lg:translate-y-0;
  @apply transition duration-500 ease-[cubic-bezier(0.32,0.72,0,1)];
}

.slider-enter-from,
.slider-leave-to {
  @apply transform translate-x-full lg:translate-x-0 lg:-translate-y-full;
  @apply transition duration-500 ease-[cubic-bezier(0.32,0.72,0,1)];
}

.fade-enter-active,
.fade-leave-active {
  @apply opacity-100;
  @apply transition duration-300 ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  @apply opacity-0;
  @apply transition duration-300 ease-in-out;
}
</style>

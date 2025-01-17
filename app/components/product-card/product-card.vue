<script setup lang="ts">
import type { ProductFragment } from '@@/types/shopify';

// Props
const props = defineProps<{
  product: ProductFragment;
}>();

// Helpers
const { getColorOption } = useShopifyHelpers();

// Computed
const options = computed(() => props.product?.options);
const colorOption = computed(() => getColorOption(options.value));
const colorOptionName = computed(() => colorOption.value?.optionValues[0]?.name);
const mediaItems = computed(() => flattenConnection(props.product.media))
</script>

<template>
  <NuxtLink
    :to="`/products/${product.handle}`"
    class="relative flex flex-col gap-4"
  >
    <ProductCardTags :product="product" />
    <ProductCardMedia :media-items="mediaItems" />
    <div class="flex flex-col">
      <div class="mb-2">
        <h2 v-if="product.title">{{ product.title }}</h2>
        <h3 v-if="colorOption" class="normal-case">
          {{ colorOptionName }}
        </h3>
      </div>
      <PriceDisplay
        :price="product.priceRange.minVariantPrice"
        :compare-at-price-range="product.compareAtPriceRange.minVariantPrice"
      />
    </div>
  </NuxtLink>
</template>

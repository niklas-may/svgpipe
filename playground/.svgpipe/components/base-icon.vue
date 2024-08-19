<template>
  <SvgXOctagon v-if="name === 'x-octagon'" v-bind="$attrs" />
  <SvgYoutube v-if="name === 'youtube'" v-bind="$attrs" />
  <SvgZoomOut v-if="name === 'zoom-out'" v-bind="$attrs" />
</template>
<script setup lang="ts">
import { type BaseIconProps } from "./../types/base-icon-props.ts";

import SvgXOctagon from "./../playground/svg/logos/x-octagon.svg?component";
import SvgYoutube from "./../playground/svg/logos/youtube.svg?component";
import SvgZoomOut from "./../playground/svg/logos/zoom-out.svg?component";

defineProps<{
  name: BaseIconProps;
}>();
</script>

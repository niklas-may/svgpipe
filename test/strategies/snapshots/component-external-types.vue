<template>
  <SvgXOctagon v-if="name === 'x-octagon'" v-bind="$attrs" />
  <SvgYoutube v-if="name === 'youtube'" v-bind="$attrs" />
  <SvgZoomOut v-if="name === 'zoom-out'" v-bind="$attrs" />
</template>
<script setup lang="ts">
import { type BaseIconProps } from "../types/base-icon-props.ts";

import SvgXOctagon from "../svgs/x-octagon.svg?component";
import SvgYoutube from "../svgs/youtube.svg?component";
import SvgZoomOut from "../svgs/zoom-out.svg?component";

defineProps<{
  name: BaseIconProps;
}>();
</script>

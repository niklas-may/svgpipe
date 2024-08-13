<template>
  <SvgXOctagon v-if="name === 'x-octagon'" />
  <SvgXSquare v-if="name === 'x-square'" />
  <SvgX v-if="name === 'x'" />
  <SvgYoutube v-if="name === 'youtube'" />
  <SvgZapOff v-if="name === 'zap-off'" />
  <SvgZap v-if="name === 'zap'" />
  <SvgZoomIn v-if="name === 'zoom-in'" />
  <SvgZoomOut v-if="name === 'zoom-out'" />
</template>
<script setup lang="ts">
import SvgXOctagon from "../svg/logos/x-octagon.svg?component";
import SvgXSquare from "../svg/logos/x-square.svg?component";
import SvgX from "../svg/logos/x.svg?component";
import SvgYoutube from "../svg/logos/youtube.svg?component";
import SvgZapOff from "../svg/logos/zap-off.svg?component";
import SvgZap from "../svg/logos/zap.svg?component";
import SvgZoomIn from "../svg/logos/zoom-in.svg?component";
import SvgZoomOut from "../svg/logos/zoom-out.svg?component";

defineProps<{
  name:
    | "x-octagon"
    | "x-square"
    | "x"
    | "youtube"
    | "zap-off"
    | "zap"
    | "zoom-in"
    | "zoom-out";
}>();
</script>

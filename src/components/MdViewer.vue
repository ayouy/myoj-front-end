<template>
    <Viewer :value="value" :plugins="plugins" />
</template>

<script setup lang="ts">
import gfm from "@bytemd/plugin-gfm";
import highlight from "@bytemd/plugin-highlight";
import math from "@bytemd/plugin-math";
import mathLocale from "@bytemd/plugin-math/locales/zh_Hans.json";
import "katex/dist/katex.css";
import "bytemd/dist/index.css";
import { Editor, Viewer } from "@bytemd/vue-next";
import { ref } from "vue";

interface Props {
    value: string;
}

const plugins = [ gfm(),
    highlight(),
    math({
        locale: mathLocale,
        katexOptions: {
            output: "html",
        },
    }),];

const props = withDefaults(defineProps<Props>(), {
    value: () => "",
})


</script>

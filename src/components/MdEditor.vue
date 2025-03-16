<template>
    <Editor
        :value="value"
        :mode="mode"
        @change="handleChange"
        :plugins="plugins"
    />
</template>

<script setup lang="ts">
import gfm from "@bytemd/plugin-gfm";
import highlight from "@bytemd/plugin-highlight";
import math from "@bytemd/plugin-math";
import mathLocale from "@bytemd/plugin-math/locales/zh_Hans.json";
import { Editor, Viewer } from "@bytemd/vue-next";
import { ref } from "vue";
import "katex/dist/katex.css";
import "bytemd/dist/index.css";

interface Props {
    value: string;
    mode?: string;
    handleChange: (v: string) => void;
}

const plugins = [
    gfm(),
    highlight(),
    math({
        locale: mathLocale,
        katexOptions: {
            output: "html",
        },
    }),
];

const props = withDefaults(defineProps<Props>(), {
    value: () => "",
    mode: () => "split",
    handleChange: (v: string) => {
        console.log(v);
    },
});
</script>

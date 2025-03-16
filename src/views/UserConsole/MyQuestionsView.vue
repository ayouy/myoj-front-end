<template>
    <div class="home">
        <!--<MdEditor :value="mdValue" :handleChange="onMdChange" />-->
        <CodeEditor :value="codeValue" :handleChange="onCodeChange" />
    </div>
</template>

<script setup lang="ts">
import MdEditor from "@/components/MdEditor.vue";
import CodeEditor from "@/components/CodeEditor.vue";
import { ref } from "vue";
const mdValue = ref("");
const codeValue = ref("");
const onCodeChange = (v: string) => {
    codeValue.value = v;
    //console.log(v);
};

const onMdChange = (v: string) => {
    mdValue.value = v;
    //console.log(v);
};
</script>

<template>
    <div
        id="code-editor"
        ref="codeEditorRef"
        style="min-height: 560px; height: 75vh"
    />
    <!-- <a-button @click="fillValue">填充值</a-button> -->
</template>

<script setup lang="ts">
import * as monaco from "monaco-editor";
import { languages } from "monaco-editor/esm/metadata";
import { onMounted, ref, toRaw, withDefaults, defineProps, watch } from "vue";

const codeEditorRef = ref();
const codeEditor = ref();

interface Props {
    value: string;
    handleChange: (v: string) => void;
    language?: string;
}

const props = withDefaults(defineProps<Props>(), {
    value: "",
    handleChange: (v: string) => {
        console.log(v);
    },
    language: () => "cpp",
});

watch(
    () => props.language,
    () => {
        if (codeEditor.value) {
            monaco.editor.setModelLanguage(
                toRaw(codeEditor.value).getModel(),
                props.language,
            );
        }
    },
);

onMounted(() => {
    if (!codeEditorRef.value) return;
    codeEditor.value = monaco.editor.create(codeEditorRef.value, {
        value: props.value,
        language: props.language,
        minimap: {
            enabled: false,
        },
        folding: true,
        foldingHighlight: true,
        foldingStrategy: "indentation",
        colorDecorators: true,
        tabSize: 4,
        insertSpaces: true,
        detectIndentation: true,
        automaticLayout: true,
        lineNumbers: "on",
        roundedSelection: false,
        scrollBeyondLastLine: false,
        readOnly: false,
        theme: "vs-dark",
    });

    codeEditor.value.onDidChangeModelContent(() => {
        props.handleChange(toRaw(codeEditor.value).getValue());
    });
});
</script>

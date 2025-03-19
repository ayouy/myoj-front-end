<template>
    <div class="organization-container">
        <div class="header">
            <h1>组织管理</h1>
            <p class="description">在这里管理您的组织设置和成员</p>
        </div>

        <!-- <a-card class="editor-card">
            <CodeEditor :value="codeValue" :handleChange="onCodeChange" />
        </a-card> -->
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
};

const onMdChange = (v: string) => {
    mdValue.value = v;
};
</script>

<style scoped>
.organization-container {
    padding: 24px;
    background: linear-gradient(
        145deg,
        rgba(255, 255, 255, 0.05),
        rgba(255, 255, 255, 0.02)
    );
    min-height: 100vh;
}

.header {
    margin-bottom: 32px;
}

.header h1 {
    color: rgba(255, 255, 255, 0.9);
    font-size: 28px;
    margin-bottom: 8px;
}

.header .description {
    color: rgba(255, 255, 255, 0.6);
    font-size: 14px;
}

.editor-card {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
}

.editor-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 40px rgba(0, 0, 0, 0.15);
    transition: all 0.3s ease;
}
</style>

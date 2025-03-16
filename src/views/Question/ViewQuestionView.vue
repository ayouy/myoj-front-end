<template>
    <div id="ViewQuestionView">
        <a-row :gutter="[24, 24]">
            <a-col :md="12" :xs="24">
                <a-tabs default-active-key="question">
                    <a-tab-pane key="question" title="题目详情">
                        <a-card v-if="question" :title="question.title">
                            <template #extra>
                                <a-space wrap>
                                    <a-tag
                                        v-for="(tag, index) of (typeof question.tags === 'string' ? JSON.parse(question.tags) : question.tags)"
                                        :key="index"
                                        color="arcoblue"
                                        v-if="Array.isArray(typeof question.tags === 'string' ? JSON.parse(question.tags) : question.tags)"
                                    >
                                        {{ tag }}
                                    </a-tag>
                                    <a-tag v-else color="red">Invalid tags format</a-tag>
                                </a-space>
                            </template>
                            <div>
                                <a-descriptions
                                    title="题目限制"
                                    :column="{ xs: 1, md: 2, lg: 3 }"
                                >
                                    <a-descriptions-item label="时间限制">
                                        <a-tag>{{
                                            `${question.judgeConfig?.timeLimit / 1000}s`
                                        }}</a-tag>
                                    </a-descriptions-item>
                                    <a-descriptions-item label="空间限制">
                                        <a-tag>{{
                                            `${question.judgeConfig?.memoryLimit}kb`
                                        }}</a-tag>
                                    </a-descriptions-item>
                                    <a-descriptions-item label="堆栈限制">
                                        <a-tag>{{
                                            `${question.judgeConfig?.stackLimit}kb`
                                        }}</a-tag>
                                    </a-descriptions-item>
                                </a-descriptions>
                            </div>
                            <MdViewer :value="question.content || ''" />
                        </a-card>
                    </a-tab-pane>
                    <a-tab-pane key="answer" title="题解">
                        {{ (question && question.answer) || "" }}
                    </a-tab-pane>
                    <a-tab-pane key="comment" title="讨论" disabled>
                        Content of Tab 3
                    </a-tab-pane>
                </a-tabs>
            </a-col>
            <a-col :md="12" :xs="24">
                <a-form :model="form" layout="inline">
                    <a-form-item
                        field="title"
                        label="语言"
                        style="min-width: 240px"
                    >
                        <a-select
                            v-model="form.language"
                            :style="{ width: '320px' }"
                            placeholder="选择语言"
                        >
                            <a-option>java</a-option>
                            <a-option>c</a-option>
                            <a-option>cpp</a-option>
                            <a-option>python</a-option>
                            <a-option>go</a-option>
                        </a-select>
                    </a-form-item>
                </a-form>
                <CodeEditor
                    :value="form.code"
                    :language="form.language"
                    :handleChange="changeCode"
                />
                <a-divider size="0"></a-divider>
                <a-button
                    type="primary"
                    style="min-width: 140px"
                    @click="doSubmit"
                    >提交</a-button
                >
            </a-col>
        </a-row>
    </div>
</template>
<script setup lang="ts">
import {
    QuestionControllerService,
    Question,
    QuestionVO,
    QuestionSubmitAddRequest,
    QuestionSubmitControllerService,
} from "../../../generated";
import { onMounted, ref, watchEffect, defineProps, withDefaults } from "vue";
import message from "@arco-design/web-vue/es/message";
import { Pagination } from "@arco-design/web-vue";
import { useRouter } from "vue-router";
import moment from "moment";
import CodeEditor from "@/components/CodeEditor";
import MdViewer from "@/components/MdViewer.vue";

const show = ref(true);
const question = ref<QuestionVO>();
const router = useRouter();

interface Props {
    id: string;
}

const props = withDefaults(defineProps<Props>(), {
    id: () => "",
});

const loadData = async () => {
    const res = await QuestionControllerService.getQuestionVoByIdUsingGet(
        props.id as any,
    );
    if (res.code === 0) {
        question.value = res.data;
    } else {
        message.error("获取题目信息失败," + res.message);
    }
};

const form = ref<QuestionSubmitAddRequest>({
    language: "cpp",
    code: "",
});

const doSubmit = async () => {
    if (!question.value.id) return;
    const res = await QuestionControllerService.doQuestionSubmitUsingPost({
        ...form.value,
        questionId: question.value?.id,
    });
    if (res.code === 0) {
        message.success("提交成功");
    } else {
        message.error("提交失败" + res.message);
    }
};

const changeCode = (value: string) => {
    form.value.code = value;
};

onMounted(() => {
    loadData();
});
</script>
<style>
#ViewQuestionView {
    max-width: 1600px;
    margin: 0 auto;
    min-height: 100vh;
    overflow-y: auto;
    overflow-x: hidden;
}

#ViewQuestionView .arco-space-horizontal .arco-space-item {
    margin-bottom: 0 !important;
}
</style>

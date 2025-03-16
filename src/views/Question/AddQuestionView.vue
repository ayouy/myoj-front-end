<template>
    <div id="addQuestionView">
        <h2>编辑题目信息</h2>
        <a-form :model="form" label-align="right">
            <a-form-item field="title" label="标题">
                <a-input v-model="form.title" placeholder="题目标题" />
            </a-form-item>
            <a-form-item field="content" label="内容">
                <MdEditor
                    :value="form.content"
                    :handleChange="onContentChange"
                />
            </a-form-item>
            <a-form-item field="answer" label="答案">
                <MdEditor :value="form.answer" :handleChange="onAnswerChange" />
            </a-form-item>
            <a-form-item field="tags" label="标签">
                <a-input-tag
                    v-model="form.tags"
                    placeholder="请输入标签"
                    allow-clear
                />
            </a-form-item>

            <a-form-item
                label="题目限制"
                :context-flex="false"
                :merge-props="false"
            >
                <a-space direction="vertical" style="min-width: 480px">
                    <a-form-item
                        field="judgeConfig.timeLimit"
                        label="时间限制(ms)"
                    >
                        <a-input-number
                            v-model="form.judgeConfig.timeLimit"
                            placeholder="时间限制(ms)"
                            mode="button"
                            size="large"
                            step="1000"
                            min="0"
                        />
                    </a-form-item>
                    <a-form-item
                        field="judgeConfig.memoryLimit"
                        label="空间限制(kb)"
                    >
                        <a-input-number
                            v-model="form.judgeConfig.memoryLimit"
                            placeholder="空间限制(kb)"
                            mode="button"
                            size="large"
                            min="0"
                        />
                    </a-form-item>
                    <a-form-item
                        field="judgeConfig.stackLimit"
                        label="堆栈限制(kb)"
                    >
                        <a-input-number
                            v-model="form.judgeConfig.stackLimit"
                            placeholder="栈空间(kb)"
                            mode="button"
                            size="large"
                            min="0"
                        />
                    </a-form-item>
                </a-space>
            </a-form-item>
            <a-form-item
                label="编辑测试用例"
                :content-flex="false"
                :merge-props="false"
            >
                <a-form-item
                    v-for="(caseItem, index) of form.judgeCase"
                    :key="index"
                    no-style
                >
                    <a-space direction="vertical" style="min-width: 640px">
                        <a-form-item
                            :field="`form.judgeCase[${index}].input`"
                            :label="`输入数据${index + 1}`"
                            :key="index"
                        >
                            <a-input
                                v-model="caseItem.input"
                                placeholder="请输入输入数据"
                            />
                        </a-form-item>
                        <a-form-item
                            :field="`form.judgeCase[${index}].output`"
                            :label="`输出数据${index + 1}`"
                            :key="index"
                        >
                            <a-input
                                v-model="caseItem.output"
                                placeholder="请输入输出数据"
                            />
                        </a-form-item>
                        <a-button
                            status="danger"
                            @click="handleDlete(index)"
                            style="margin-left: 50px; margin-bottom: 25px"
                        >
                            删除
                        </a-button>
                    </a-space>
                </a-form-item>
                <div>
                    <a-button
                        status="success"
                        type="outline"
                        style="margin-left: 50px"
                        @click="handleAdd"
                        >新增测试用例</a-button
                    >
                </div>
            </a-form-item>
            <div style="margin-top: 16px">
                <a-form-item>
                    <a-button
                        style="min-width: 160px"
                        type="primary"
                        html-type="submit"
                        @click="doSubmit"
                        >提交</a-button
                    >
                </a-form-item>
            </div>
        </a-form>
    </div>
</template>
<script setup lang="ts">
import MdEditor from "@/components/MdEditor.vue";
import {
    QuestionAddRequest,
    QuestionControllerService,
} from "../../../generated";
import { onMounted, reactive, ref } from "vue";
import message from "@arco-design/web-vue/es/message";
import { useRoute } from "vue-router";

const route = useRoute();
const upDatePage = route.path.includes("update");

let form = ref({
    answer: "",
    content: "",
    judgeCase: [
        {
            input: "",
            output: "",
        },
    ],
    judgeConfig: {
        memoryLimit: 1000,
        stackLimit: 128,
        timeLimit: 128,
    },
    tags: [],
    title: "",
});

const loadData = async () => {
    const id = route.query.id;
    if (!id) return;
    const res = await QuestionControllerService.getQuestionByIdUsingGet(
        id as any,
    );
    if (res.code === 0) {
        form.value = res.data as any;
        if (!form.value.judgeCase) {
            form.value.judgeCase = [
                {
                    input: "",
                    output: "",
                },
            ];
        } else {
            form.value.judgeCase = JSON.parse(form.value.judgeCase as any);
        }
        if (!form.value.judgeConfig) {
            form.value.judgeConfig = {
                memoryLimit: 1000,
                stackLimit: 128,
                timeLimit: 128,
            };
        } else {
            form.value.judgeConfig = JSON.parse(form.value.judgeConfig as any);
        }
        if (!form.value.tags) {
            form.value.tags = [];
        } else {
            form.value.tags = JSON.parse(form.value.tags as any);
        }
    } else {
        message.error("获取题目信息失败", res.message);
    }
};

onMounted(() => {
    loadData();
});

const handleAdd = () => {
    form.value.judgeCase.push({
        input: "",
        output: "",
    });
};

const handleDlete = (index: number) => {
    form.value.judgeCase.splice(index, 1);
};

const doSubmit = async () => {
    console.log(form.value);
    if (upDatePage) {
        const res = await QuestionControllerService.updateQuestionUsingPost(
            form.value,
        );
        if (res.code === 0) {
            message.success("更新成功");
            window.location.reload();
            // setTimeout(() => {
            //     window.location.reload();
            // }, 2000);
        } else {
            message.error("更新失败" + res.message);
        }
    } else {
        const res = await QuestionControllerService.addQuestionUsingPost(
            form.value,
        );
        if (res.code === 0) {
            message.success("添加成功");
        } else {
            message.error("添加失败," + res.message);
        }
    }
};

const onAnswerChange = (v) => {
    form.value.answer = v;
};

const onContentChange = (v) => {
    form.value.content = v;
};
</script>
<style scoped></style>

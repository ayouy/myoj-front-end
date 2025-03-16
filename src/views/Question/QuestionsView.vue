<template>
    <div id="QuestionsView">
        <h2>题目列表</h2>
        <a-form :model="searchParams" layout="inline">
            <a-form-item field="title" label="题目名称">
                <a-input
                    v-model="searchParams.title"
                    placeholder="题目名称"
                    style="min-width: 280px"
                />
            </a-form-item>
            <a-form-item field="tags" label="标签">
                <a-input-tag
                    v-model="searchParams.tags"
                    placeholder="标签"
                    style="min-width: 280px"
                />
            </a-form-item>
            <a-form-item>
                <a-button type="primary" @click="doSearch">搜索</a-button>
            </a-form-item>
        </a-form>
        <a-divider size="0"></a-divider>
        <a-table
            :columns="columns"
            :data="questionList"
            :pagination="{
                showTotal: true,
                pageSize: searchParams.pageSize,
                current: searchParams.current,
                total: total,
            }"
            @page-change="onPageChange"
        >
            <template #tags="{ record }">
                <a-space wrap>
                    <a-tag
                        bordered
                        v-for="(tag, index) of record.tags"
                        :key="index"
                        color="arcoblue"
                    >
                        {{ tag }}
                    </a-tag>
                </a-space>
            </template>
            <template #ratio="{ record }">
                {{
                    `${record.acceptNum ? (record.acceptNum / record.submitNum) * 100 : `0`}%
                    (${record.acceptNum}/${record.submitNum})`
                }}
            </template>
            <template #createTime="{ record }">
                {{ moment(record.createTime).format("YYYY-MM-DD") }}
            </template>
            <template #optional="{ record }">
                <a-space>
                    <a-button type="primary" @click="toQuestionPage(record)"
                        >进入</a-button
                    >
                </a-space>
            </template>
        </a-table>
    </div>
</template>
<script setup lang="ts">
import {
    QuestionControllerService,
    Question,
    QuestionQueryRequest,
} from "../../../generated";
import { onMounted, ref, watchEffect } from "vue";
import message from "@arco-design/web-vue/es/message";
import { Pagination } from "@arco-design/web-vue";
import { useRouter } from "vue-router";
import moment from "moment";

const show = ref(true);
const questionList = ref([]);
const total = ref(0);
const router = useRouter();

const searchParams = ref<QuestionQueryRequest>({
    title: "",
    tags: [],
    pageSize: 8,
    current: 1,
});

const loadData = async () => {
    const res = await QuestionControllerService.listMyQuestionVoByPageUsingPost(
        searchParams.value,
    );
    if (res.code === 0) {
        questionList.value = res.data.records;
        total.value = res.data.total;
    } else {
        message.error("获取题目列表失败," + res.message);
    }
};

const toQuestionPage = (question: QUestion) => {
    router.push({
        path: `view/question/${question.id}`,
    });
};

const onPageChange = (page: number) => {
    searchParams.value = {
        ...searchParams.value,
        current: page,
    };
};

const doSearch = () => {
    searchParams.value = {
        ...searchParams.value,
        current: 1,
    };
};

//监听参数变化
watchEffect(() => {
    loadData();
});

onMounted(() => {
    loadData();
});

const columns = [
    {
        title: "题号",
        dataIndex: "id",
    },
    {
        title: "标题",
        dataIndex: "title",
    },
    {
        title: "标签",
        slotName: "tags",
    },
    {
        title: "通过率",
        slotName: "ratio",
    },

    {
        title: "创建时间",
        slotName: "createTime",
    },
    {
        title: "操作",
        slotName: "optional",
    },
];
</script>
<style scoped>
#QuestionsView {
    max-width: 1280px;
    margin: 0 auto;
}
</style>

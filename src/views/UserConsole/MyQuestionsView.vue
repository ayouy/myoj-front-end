<template>
    <div id="myQuestionsView">
        <a-card title="我的题目" :bordered="false">
            <a-form
                :model="searchParams"
                layout="inline"
                class="search-form"
                @submit.prevent="doSearch"
            >
                <a-form-item field="title" label="题目名称">
                    <a-input
                        v-model="searchParams.title"
                        placeholder="请输入题目名称"
                        allow-clear
                    />
                </a-form-item>
                <a-form-item>
                    <a-button
                        type="primary"
                        html-type="submit"
                        :loading="loading"
                    >
                        查询
                    </a-button>
                    <a-button @click="resetSearch" style="margin-left: 12px">
                        重置
                    </a-button>
                </a-form-item>
            </a-form>

            <a-divider />

            <a-table
                :columns="columns"
                :data="questionList"
                :pagination="pagination"
                :loading="loading"
                :bordered="false"
                @page-change="onPageChange"
            >
                <template #tags="{ record }">
                    <a-space>
                        <a-tag
                            v-for="(tag, index) in JSON.parse(
                                record.tags || '[]',
                            )"
                            :key="index"
                            color="blue"
                        >
                            {{ tag }}
                        </a-tag>
                    </a-space>
                </template>
                <template #optional="{ record }">
                    <a-space>
                        <a-button type="primary" @click="doUpdate(record)">
                            编辑
                        </a-button>
                        <a-popconfirm
                            content="确定要删除该题目吗？"
                            @ok="doDelete(record)"
                        >
                            <a-button status="danger">删除</a-button>
                        </a-popconfirm>
                    </a-space>
                </template>
                <template #empty>
                    <a-empty description="暂无题目数据" />
                </template>
            </a-table>
        </a-card>
    </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import {
    QuestionControllerService,
    type Question,
    type QuestionQueryRequest,
} from "../../../generated";
import { Message } from "@arco-design/web-vue";

const router = useRouter();
const loading = ref(false);
const store = useStore();
const user = store.state?.user.loginUser;
const questionList = ref<Question[]>([]);
const total = ref(0);
const searchParams = ref<QuestionQueryRequest>({
    title: undefined,
    tags: undefined,
    pageSize: 10,
    current: 1,
});
const pagination = ref({
    showTotal: true,
    pageSize: searchParams.value.pageSize,
    current: searchParams.value.current,
    total: total.value,
    showJumper: true,
    showPageSize: true,
});

const loadData = async () => {
    try {
        loading.value = true;
        const res =
            await QuestionControllerService.listMyQuestionByPageUsingPost(
                searchParams.value,
            );
        if (res.code === 0) {
            questionList.value = res.data.records;
            console.log(questionList.value);
            total.value = res.data.total;
            pagination.value.total = total.value;
            pagination.value.current = searchParams.value.current;
        } else {
            Message.error(`获取题目列表失败: ${res.message}`);
        }
    } catch (error) {
        Message.error("请求失败，请稍后重试" + error.message);
    } finally {
        loading.value = false;
    }
};

const doDelete = async (question: Question) => {
    try {
        const res = await QuestionControllerService.deleteQuestionUsingPost({
            id: question.id,
        });
        if (res.code === 0) {
            Message.success("删除成功");
            loadData();
        } else {
            Message.error(`删除失败: ${res.message}`);
        }
    } catch (error) {
        Message.error("删除失败，请稍后重试");
    }
};

const doUpdate = (question: Question) => {
    router.push({ path: "/update/question", query: { id: question.id } });
};

const doSearch = () => {
    searchParams.value.current = 1;
    loadData();
};

const resetSearch = () => {
    searchParams.value = { title: undefined, pageSize: 10, current: 1 };
};

const onPageChange = (page: number) => {
    searchParams.value.current = page;
    loadData();
};

watchEffect(() => {
    loadData();
});

const columns = [
    { title: "ID", dataIndex: "id", width: 100 },
    { title: "标题", dataIndex: "title", width: 300 },
    { title: "标签", slotName: "tags", width: 300 },
    { title: "提交数", dataIndex: "submitNum", width: 120 },
    { title: "通过数", dataIndex: "acceptNum", width: 120 },
    { title: "操作", slotName: "optional", width: 200 },
];
</script>

<style scoped lang="less">
#myQuestionsView {
    max-width: 1280px;
    margin: 0 auto;
    padding: 24px;
    animation: fadeIn 0.6s ease-in-out;

    .search-form {
        margin-bottom: 24px;
        animation: slideInDown 0.5s ease-in-out;
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes slideInDown {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>

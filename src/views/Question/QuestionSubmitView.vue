<template>
  <div id="QuestionSubmitView">
    <a-card title="提交记录" :bordered="false">
      <a-form
        :model="searchParams"
        layout="inline"
        class="search-form"
        @submit.prevent="doSearch"
      >
        <a-form-item field="questionId" label="题目ID">
          <a-input
            v-model="searchParams.questionId"
            placeholder="请输入题目ID"
            allow-clear
          />
        </a-form-item>

        <a-form-item field="language" label="提交语言">
          <a-select
            v-model="searchParams.language"
            placeholder="选择语言"
            allow-clear
          >
            <a-option value="java">Java</a-option>
            <a-option value="c">C</a-option>
            <a-option value="cpp">C++</a-option>
            <a-option value="python">Python</a-option>
          </a-select>
        </a-form-item>

        <a-form-item>
          <a-button type="primary" html-type="submit" :loading="loading">
            搜索
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
        <template #status="{ record }">
          <a-tag :color="getStatusColor(record?.status)" :bordered="true">
            <span v-if="record?.status === 1" class="spinner"></span>
            {{ getStatusText(record?.status) }}
          </a-tag>
        </template>

        <template #judgeInfo="{ record }">
          <a-popover position="right" content-class="judge-info-popover">
            <template #content>
              <a-descriptions
                :column="1"
                :data="formatJudgeInfo(record?.judgeInfo)"
                bordered
                size="small"
              />
            </template>
            <a-link>查看判题信息</a-link>
          </a-popover>
        </template>

        <template #code="{ record }">
          <a-button
            type="text"
            size="mini"
            @click="viewCode(record)"
          >
            <template #icon>
              <icon-code />
            </template>
            查看代码
          </a-button>
        </template>

        <template #createTime="{ record }">
          {{ formatTime(record?.createTime) }}
        </template>

        <template #empty>
          <a-empty description="没有提交记录" />
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { 
  QuestionControllerService,
  type QuestionSubmitQueryRequest
} from '../../../generated'
import { Message } from '@arco-design/web-vue'
import { IconCode } from '@arco-design/web-vue/es/icon'

interface QuestionSubmit {
  id?: number
  questionId?: number
  userId?: number
  language?: string
  status?: number
  judgeInfo?: any
  createTime?: string
  code?: string
}

const router = useRouter()
const loading = ref(false)
const questionList = ref<QuestionSubmit[]>([])
const total = ref(0)

const statusTextMap = {
  0: 'Submit Failed',
  1: 'Pending',
  2: 'Accepted',
  3: 'Wrong Answer',
  4: 'Time Limit Exceeded',
  5: 'Memory Limit Exceeded',
  6: 'Runtime Error',
  7: 'System Error'
}

const statusColorMap = {
  0: 'gray',
  1: 'orange',
  2: 'green',
  3: 'red',
  4: 'purple',
  5: 'magenta',
  6: 'cyan',
  7: 'red'
}

const labelMap = {
  "message": "结果",
  "time": "耗时",
  "memory": "内存"
}

const searchParams = ref<QuestionSubmitQueryRequest>({
  questionId: undefined,
  language: undefined,
  pageSize: 10,
  current: 1,
})

const pagination = ref({
  showTotal: true,
  pageSize: searchParams.value.pageSize,
  current: searchParams.value.current,
  total: total.value,
})

const getStatusText = (status?: number) => {
  if (status === undefined) return '未知状态'
  return statusTextMap[status] || '未知状态'
}

const getStatusColor = (status?: number) => {
  if (status === undefined) return 'gray'
  return statusColorMap[status] || 'gray'
}

const formatTime = (time?: string) => {
  if (!time) return ''
  return new Date(time).toLocaleString()
}

const formatJudgeInfo = (judgeInfo?: any) => {
  if (!judgeInfo) return []
  return Object.entries(judgeInfo).map(([key, value]) => ({
    label: labelMap[key],
    value: value
  }))
}

const viewCode = (record: any) => {
  router.push({
    name: 'CodeDetail',
    params: { id: record.id }
  })
}

const loadData = async () => {
  try {
    loading.value = true
    const res = await QuestionControllerService.listQuestionSubmitByPageUsingPost({
      ...searchParams.value,
      sortField: 'createTime',
      sortOrder: 'descend',
    })
    
    if (res.code === 0) {
      questionList.value = res.data?.records || []
      total.value = res.data?.total || 0
      pagination.value.total = total.value
      pagination.value.current = searchParams.value.current
    } else {
      Message.error(`获取提交记录失败: ${res.message}`)
    }
  } catch (error) {
    Message.error('请求失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

const doSearch = () => {
  searchParams.value.current = 1
  loadData()
}

const resetSearch = () => {
  searchParams.value = {
    questionId: undefined,
    language: undefined,
    pageSize: 10,
    current: 1,
  }
  loadData()
}

const onPageChange = (page: number) => {
  searchParams.value.current = page
  loadData()
}

watchEffect(() => {
  loadData()
})

const columns = [
  {
    title: '提交ID',
    dataIndex: 'id',
    width: 120,
    slotName: 'id',
  },
  {
    title: '语言',
    dataIndex: 'language',
    width: 100,
  },
  {
    title: '状态',
    slotName: 'status',
    width: 120,
  },
  {
    title: '判题信息',
    slotName: 'judgeInfo',
    width: 120,
  },
  {
    title: '题目ID',
    dataIndex: 'questionId',
    width: 120,
  },
  {
    title: '用户ID',
    dataIndex: 'userId',
    width: 120,
  },
  {
    title: '提交时间',
    slotName: 'createTime',
    width: 180,
  },
  {
    title: "代码",
    slotName: 'code',
    width: 120,
  }
]
</script>

<style scoped lang="less">
#QuestionSubmitView {
  max-width: 1500px;
  margin: 0 auto;
  padding: 24px;

  .search-form {
    margin-bottom: 24px;
  }

  .spinner {
    display: inline-block;
    width: 12px;
    height: 12px;
    border: 2px solid currentColor;
    border-radius: 50%;
    border-top-color: transparent;
    animation: spin 1s linear infinite;
    margin-right: 6px;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
}
</style>

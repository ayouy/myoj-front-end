<template>
  <a-card title="代码详情" :bordered="false">
    <a-descriptions :column="1" bordered>
      <a-descriptions-item label="提交ID">{{ codeDetail.id }}</a-descriptions-item>
      <a-descriptions-item label="问题ID">{{ codeDetail.questionId }}</a-descriptions-item>
      <a-descriptions-item label="用户ID">{{ codeDetail.userId }}</a-descriptions-item>
      <a-descriptions-item label="编程语言">{{ codeDetail.language }}</a-descriptions-item>
      <a-descriptions-item label="提交时间">{{ formatTime(codeDetail.createTime) }}</a-descriptions-item>
      <a-descriptions-item label="状态">
        <a-tag :color="getStatusColor(codeDetail.status)">
          {{ getStatusText(codeDetail.status) }}
        </a-tag>
      </a-descriptions-item>
    </a-descriptions>

    <a-divider />

    <a-card title="代码内容" :bordered="false">
      <pre>{{ codeDetail.code }}</pre>
    </a-card>

    <a-divider />

    <a-card title="判题信息" :bordered="false" v-if="codeDetail.judgeInfo">
      <a-descriptions :column="1" bordered>
        <a-descriptions-item 
          v-for="(value, key) in codeDetail.judgeInfo" 
          :key="key"
          :label="key"
        >
          {{ value }}
        </a-descriptions-item>
      </a-descriptions>
    </a-card>
  </a-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { QuestionControllerService, QuestionSubmitControllerService } from '../../../generated'
import type { QuestionSubmitVO } from '../../../generated/models'
import { Message } from '@arco-design/web-vue'

const route = useRoute()
const codeDetail = ref<QuestionSubmitVO>({})

const statusTextMap = {
  0: '提交失败',
  1: 'Pending',
  2: '已通过', 
  3: '答案错误',
  4: '时间超限',
  5: '内存超限',
  6: '运行时错误',
  7: '系统错误'
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

onMounted(async () => {
  try {
    const id = route.params.id
    const res = await QuestionControllerService.getQuestionSubmitVoByIdUsingGet(id)
    if (res.code === 0) {
      codeDetail.value = res.data
    } else {
      Message.error(`获取提交详情失败: ${res.message}`)
    }
  } catch (error) {
    Message.error('请求失败，请稍后重试')
  }
})
</script>

<style scoped>
pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  background: #f5f5f5;
  padding: 16px;
  border-radius: 4px;
}
</style>

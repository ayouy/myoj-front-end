<template>
    <a-card title="仪表盘" style="min-height: 100%">
        <a-row gutter={16}>
            <a-col span="8">
                <a-card title="统计数据" hoverable>
                    <p>用户注册数：100</p>
                    <p>题目数量：50</p>
                    <p>比赛进行中：3</p>
                </a-card>
            </a-col>
            <a-col span="8">
                <a-card title="近期活动" hoverable>
                    <p>今天有2场比赛</p>
                    <p>最近提交题目数：5</p>
                </a-card>
            </a-col>
            <a-col span="8">
                <a-card title="系统通知" hoverable>
                    <p>系统更新成功</p>
                    <p>用户提醒：修改密码</p>
                </a-card>
            </a-col>
        </a-row>
    </a-card>
</template>

<script setup lang="ts">
</script>

<style scoped>
</style>
<template>
    <a-card title="个人信息" :bordered="false">
        <a-form :model="form" layout="vertical">
            <a-form-item label="用户名">
                <a-input v-model:value="form.username" placeholder="请输入用户名" />
            </a-form-item>
            <a-form-item label="账号名">
                <a-input v-model:value="form.account" disabled placeholder="不能修改的账号名" />
            </a-form-item>
            <a-form-item label="个人简介">
                <a-textarea v-model:value="form.bio" placeholder="输入个人简介" />
            </a-form-item>
            <a-form-item label="组织ID">
                <a-input v-model:value="form.organizationId" placeholder="输入组织ID" />
            </a-form-item>
            <a-form-item label="上传头像">
                <a-upload
                    :file-list="fileList"
                    :before-upload="beforeUpload"
                    :on-change="handleAvatarChange"
                    :show-upload-list="false"
                >
                    <a-button icon="icon-upload">点击上传头像</a-button>
                </a-upload>
                <div v-if="avatarUrl" class="avatar-preview">
                    <img :src="avatarUrl" alt="Avatar" class="avatar-image" />
                </div>
            </a-form-item>
            <a-form-item>
                <a-button type="primary" @click="handleSubmit">保存</a-button>
            </a-form-item>
        </a-form>
    </a-card>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Message from "@arco-design/web-vue";

const form = ref({
    username: "",
    account: "user@example.com", 
    bio: "",
    organizationId: "",
});

const avatarUrl = ref<string | null>(null);
const fileList = ref([]);

const beforeUpload = (file: any) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png" || file.type =="image/jpg" || file.type =="image/gif";
    if (!isJpgOrPng) {
        Message.error("只能上传 JPG/PNG 文件");
    }
    const isLt7M = file.size / 1024 / 1024 < 7; // 2MB 限制
    if (!isLt7M) {
        Message.error("图片大小不能超过 7MB");
    }
    return isJpgOrPng && isLt2M;
};

const handleAvatarChange = (info: any) => {
    if (info.file.status === "done") {
        avatarUrl.value = URL.createObjectURL(info.file.originFileObj);
    } else if (info.file.status === "error") {
        Message.error("头像上传失败");
    }
};

const handleSubmit = () => {
    Message.success("个人信息已保存！");
};
</script>

<style scoped>
.avatar-preview {
    margin-top: 16px;
}

.avatar-image {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
}
</style>

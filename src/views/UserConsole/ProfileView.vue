<template>
    <a-card title="用户信息" style="width: 400px">
        <div class="profile-container">
            <a-upload
                :show-file-list="false"
                :before-upload="beforeUpload"
                action="http://localhost:9527/api/cos/upload/avatar"
                @success="handleAvatarSuccess"
            >
                <template #upload-button>
                    <div
                        :class="`arco-upload-list-item${
                            file && file.status === 'error'
                                ? ' arco-upload-list-item-error'
                                : ''
                        }`"
                    >
                        <div
                            class="arco-upload-list-picture custom-upload-avatar"
                            v-if="userRef.userAvatar"
                        >
                            <img :src="userRef.userAvatar" />
                            <div class="arco-upload-list-picture-mask">
                                <IconEdit />
                            </div>
                        </div>
                        <div class="arco-upload-picture-card" v-else>
                            <div class="arco-upload-picture-card-text">
                                <IconPlus />
                                <div style="margin-top: 10px; font-weight: 600">
                                    Upload
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </a-upload>

            <a-descriptions bordered :column="1">
                <a-descriptions-item label="用户名" style="width: 100%;">
                    <a-input v-model="userRef.userName" placeholder="请输入昵称" />
                </a-descriptions-item>
            </a-descriptions>
            <div style="width: 100%; text-align: left; font-weight: bold; margin-top: 10px">
                简介
            </div>
            <a-textarea v-model="user.userProfile" placeholder="请输入简介" />

            <a-button
                type="primary"
                @click="updateProfile"
                style="margin-top: 10px"
            >
                保存修改
            </a-button>
        </div>
    </a-card>
</template>

<script setup>
import { computed, ref } from "vue";
import { Message } from "@arco-design/web-vue";
import { UserControllerService } from "../../../generated";
import { useStore } from "vuex";

const store = useStore();
const user = computed(() => store.state?.user?.loginUser);
const userRef = ref({ ...store.state?.user?.loginUser });

const beforeUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
        Message.error("请上传图片格式！");
        return false;
    }
    return true;
};

const handleAvatarSuccess = async (response) => {
    if (response.response.code === 0) {
        const newAvatar = response.response.data;
        userRef.value.userAvatar = newAvatar;
        store.commit("user/updateUser", {
            ...user.value,
            userAvatar: newAvatar,
        });
        await UserControllerService.updateMyUserUsingPost(userRef.value);
        Message.success("头像上传成功！");
    } else {
        Message.error("头像上传失败：" + response.response.message);
    }
};

// 更新用户信息
const updateProfile = async () => {
    try {
        await UserControllerService.updateMyUserUsingPost(userRef.value);
        Message.success("修改成功！");
        store.commit("user/updateUser", userRef.value);
    } catch (error) {
        Message.error("修改失败！");
    }
};
</script>

<style scoped>
.profile-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}

.avatar-upload {
    cursor: pointer;
    border-radius: 50%;
    transition: all 0.3s;
}

.avatar-upload:hover {
    opacity: 0.8;
}
</style>

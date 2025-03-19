<template>
  <a-card class="profile-card" :loading="loading">
      <div class="profile-container">
          <!-- 头像上传 -->
          <a-upload
              :show-file-list="false"
              :before-upload="beforeUpload"
              action="http://localhost:9527/api/cos/upload/avatar"
              @success="handleAvatarSuccess"
              @error="handleAvatarError"
          >
              <template #upload-button>
                  <div class="avatar-upload-wrapper">
                      <div class="avatar-preview">
                          <img
                              :src="
                                  userRef.userAvatar ||
                                  '@/assets/default-avatar.png'
                              "
                              class="avatar-image"
                          />
                          <div class="avatar-overlay">
                              <icon-camera class="camera-icon" />
                              <span class="upload-text">更换头像</span>
                          </div>
                      </div>
                  </div>
              </template>
          </a-upload>

          <!-- 个人信息表单 -->
          <div class="profile-form">
              <div class="form-item">
                  <label class="form-label">用户名</label>
                  <a-input
                      v-model="userRef.userName"
                      placeholder="请输入昵称"
                      class="profile-input"
                      allow-clear
                  />
              </div>

              <div class="form-item">
                  <label class="form-label">邮箱</label>
                  <a-input
                      v-model="userRef.email"
                      placeholder="请输入邮箱"
                      class="profile-input"
                      allow-clear
                  />
              </div>

              <div class="form-item">
                  <label class="form-label">个人简介</label>
                  <a-textarea
                      v-model="userRef.userProfile"
                      placeholder="介绍一下自己吧~"
                      class="profile-textarea"
                      :auto-size="{ minRows: 3, maxRows: 5 }"
                      allow-clear
                  />
              </div>

              <a-button
                  type="primary"
                  @click="updateProfile"
                  class="save-button"
                  :loading="saving"
              >
                  <template #icon>
                      <icon-save />
                  </template>
                  保存修改
              </a-button>
          </div>
      </div>
  </a-card>
</template>

<script setup>
import { computed, ref } from "vue";
import { Message } from "@arco-design/web-vue";
import { UserControllerService } from "../../../generated";
import { useStore } from "vuex";
import { IconCamera, IconSave } from "@arco-design/web-vue/es/icon";

const store = useStore();
const user = computed(() => store.state?.user?.loginUser);
const userRef = ref({ ...store.state?.user?.loginUser });
const loading = ref(false);
const saving = ref(false);

const beforeUpload = (file) => {
  const isImage = file.type.startsWith("image/");
  if (!isImage) {
      Message.error({
          content: "请上传图片格式！",
          duration: 3000,
          closable: true,
      });
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
      Message.success({
          content: "头像上传成功！",
          duration: 3000,
          closable: true,
      });
  } else {
      handleAvatarError();
  }
};

const handleAvatarError = () => {
  Message.error({
      content: "头像上传失败，请稍后重试",
      duration: 3000,
      closable: true,
  });
};

const updateProfile = async () => {
  saving.value = true;
  try {
      await UserControllerService.updateMyUserUsingPost(userRef.value);
      Message.success({
          content: "修改成功！",
          duration: 3000,
          closable: true,
      });
      store.commit("user/updateUser", userRef.value);
  } catch (error) {
      Message.error({
          content: "修改失败：" + error.message,
          duration: 3000,
          closable: true,
      });
  } finally {
      saving.value = false;
  }
};
</script>

<style scoped lang="less">
.profile-card {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
  border: none;
  border-radius: 16px;
  background: linear-gradient(145deg, #ffffff, #f5f7fa);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  }
}

.profile-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.avatar-upload-wrapper {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  &:hover {
      transform: scale(1.05);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  }

  .avatar-preview {
      width: 100%;
      height: 100%;
      position: relative;

      .avatar-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
      }

      .avatar-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: all 0.3s ease;

          .camera-icon {
              color: #fff;
              font-size: 24px;
              margin-bottom: 4px;
              transition: transform 0.2s ease;
          }

          .upload-text {
              color: #fff;
              font-size: 12px;
              transition: transform 0.2s ease;
          }
      }
  }

  &:hover {
      .avatar-overlay {
          opacity: 1;
      }

      .avatar-image {
          transform: scale(1.1);
      }

      .camera-icon {
          transform: translateY(-4px);
      }

      .upload-text {
          transform: translateY(4px);
      }
  }
}

.profile-form {
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-1);
}

.profile-input,
.profile-textarea {
  border: none;
  border-radius: 8px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:focus {
      box-shadow: 0 4px 12px rgba(var(--color-primary-rgb), 0.2);
  }
}

.save-button {
  width: 100%;
  margin-top: 16px;
  height: 40px;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  background: linear-gradient(145deg, var(--color-primary), #6c5ce7);
  color: #fff;
  transition: all 0.3s ease;

  &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(var(--color-primary-rgb), 0.2);
  }

  &:active {
      transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .profile-card {
      margin: 16px;
      padding: 16px;
  }

  .avatar-upload-wrapper {
      width: 100px;
      height: 100px;
  }
}
</style>
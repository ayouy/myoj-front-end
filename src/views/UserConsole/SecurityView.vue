<template>
    <div id="UserChangePassword">
        <h2 style="margin-bottom: 16px">修改密码</h2>
        <a-form
            style="max-width: 480px; margin: 0 auto"
            label-align="left"
            auto-label-width
            :model="form"
            @submit="handleSubmit"
        >
            <a-form-item
                field="newPassword"
                tooltip="密码8-16位,且包含字母和数字"
                label="新密码"
            >
                <a-input-password
                    v-model="form.newPassword"
                    placeholder="请输入新密码"
                />
            </a-form-item>
            <a-form-item field="confirmPassword" label="确认新密码">
                <a-input-password
                    v-model="form.confirmPassword"
                    placeholder="请再次输入新密码"
                />
            </a-form-item>
            <a-form-item>
                <a-button
                    html-type="submit"
                    type="primary"
                    style="width: 120px"
                >
                    提交修改
                </a-button>
            </a-form-item>
        </a-form>
    </div>
</template>

<script setup lang="ts">
import { UserControllerService } from "../../../generated";
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { Message } from "@arco-design/web-vue";
import { useStore } from "vuex";
import { computed, ref } from "vue";

const store = useStore();
const user = computed(() => store.state?.user?.loginUser);
const userRef = ref({ ...store.state?.user?.loginUser });
const form = reactive({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
});

const validatePassword = () => {
    if (form.newPassword !== form.confirmPassword) {
        Message.error("两次输入的密码不一致");
        return false;
    }
    if (form.newPassword?.length < 8) {
        Message.error("密码长度不得少于8位");
        return false;
    }
    const passwordReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/;
    if (!passwordReg.test(form.newPassword)) {
        Message.error("新密码必须包含字母和数字,且长度不得少于8位");
        return false;
    }
    return true;
};

const handleSubmit = async () => {
    if (!validatePassword()) return;

    try {
        const res = await UserControllerService.update(form);
        if (res.code === 0) {
            Message.success("密码修改成功");
        } else {
            Message.error("修改失败：" + res.message);
        }
    } catch (error) {
        Message.error("请求失败，请检查网络连接");
    }
};
</script>

<style>
#UserChangePassword {
    min-height: 300px;
}
</style>

import accessEnum from "./accessEnum";
import router from "@/router";
import store from "@/store";
import checkAccess from "./checkAccess";

router.beforeEach(async (to, from, next) => {
    console.log("登录用户：" + store.state.user.loginUser.userName);
    let loginUser = store.state.user.loginUser;
    //  初始用户不存在userRole，登录成功直接使用await执行后续代码
    if (!loginUser || !loginUser.userRole) {
        await store.dispatch("user/getLoginUser");
        loginUser = store.state.user.loginUser; 
    }

    const needAccess = (to.meta?.access as string) ?? accessEnum.NOT_LOGIN;
    /***
     * 若当前页面不需要权限且未登录，仍可跳转
     * 若需要权限且未登录，跳转到登录
     * 若需要权限且已登录，验证权限
     */
    if (needAccess !== accessEnum.NOT_LOGIN) {
        if (!loginUser || !loginUser.userRole || loginUser.userRole === accessEnum.NOT_LOGIN) {
            next(`/user/login?redirect=${to.fullPath}`);
            return;
        } else if (!checkAccess(loginUser, needAccess)) {
            next(`/hide`);
            return;
        }
        if (!checkAccess(loginUser, needAccess)) {
            next("/hide");
            return;
        }
    }
    next();
});

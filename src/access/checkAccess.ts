import accessEnum from "./accessEnum";

/**
 * @param User 用户信息
 * @param needAccess 需要的权限
 * @return boolean 是否有权限
 */
const checkAccess = (User: any, needAccess = accessEnum.NOT_LOGIN) => {
    const user_access = User?.userRole ?? accessEnum.NOT_LOGIN;
    // 无需权限
    if (needAccess === accessEnum.NOT_LOGIN) {
        return true;
    }
    // 需要登录
    if (needAccess === accessEnum.USER) {
        if (user_access === accessEnum.NOT_LOGIN) {
            return false;
        }
    }
    // 需要管理员权限
    if (needAccess === accessEnum.ADMIN) {
        if (user_access !== accessEnum.ADMIN) {
            return false;
        }
    }
    return true;
};

export default checkAccess;

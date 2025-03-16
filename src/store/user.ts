import { UserControllerService } from "./../../generated/services/UserControllerService";
import accessEnum from "@/access/accessEnum";
import { ca } from "element-plus/es/locale";
import { StoreOptions } from "vuex";

export default {
    namespaced: true,
    state: () => ({
        loginUser: {
            userName: "未登录",
        } ,
    }),
    getters: {},
    actions: {
        async getLoginUser({ commit, state }, payload) {
            //请求用户登录信息
            const res = await UserControllerService.getLoginUserUsingGet();
            if (res.code === 0) {
                commit("updateUser", res.data);
            } else {
                commit("updateUser", {
                    ...state.loginUser,
                    userRole: accessEnum.NOT_LOGIN,
                });
            }
        },

        async logout({ commit }) {
            try {
                commit("updateUser",{userName:"未登录"});
            }catch(e){
                console.error(e);
            }
        }
    },
    mutations: {
        updateUser(state, payload) {
            state.loginUser = payload;
        },
        resetUser(state) {
            state.loginUser = {
                userName: "未登录",
                userRole: accessEnum.NOT_LOGIN
            };
        }
    },
} as StoreOptions<any>;

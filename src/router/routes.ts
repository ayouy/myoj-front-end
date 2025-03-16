import { Question } from "./../../generated/models/Question";
import { RouteRecordRaw } from "vue-router";
import ExampleView from "../views/ExampleView.vue";
import AdminView from "../views/AdminView.vue";
import NoAuth from "@/views/NoAuth.vue";
import { EditorView } from "codemirror";
import accessEnum from "@/access/accessEnum";
import UserLayout from "@/layout/UserLayout.vue";
import UserLoginView from "@/views/User/UserLoginView.vue";
import UserRegisterView from "@/views/User/UserRegisterView.vue";
import AddQuestionView from "@/views/Question/AddQuestionView.vue";
import MangageQuestionView from "@/views/Question/MangageQuestionView.vue";
import QuestionsView from "@/views/Question/QuestionsView.vue";
import QuestionSubmitView from "@/views/Question/QuestionSubmitView.vue";
import ViewQuestionView from "@/views/Question/ViewQuestionView.vue";
import CodeDetailView from "@/views/Question/CodeDetailView.vue";
import ForgotPasswordView from "@/views/User/ForgotPasswordView.vue";

export const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        name: "主页",
        component: ExampleView,
    },
    {
        path: "/questions",
        name: "题目列表",
        component: QuestionsView,
    },
    {
        path: "/view/question/:id",
        name: "题目详情",
        component: ViewQuestionView,
        props: true,
        meta: {
            access: accessEnum.USER,
            hideInMenu: true,
        },
    },
    {
        path: "/add/question",
        name: "添加题目",
        component: AddQuestionView,
        meta: {
            access: accessEnum.USER,
        },
    },
    {
        path: "/update/question",
        name: "更新题目",
        component: AddQuestionView,
        meta: {
            access: accessEnum.USER,
            hideInMenu: true,
        },
    },
    {
        path: "/mangage/question",
        name: "管理题目",
        component: MangageQuestionView,
        meta: {
            access: accessEnum.ADMIN,
        },
    },
    {
        path: "/question_submit",
        name: "提交记录", 
        component: QuestionSubmitView,
    },
    {
        path: "/code_detail/:id",
        name: "CodeDetail",
        component: CodeDetailView,
        props: true,
        meta: {
            access: accessEnum.USER,
            hideInMenu: true,
        },
    },
    {
        path: "/about",
        name: "关于",
        component: () => import("../views/AboutView.vue"),
    },
    {
        path: "/hide",
        name: "隐藏页面",
        component: NoAuth,
        meta: {
            hideInMenu: true,
        },
    },
    {
        path: "/user",
        name: "用户",
        children: [
            {
                path: "login",
                name: "Login",
                component: UserLoginView,
            },
            {
                path: "register",
                name: "Register",
                component: UserRegisterView,
            },
            {
                path: "forgot-password",
                name: "ForgotPassword",
                component: ForgotPasswordView,
            },
        ],
        meta: {
            hideInMenu: true,
        },
    },
    {
        path: "/console",
        name: "用户控制台",
        meta: {
            access: accessEnum.USER,
            hideInMenu: true,
        },
        children: [
            {
                path: "profile",
                name: "个人资料",
                component: () => import("@/views/UserConsole/ProfileView.vue"),
            },
            {
                path: "chpasswd",
                name: "安全设置",
                component: () => import("@/views/UserConsole/SecurityView.vue"),
            },
            {
                path: "organization",
                name: "组织绑定",
                component: () =>
                    import("@/views/UserConsole/OrganizationView.vue"),
            },
            {
                path: "questions",
                name: "我的题目",
                component: () =>
                    import("@/views/UserConsole/MyQuestionsView.vue"),
            },
        ],
    },
];


import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import NotFoundView from "../views/Http404View.vue"; // Import the 404 view

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/signin",
      name: "signin",
      component: () => import("@/views/SigninView.vue"),
    },
    {
      path: "/signup",
      name: "signup",
      component: () => import("@/views/SignupView.vue"),
    },
    {
      path: "/pointshop",
      name: "pointshop",
      component: () => import("@/views/PointShopView.vue"),
    },
    {
      path: "/skattejagt",
      name: "skattejagt",
      component: () => import("@/views/TreasureHuntView.vue"),
    },
    {
      path: "/skattejagt/kort",
      name: "kort",
      component: () => import("@/views/TreasuremapView.vue"),
    },

    {
      path: "/quizOne",
      name: "QuizOne",
      component: () => import("@/views/QuizOneView.vue"),
    },
    {
      path: "/quizTwo",
      name: "QuizTwo",
      component: () => import("@/views/QuizTwoView.vue"),
    },

    {
      path: "/quiz/points",
      name: "QuizPoints",
      component: () => import("@/views/PointsView.vue"),
    },
    {
      // Catch-all route for unmatched routes
      path: "/:catchAll(.*)",
      name: "404Page",
      component: NotFoundView,
    },
    {
      path: "/pointshop",
      name: "pointshop",
      component: () => import("@/views/PointView.vue"),
    },
    {
      path:"/collect",
      name: "Collect",
      component: () => import("@/views/CollectView.vue")
    },
    {
      path: "/opgave",
      name: "opgave",
      component: () => import("@/views/OverlayView.vue"),
    },
    {
      path: "/minprofil",
      name: "minprofil",
      component: () => import("@/views/MinProfilView.vue"),
    }
  ],
});

export default router;

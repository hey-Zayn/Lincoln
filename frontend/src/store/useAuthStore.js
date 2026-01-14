import axiosInstance from "../axios/axiosInstance";
import { toast } from "sonner";
import { create } from "zustand";

export const useAuthStore = create((set) => ({
    authUser: null,
    isLoading: false,
    isSigningUp: false,
    isLoggingIn: false,
    isVerifying: false,
    isCheckingAuth: true,
    isForgotPassword: false,
    isResetPassword: false,
    isUpdatingPassword: false,
    isUpdatingProfile: false,
    adminUser: [],
    managmentUsers: [],

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/users/me");
            set({ authUser: res.data.user });
            // console.log(res.data.user)
        } catch (error) {
            set({ authUser: null });
            console.log("Error in checkAuth:", error);
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/users/register", data);
            set({ authUser: res.data.user });
            toast.success(res.data.message || "Signed up successfully!");
            return res.data;
        } catch (error) {
            toast.error(error.response?.data?.msg || "Failed to sign up");
            console.error(error);
        } finally {
            set({ isSigningUp: false });
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/users/login", data);
            set({ authUser: res.data.user });
            toast.success("Logged in successfully!");
            return res.data;
        } catch (error) {
            toast.error(error.response?.data?.msg || "Failed to login");
            console.error(error);
        } finally {
            set({ isLoggingIn: false });
        }
    },

    logout: async () => {
        try {
            const res = await axiosInstance.post("/users/logout");
            set({ authUser: null });
            toast.success(res.data.message || "Logged out successfully!");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to logout");
            console.error(error);
        }
    },

    verifyEmail: async (data) => {
        set({ isVerifying: true });
        try {
            const res = await axiosInstance.post("/users/verify", data);
            set({ authUser: res.data.user });
            toast.success(res.data.message || "Email verified successfully!");
            return res.data;
        } catch (error) {
            toast.error(error.response?.data?.message || "Verification failed");
        } finally {
            set({ isVerifying: false });
        }
    },

    forgotPassword: async (data) => {
        set({ isForgotPassword: true });
        try {
            const res = await axiosInstance.post("/users/forgot-password", data);
            toast.success(res.data.message || "Reset code sent to your email!");
            return res.data;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send reset code");
        } finally {
            set({ isForgotPassword: false });
        }
    },

    resetPassword: async (data) => {
        set({ isResetPassword: true });
        try {
            const res = await axiosInstance.post("/users/reset-password", data);
            toast.success(res.data.message || "Password reset successfully!");
            return res.data;
        } catch (error) {
            toast.error(error.response?.data?.message || "Password reset failed");
        } finally {
            set({ isResetPassword: false });
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosInstance.put("/users/profile", data);
            set({ authUser: res.data.user }); // Actually, the backend should return the updated user
            toast.success(res.data.message || "Profile updated successfully!");
            return res.data;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update profile");
            console.error(error);
        } finally {
            set({ isUpdatingProfile: false });
        }
    },

    updatePassword: async (data) => {
        set({ isUpdatingPassword: true });
        try {
            const res = await axiosInstance.put("/users/update-password", data);
            toast.success(res.data.message || "Password updated successfully!");
            return res.data;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update password");
            console.error(error);
        } finally {
            set({ isUpdatingPassword: false });
        }
    },

    getAllAdminUsers: async () => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.get("/users/all-users-for-admin");
            set({ adminUser: res.data.users });
            // toast.success(res.data.message || "Admin users fetched successfully!");
            return res.data.users;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to get admin users");
            console.error(error);
        } finally {
            set({ isLoading: false });
        }
    },

    getAllManagementUsers: async () => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.get("/users/all-users-for-management");
            set({ managmentUsers: res.data.users });
            // toast.success(res.data.message || "Management users fetched successfully!");
            return res.data.users;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to get management users");
            console.error(error);
        } finally {
            set({ isLoading: false });
        }
    },

    updateCourseProgressLocal: (courseId, progress) => {
        set((state) => {
            if (!state.authUser) return state;
            const updatedProgress = state.authUser.courseProgress?.map((cp) => {
                const cpId = typeof cp.courseId === 'string' ? cp.courseId : cp.courseId?._id?.toString() || cp.courseId?.toString();
                return cpId === courseId.toString() ? { ...cp, progress } : cp;
            });
            return {
                authUser: { ...state.authUser, courseProgress: updatedProgress }
            };
        });
    },

}));
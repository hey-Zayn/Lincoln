import axiosInstance from "../axios/axiosInstance";
import { toast } from "sonner";
import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";

export const useCourseStore = create((set) => ({
    courses: [],
    userCourses: [],
    currentCourse: null,
    isLoading: false,
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
    isEnrolling: false,

    getAllCourses: async () => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.get("/courses/all");
            set({ courses: res.data.courses });
        } catch (error) {
            console.error("Error in getAllCourses:", error);
            toast.error(error.response?.data?.message || "Failed to fetch courses");
        } finally {
            set({ isLoading: false });
        }
    },

    getAllCoursesByUser: async () => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.get("/courses/users-all-courses");
            set({ userCourses: res.data.courses });
            // console.log(res.data.courses);
        } catch (error) {
            console.error("Error in getAllCoursesByUser:", error);
        } finally {
            set({ isLoading: false });
        }
    },

    getCourseById: async (id) => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.get(`/courses/${id}`);
            set({ currentCourse: res.data.course });
            return res.data.course;
        } catch (error) {
            console.error("Error in getCourseById:", error);
            toast.error("Course not found");
        } finally {
            set({ isLoading: false });
        }
    },

    createCourse: async (data) => {
        set({ isCreating: true });
        try {
            const res = await axiosInstance.post("/courses/create", data);
            set((state) => ({ courses: [...state.courses, res.data.course] }));
            toast.success("Course created successfully!");
            return res.data.course;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create course");
            console.error(error);
        } finally {
            set({ isCreating: false });
        }
    },

    updateCourse: async (id, data) => {
        set({ isUpdating: true });
        try {
            const res = await axiosInstance.put(`/courses/update/${id}`, data);
            set((state) => ({
                courses: state.courses.map((c) => (c._id === id ? res.data.course : c)),
                currentCourse: res.data.course,
            }));
            return res.data.course;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update course");
        } finally {
            set({ isUpdating: false });
        }
    },

    togglePublish: async (id, isPublished) => {
        try {
            const res = await axiosInstance.put(`/courses/publish/${id}`, { isPublished });
            set((state) => ({
                currentCourse: { ...state.currentCourse, isPublished: res.data.isPublished }
            }));
            toast.success(res.data.message);
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update status");
            return false;
        }
    },

    addSection: async (id, sectionTitle) => {
        try {
            const res = await axiosInstance.post(`/courses/${id}/section/create`, { sectionTitle });
            set((state) => ({
                currentCourse: { ...state.currentCourse, sections: res.data.sections }
            }));
            toast.success("Section added");
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add section");
            return false;
        }
    },

    updateSection: async (id, sectionId, sectionTitle) => {
        try {
            const res = await axiosInstance.put(`/courses/${id}/section/update/${sectionId}`, { sectionTitle });
            set((state) => ({
                currentCourse: { ...state.currentCourse, sections: res.data.sections }
            }));
            toast.success("Section updated");
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update section");
            return false;
        }
    },

    deleteSection: async (id, sectionId) => {
        try {
            const res = await axiosInstance.delete(`/courses/${id}/section/delete/${sectionId}`);
            set((state) => ({
                currentCourse: { ...state.currentCourse, sections: res.data.sections }
            }));
            toast.success("Section removed");
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete section");
            return false;
        }
    },

    createLecture: async (courseId, data) => {
        try {
            const res = await axiosInstance.post(`/lectures/${courseId}/lecture/create`, data);
            toast.success("Lecture created");
            return res.data.lecture;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create lecture");
            return null;
        }
    },

    deleteCourse: async (id) => {
        set({ isDeleting: true });
        try {
            await axiosInstance.delete(`/courses/delete/${id}`);
            set((state) => ({
                courses: state.courses.filter((c) => c._id !== id),
            }));
            toast.success("Course deleted successfully!");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete course");
        } finally {
            set({ isDeleting: false });
        }
    },

    courseProgress: null,

    getCourseProgress: async (courseId) => {
        try {
            const res = await axiosInstance.get(`/courses/${courseId}/progress`);
            set({ courseProgress: res.data });
            return res.data;
        } catch (error) {
            console.error("Error in getCourseProgress:", error);
            return null;
        }
    },

    updateLectureProgress: async (courseId, lectureId) => {
        try {
            const res = await axiosInstance.post(`/courses/${courseId}/progress/update/${lectureId}`);
            set({
                courseProgress: res.data
            });
            // Sync with local User summary in authStore
            const { updateCourseProgressLocal } = useAuthStore.getState();
            if (updateCourseProgressLocal) {
                updateCourseProgressLocal(courseId, res.data.progress);
            }
            return res.data;
        } catch (error) {
            console.error("Error in updateLectureProgress:", error);
            return null;
        }
    },

    enrollInCourse: async (id) => {
        set({ isEnrolling: true });
        try {
            const res = await axiosInstance.post(`/courses/enroll/${id}`);
            toast.success(res.data.message || "Enrolled successfully!");
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || "Enrolment failed");
            return false;
        } finally {
            set({ isEnrolling: false });
        }
    },
}));

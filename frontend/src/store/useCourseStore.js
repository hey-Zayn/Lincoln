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

    // --- Materials Actions ---
    getMaterials: async (courseId) => {
        try {
            const res = await axiosInstance.get(`/courses/${courseId}/materials`);
            return res.data.materials;
        } catch (error) {
            console.error("Error in getMaterials:", error);
            return [];
        }
    },

    uploadMaterial: async (courseId, formData) => {
        try {
            const res = await axiosInstance.post(`/courses/${courseId}/materials`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success("Material uploaded");
            // Optionally update currentCourse materials if we want immediate UI sync
            if (res.data.material) {
                set((state) => {
                    const updatedCourse = state.currentCourse ? {
                        ...state.currentCourse,
                        materials: [...(state.currentCourse.materials || []), res.data.material._id]
                    } : state.currentCourse;
                    return { currentCourse: updatedCourse };
                });
            }
            return res.data.material;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to upload material");
            return null;
        }
    },

    // --- Quizzes Actions ---
    getQuizzes: async (courseId) => {
        try {
            const res = await axiosInstance.get(`/courses/${courseId}/quizzes`);
            return res.data.quizzes;
        } catch (error) {
            console.error("Error in getQuizzes:", error);
            return [];
        }
    },

    createQuiz: async (courseId, data) => {
        try {
            const res = await axiosInstance.post(`/courses/${courseId}/quizzes`, data);
            toast.success("Quiz created");
            // If linked to a section, we might need to refresh the course to see the quiz link
            // Or manually update the section in currentCourse
            if (data.sectionId && res.data.quiz) {
                set((state) => {
                    if (!state.currentCourse) return state;
                    const updatedSections = state.currentCourse.sections.map(s =>
                        s._id === data.sectionId ? { ...s, quiz: res.data.quiz._id } : s
                    );
                    return { currentCourse: { ...state.currentCourse, sections: updatedSections } };
                });
            }
            return res.data.quiz;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create quiz");
            return null;
        }
    },

    deleteMaterial: async (courseId, materialId) => {
        try {
            await axiosInstance.delete(`/courses/${courseId}/materials/${materialId}`);
            toast.success("Material deleted");
            return true;
        } catch (error) {
            console.error("Delete material error:", error);
            toast.error("Failed to delete material");
            return false;
        }
    },

    deleteQuiz: async (courseId, quizId) => {
        try {
            await axiosInstance.delete(`/courses/${courseId}/quizzes/${quizId}`);
            toast.success("Quiz deleted");
            return true;
        } catch (error) {
            console.error("Delete quiz error:", error);
            toast.error("Failed to delete quiz");
            return false;
        }
    },

    getQuizById: async (quizId) => {
        try {
            const res = await axiosInstance.get(`/courses/quizzes/${quizId}`);
            return res.data.quiz;
        } catch (error) {
            console.error("Error in getQuizById:", error);
            return null;
        }
    },

    submitQuiz: async (quizId, answers) => {
        try {
            const res = await axiosInstance.post(`/courses/quizzes/${quizId}/submit`, { answers });
            return res.data;
        } catch (error) {
            console.error("Error in submitQuiz:", error);
            toast.error("Failed to submit quiz");
            return null;
        }
    },

    // --- Discussion Actions ---
    getComments: async (courseId, lectureId) => {
        try {
            const res = await axiosInstance.get(`/courses/${courseId}/lectures/${lectureId}/comments`);
            return res.data.comments;
        } catch (error) {
            console.error("Error in getComments:", error);
            return [];
        }
    },

    addComment: async (courseId, lectureId, commentData) => {
        try {
            const res = await axiosInstance.post(`/courses/${courseId}/lectures/${lectureId}/comments`, commentData);
            toast.success("Comment posted");
            return res.data.comment;
        } catch (error) {
            console.error("Error in addComment:", error);
            toast.error(error.response?.data?.message || "Failed to post comment");
            return null;
        }
    },

    updateComment: async (commentId, content) => {
        try {
            const res = await axiosInstance.put(`/courses/comments/${commentId}`, { content });
            toast.success("Comment updated");
            return res.data.comment;
        } catch (error) {
            console.error("Error in updateComment:", error);
            toast.error(error.response?.data?.message || "Failed to update comment");
            return null;
        }
    },

    deleteComment: async (commentId) => {
        try {
            await axiosInstance.delete(`/courses/comments/${commentId}`);
            toast.success("Comment deleted");
            return true;
        } catch (error) {
            console.error("Error in deleteComment:", error);
            toast.error(error.response?.data?.message || "Failed to delete comment");
            return false;
        }
    },

    toggleLike: async (commentId) => {
        try {
            const res = await axiosInstance.post(`/courses/comments/${commentId}/like`);
            return res.data;
        } catch (error) {
            console.error("Error in toggleLike:", error);
            return null;
        }
    },

    // --- Note Actions ---
    getUserNote: async (courseId, lectureId) => {
        try {
            const res = await axiosInstance.get(`/courses/${courseId}/lectures/${lectureId}/note`);
            return res.data.note;
        } catch (error) {
            console.error("Error in getUserNote:", error);
            return { content: "" };
        }
    },

    upsertUserNote: async (courseId, lectureId, content) => {
        try {
            const res = await axiosInstance.post(`/courses/${courseId}/lectures/${lectureId}/note`, { content });
            return res.data.note;
        } catch (error) {
            console.error("Error in upsertUserNote:", error);
            toast.error("Failed to save note");
            return null;
        }
    },

    getStudentDashboardStats: async () => {
        try {
            const res = await axiosInstance.get('/courses/student/dashboard-stats');
            return res.data;
        } catch (error) {
            console.error("Error in getStudentDashboardStats:", error);
            return null;
        }
    },

    getTeacherDashboardStats: async () => {
        try {
            const res = await axiosInstance.get('/courses/teacher/dashboard-stats');
            return res.data;
        } catch (error) {
            console.error("Error in getTeacherDashboardStats:", error);
            return null;
        }
    },
}));

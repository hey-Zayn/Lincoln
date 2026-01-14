import { create } from "zustand";
import axiosInstance from "../axios/axiosInstance";
import { toast } from "sonner";

export const useManagementStore = create((set, get) => ({
    departments: [],
    classes: [],
    timetables: {}, // Keyed by classId
    isLoading: false,
    isCreating: false,

    fetchDepartments: async () => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.get("/departments/all");
            set({ departments: res.data.departments || [] });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch departments");
            console.error(error);
        } finally {
            set({ isLoading: false });
        }
    },

    createDepartment: async (data) => {
        set({ isCreating: true });
        try {
            const res = await axiosInstance.post("/departments/create", data);
            toast.success(res.data.message || "Department created successfully");
            await get().fetchDepartments();
            return res.data;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create department");
            console.error(error);
            return null;
        } finally {
            set({ isCreating: false });
        }
    },

    fetchClasses: async () => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.get("/classes/all");
            set({ classes: res.data.classes || [] });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch classes");
            console.error(error);
        } finally {
            set({ isLoading: false });
        }
    },

    createClass: async (data) => {
        set({ isCreating: true });
        try {
            const res = await axiosInstance.post("/classes/create", data);
            toast.success(res.data.message || "Class created successfully");
            await get().fetchClasses();
            return res.data;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create class");
            console.error(error);
            return null;
        } finally {
            set({ isCreating: false });
        }
    },

    assignTeacher: async (data) => {
        try {
            const res = await axiosInstance.put("/classes/assign-teacher", data);
            toast.success(res.data.message || "Teacher assigned successfully");
            await get().fetchClasses();
            return res.data;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to assign teacher");
            console.error(error);
            return null;
        }
    },

    addStudents: async (data) => {
        try {
            const res = await axiosInstance.put("/classes/add-students", data);
            toast.success(res.data.message || "Students added successfully");
            await get().fetchClasses();
            return res.data;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add students");
            console.error(error);
            return null;
        }
    },

    fetchTimetable: async (classId) => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.get(`/timetable/class/${classId}`);
            set((state) => ({
                timetables: {
                    ...state.timetables,
                    [classId]: res.data.timetable || []
                }
            }));
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch timetable");
            console.error(error);
        } finally {
            set({ isLoading: false });
        }
    },

    createTimetableEntry: async (data) => {
        set({ isCreating: true });
        try {
            const res = await axiosInstance.post("/timetable/create", data);
            toast.success(res.data.message || "Timetable entry added");
            if (data.class) {
                await get().fetchTimetable(data.class);
            }
            return res.data;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add timetable entry");
            console.error(error);
            return null;
        } finally {
            set({ isCreating: false });
        }
    },

    updateTimetableEntry: async (id, data) => {
        set({ isCreating: true });
        try {
            const res = await axiosInstance.put(`/timetable/${id}`, data);
            toast.success(res.data.message || "Timetable entry updated");
            if (data.class) {
                await get().fetchTimetable(data.class);
            }
            return res.data;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update timetable entry");
            console.error(error);
            return null;
        } finally {
            set({ isCreating: false });
        }
    },

    deleteTimetableEntry: async (id, classId) => {
        try {
            const res = await axiosInstance.delete(`/timetable/${id}`);
            toast.success(res.data.message || "Timetable entry deleted");
            if (classId) {
                await get().fetchTimetable(classId);
            }
            return res.data;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete timetable entry");
            console.error(error);
            return null;
        }
    }
}));

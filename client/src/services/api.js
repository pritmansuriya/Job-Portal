import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
        }

        return Promise.reject(error);
    }
);

const getErrorMessage = (error, fallback) =>
    error.response?.data?.message || error.message || fallback;

export const authApi = {
    login: (credentials) => api.post("/auth/login", credentials),
    register: (user) => api.post("/auth/register", user),
};

export const jobsApi = {
    list: (params = {}) => api.get("/jobs", { params }),
    getById: (id) => api.get(`/jobs/${id}`),
    create: (job) => api.post("/jobs", job),
    update: (id, job) => api.put(`/jobs/${id}`, job),
    remove: (id) => api.delete(`/jobs/${id}`),
};

export const applicationsApi = {
    create: (application) => api.post("/applications", application),
    mine: () => api.get("/applications/my"),
    forEmployer: () => api.get("/applications/employer"),
    updateStatus: (id, status) => api.put(`/applications/${id}`, { status }),
};

export const usersApi = {
    profile: () => api.get("/users/profile"),
    updateProfile: (profile) => api.put("/users/profile", profile),
    list: () => api.get("/users"),
};

export const notificationsApi = {
    list: () => api.get("/notifications"),
    unreadCount: () => api.get("/notifications/unread-count"),
    markAsRead: (id) => api.put(`/notifications/${id}/read`),
    markAllAsRead: () => api.put("/notifications/read-all"),
};

export const authStorage = {
    setSession: (session) => {
        localStorage.setItem("token", session.token);
        localStorage.setItem("user", JSON.stringify(session.user));
    },
    clear: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    },
};

export { getErrorMessage };
export default api;
import api from "../api/axios";

export const getLeaveTypes = async () => {
    return await api.get("/api/leave-types")
}

export const getMyBalances = async () => {
    return await api.get("/api/my-balances");
};

export const getMyRequests = async () => {
    return await api.get("/api/my-leave-requests");
};

export const getMyNotifications = async () => {
    return await api.get("/api/my-notifications");
};

export const postLeaveRequest = async (request) => {
    return await api.post("/api/leave-requests",request)
}

export const postReadNotification = async (id) => {
    return await api.post(`api/notifications/${id}/read`)
}
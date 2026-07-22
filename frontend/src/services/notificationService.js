import api from "./api";

export const getNotifications = async (email) => {

    const response = await api.get(
        `/notifications/email/${encodeURIComponent(email)}`
    );

    return response.data;

};

export const getLatestNotifications = async (email) => {

    const response = await api.get(
        `/notifications/email/${encodeURIComponent(email)}/latest`
    );

    return response.data;

};

export const getNotificationCount = async (email) => {

    const response = await api.get(
        `/notifications/email/${encodeURIComponent(email)}/unread-count`
    );

    return response.data.count;

};

export const markNotificationAsRead = async (notificationId) => {

    const response = await api.put(
        `/notifications/${notificationId}/read`
    );

    return response.data;

};

export const markAllNotificationsAsRead = async (email) => {

    await api.put(
        `/notifications/email/${encodeURIComponent(email)}/read-all`
    );

};
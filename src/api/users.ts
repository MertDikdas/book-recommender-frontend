import type { User } from "../types/user";
import { api } from "./client";


export async function deleteUser(username: string): Promise<void> {
    await api.delete(`/users/${username}`);
}

export async function getUser(username: string): Promise<User> {
    const res = await api.get(`/users/${username}`);
    return res.data;
}

export async function createUser(username: string): Promise<User> {
    const res = await api.post(`/users`, { username });
    return res.data;
}
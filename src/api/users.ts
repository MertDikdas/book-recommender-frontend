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

export async function getUserGenres(username: string): Promise<string[]> {
    const res = await api.get(`/users/${username}/genres`);
    return res.data;
}

export async function getUserById(user_id: number): Promise<User>{
    const res = await api.get(`/users/by-id/`,{
        params: { user_id: user_id},
    });
    return res.data;
}
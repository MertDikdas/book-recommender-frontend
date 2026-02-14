import { api } from "./client";


export async function deleteUser(username: string): Promise<void> {
    await api.delete(`/users/${username}`);
}
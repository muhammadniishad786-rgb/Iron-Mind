import api from "./api";

export const registerUser = async (userData: {
    name: String,
    email: String,
    password: String
}) => {
    const response = await api.post("/auth/register", userData);

    return response.data
}
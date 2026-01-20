import { apiClient } from "@/app/api-client";
import { UpdateUserResponse } from "@/features/user/userType";


export const userApi = apiClient.injectEndpoints({
    endpoints: (builder) => ({
        updateUser: builder.mutation<UpdateUserResponse, FormData>({
            query: (formData) => ({
                url: "/user/update",
                method: "PATCH",
                body: formData
            })
        })
    })
})
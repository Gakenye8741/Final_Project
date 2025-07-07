import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApi =  createApi({
    reducerPath: "userApi",
    baseQuery: fetchBaseQuery({baseUrl: "http://localhost:5000/api/"}),
    endpoints: (builder)=>({
        RegisterUser: builder.mutation({
            query: (RegisterUserPayLoad)=>({
                url: "auth/register",
                method: "POST",
                body:RegisterUserPayLoad,
            })
        }),
        LoginUser: builder.mutation({
            query: (LoginUserPayLoad)=>({
                url: "auth/login",
                method: "POST",
                body: LoginUserPayLoad
            })
        })
    })
})
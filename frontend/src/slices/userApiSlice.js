import { apiSlice } from "./apiSlice";
const BASE_URL = "/api/v1";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${BASE_URL}/login`,
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${BASE_URL}/logout`,
        method: "POST",
      }),
    }),
    registerUser: builder.mutation({
      query: (data) => ({
        url: `${BASE_URL}/register`,
        method: "POST",
        body: data,
      }),
    }),
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: `${BASE_URL}/password/forgot`,
        method: "POST",
        body: data,
      }),
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        url: `${BASE_URL}/password/reset/:id`,
        method: "PUT",
        body: data,
      }),
    }),
    getResetPassword: builder.mutation({
      query: () => ({
        url: `${BASE_URL}/password/reset/:id`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterUserMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetResetPasswordMutation,
} = userApiSlice;

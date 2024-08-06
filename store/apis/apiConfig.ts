"use client";

export const apiConfig = {
  baseUrl: `http://localhost:4000/api/v1/`,
  prepareHeaders: (headers: Headers) => {
    const accessToken: any = localStorage.getItem("accessToken");
    const token = JSON.parse(accessToken);

    if (accessToken) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
};

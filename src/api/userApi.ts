import axiosClient from "./axiosClient";

export const updateUserProfile = async (payload: {
  name: string;
  location: string;
  bio: string;
  skills: string[];
  avatar?: File | string;
}) => {
  const formData = new FormData();
  formData.append("name", payload.name);
  formData.append("location", payload.location);
  formData.append("bio", payload.bio);
  payload.skills.forEach((s) => formData.append("skills", s));
  if (payload.avatar instanceof File) {
    formData.append("avatar", payload.avatar);
  }

  return axiosClient.put("/users/update", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
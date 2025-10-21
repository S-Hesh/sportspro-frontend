// src/api/opportunityApi.ts

import axiosClient from "./axiosClient";
import type { Opportunity } from "@/types/opportunities";


export const fetchOpportunities = () => {
  return axiosClient.get<Opportunity[]>("/opportunities");
};

export const createOpportunity = (data: Partial<Opportunity>) => {
  return axiosClient.post<Opportunity>("/opportunities", data);
};

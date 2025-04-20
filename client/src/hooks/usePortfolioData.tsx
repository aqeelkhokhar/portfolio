import { useQuery } from "@tanstack/react-query";
import React, { createContext, useContext } from "react";
import CustomError from "../components/CustomError";
import Loader from "../components/Loader";
import { apiRequest } from "../lib/queryClient";
import {
  Educations,
  Jobs,
  PersonalInfo,
  Projects,
  SkillCategories,
  SocialLinks,
} from "../types";

export interface PortfolioData {
  personalInfo: PersonalInfo;
  projects: Projects[];
  skills: SkillCategories[];
  experience: Jobs[];
  education: Educations[];
  socialLinks: SocialLinks[];
}

const PortfolioContext = createContext<PortfolioData | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data, isLoading, error } = useQuery<PortfolioData>({
    queryKey: ["/api/portfolio-data"],
    queryFn: async () => {
      const res = await apiRequest({
        method: "GET",
        url: "/api/portfolio-data",
      });
      return res.json();
    },
  });

  if (isLoading) return <Loader />;
  if (error) return <CustomError error={error} />;

  return (
    <PortfolioContext.Provider value={data}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error("usePortfolio must be used within a PortfolioProvider");
  }
  return context;
};

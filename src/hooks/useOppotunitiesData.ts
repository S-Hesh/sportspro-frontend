
import { useState } from "react";

export interface Opportunity {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  sport: string;
  salary: string;
  postedBy: {
    name: string;
    avatar: string;
  };
  posted: string;
  description: string;
  requirements: string[];
}

const initialOpportunities: Opportunity[] = [
  {
    id: 1,
    title: "Basketball Coach - Youth Academy",
    company: "Elite Sports Academy",
    location: "Los Angeles, CA",
    type: "Full-time",
    sport: "Basketball",
    salary: "$45,000 - $65,000",
    postedBy: {
      name: "Mike Wilson",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
    },
    posted: "2 days ago",
    description: "We're looking for a passionate basketball coach to join our youth development program. Experience with ages 12-18 preferred.",
    requirements: ["3+ years coaching experience", "Basketball background", "Youth development"]
  },
  {
    id: 2,
    title: "Sports Analyst Internship",
    company: "ESPN",
    location: "Remote",
    type: "Internship",
    sport: "Multiple",
    salary: "$15/hour",
    postedBy: {
      name: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face"
    },
    posted: "1 week ago",
    description: "Join our sports analysis team for a summer internship program. Perfect for sports enthusiasts looking to break into sports media.",
    requirements: ["Sports knowledge", "Data analysis skills", "Communication skills"]
  },
  {
    id: 3,
    title: "Professional Tennis Player - Team Position",
    company: "Miami Tennis Club",
    location: "Miami, FL",
    type: "Contract",
    sport: "Tennis",
    salary: "Negotiable",
    postedBy: {
      name: "Alex Rodriguez",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
    },
    posted: "3 days ago",
    description: "Seeking professional tennis players for our competitive team. Must have tournament experience and strong ranking.",
    requirements: ["Professional ranking", "Tournament experience", "Team player mentality"]
  },
  {
    id: 4,
    title: "Swimming Instructor",
    company: "AquaLife Sports Center",
    location: "San Diego, CA",
    type: "Part-time",
    sport: "Swimming",
    salary: "$25 - $35/hour",
    postedBy: {
      name: "Lisa Chen",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face"
    },
    posted: "5 days ago",
    description: "Teach swimming lessons to children and adults. Flexible schedule and competitive pay.",
    requirements: ["Swimming certification", "Teaching experience", "CPR certified"]
  }
];

export function useOpportunitiesData() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sportFilter, setSportFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const filterOpportunities = () => {
    return initialOpportunities.filter((opportunity) => {
      const matchesSearch =
        !searchQuery ||
        opportunity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opportunity.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opportunity.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opportunity.sport.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opportunity.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSport =
        !sportFilter ||
        sportFilter === "all" ||
        (sportFilter !== "all" &&
          opportunity.sport.toLowerCase() === sportFilter.toLowerCase());

      const matchesType =
        !typeFilter ||
        typeFilter === "all" ||
        (typeFilter !== "all" &&
          opportunity.type.toLowerCase() === typeFilter.replace("-", " ").toLowerCase());

      return matchesSearch && matchesSport && matchesType;
    });
  };

  return {
    searchQuery,
    setSearchQuery,
    sportFilter,
    setSportFilter,
    typeFilter,
    setTypeFilter,
    filteredOpportunities: filterOpportunities(),
  };
}

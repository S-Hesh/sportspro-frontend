import { useEffect, useState } from "react";
import {Card,CardContent,CardHeader,CardTitle,} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue,} from "@/components/ui/select";
import {Search,MapPin,DollarSign,Briefcase,} from "lucide-react";
import PostOpportunityDialog from "@/components/PostOpportunityDialog";
import { fetchOpportunities } from "@/api/OpportunityApi";
import type { Opportunity } from "@/types/opportunities";
import UserAvatar from "@/components/UserAvatar";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const Opportunities = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sportFilter, setSportFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const loadOpportunities = () => {
    fetchOpportunities()
      .then((res) => {
        console.log("Fetched Opportunities:", res.data);
        setOpportunities(res.data);
      })
      .catch((err) =>
        console.error("Failed to fetch opportunities:", err)
      );
  };

  useEffect(() => {
    loadOpportunities();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Opportunities</h1>
        <p className="text-gray-600">
          Discover jobs, internships, and collaboration opportunities in sports
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search opportunities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={sportFilter} onValueChange={setSportFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Sport" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sports</SelectItem>
                <SelectItem value="basketball">Basketball</SelectItem>
                <SelectItem value="tennis">Tennis</SelectItem>
                <SelectItem value="swimming">Swimming</SelectItem>
                <SelectItem value="football">Football</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="full-time">Full-time</SelectItem>
                <SelectItem value="part-time">Part-time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="internship">Internship</SelectItem>
              </SelectContent>
            </Select>
            <PostOpportunityDialog onSuccess={loadOpportunities}>
              <Button>Post Opportunity</Button>
            </PostOpportunityDialog>
          </div>
        </CardContent>
      </Card>

      {/* Opportunities List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {opportunities.map((opportunity) => (
          <Card
            key={opportunity.opportunityId}
            className="hover:shadow-md transition-shadow"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-1">{opportunity.title}</CardTitle>
                  <p className="text-gray-600 font-medium">{opportunity.company}</p>
                </div>
                <Badge variant={opportunity.type === "Full-time" ? "default" : "secondary"}>
                  {opportunity.type}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600 space-x-4">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {opportunity.location}
                  </div>
                  <div className="flex items-center">
                    <Briefcase className="w-4 h-4 mr-1" />
                    {opportunity.sport}
                  </div>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <DollarSign className="w-4 h-4 mr-1" />
                  {opportunity.salary || "Negotiable"}
                </div>

                <p className="text-gray-700 text-sm">{opportunity.description}</p>

                <div className="flex flex-wrap gap-1">
                  {(opportunity.requirements?.split("\n") || []).map((req, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {req}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="flex items-center space-x-2">
                    <UserAvatar
                      src={opportunity.postedByAvatar}
                      name={opportunity.postedByName}
                      className="w-6 h-6"
                    />
                    <div>
                      <p className="text-xs text-gray-600">
                        Posted by {opportunity.postedByName || "Unknown"}
                        {opportunity.postedAt && (
                          <>• {dayjs(opportunity.postedAt).fromNow()}</>
                        )}
                      </p>
                    </div>
                  </div>
                  <Button size="sm">Apply Now</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Opportunities;

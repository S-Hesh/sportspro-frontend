// src/components/PostOpportunityDialog.tsx

import { useState } from "react";
import {Dialog,DialogContent,DialogHeader,DialogTitle, DialogTrigger,} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue,} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { createOpportunity } from "@/api/OpportunityApi";
import type { Opportunity } from "@/types/opportunities";

interface PostOpportunityDialogProps {
  children: React.ReactNode;
  onSuccess?: () => void;
}

const PostOpportunityDialog = ({ children, onSuccess }: PostOpportunityDialogProps) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState<Partial<Opportunity>>({
    title: "",
    company: "",
    location: "",
    type: "",
    sport: "",
    salary: "",
    description: "",
    requirements: "",
  });

  const handleInputChange = (field: keyof Opportunity, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const requiredFields = ["title", "company", "location", "type", "sport"];
    for (const field of requiredFields) {
      if (!(formData as any)[field]) {
        toast({
          title: "Error",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }
    }

    try {
      await createOpportunity(formData);
      toast({ title: "Success", description: "Opportunity posted successfully!" });

      // Reset form
      setFormData({
        title: "",
        company: "",
        location: "",
        type: "",
        sport: "",
        salary: "",
        description: "",
        requirements: "",
      });

      setOpen(false);
      onSuccess?.();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to post opportunity.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="bg-gray-50 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Post New Opportunity</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                required
                placeholder="e.g. Basketball Coach"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Company/Organization *</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => handleInputChange("company", e.target.value)}
                required
                placeholder="e.g. Elite Sports Academy"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                required
                placeholder="e.g. Los Angeles, CA"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="salary">Salary/Compensation</Label>
              <Input
                id="salary"
                value={formData.salary}
                onChange={(e) => handleInputChange("salary", e.target.value)}
                placeholder="e.g. $45,000 - $65,000"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Job Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(val) => handleInputChange("type", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="Internship">Internship</SelectItem>
                  <SelectItem value="Volunteer">Volunteer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sport">Sport *</Label>
              <Select
                value={formData.sport}
                onValueChange={(val) => handleInputChange("sport", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select sport" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Basketball">Basketball</SelectItem>
                  <SelectItem value="Tennis">Tennis</SelectItem>
                  <SelectItem value="Swimming">Swimming</SelectItem>
                  <SelectItem value="Football">Football</SelectItem>
                  <SelectItem value="Soccer">Soccer</SelectItem>
                  <SelectItem value="Baseball">Baseball</SelectItem>
                  <SelectItem value="Volleyball">Volleyball</SelectItem>
                  <SelectItem value="Track & Field">Track & Field</SelectItem>
                  <SelectItem value="Multiple">Multiple Sports</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Job Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              required
              placeholder="Describe the role, responsibilities, and what you're looking for..."
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="requirements">Requirements</Label>
            <Textarea
              id="requirements"
              value={formData.requirements}
              onChange={(e) => handleInputChange("requirements", e.target.value)}
              placeholder="List qualifications or skills (one per line)"
              className="min-h-[80px]"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="default" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Post Opportunity</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PostOpportunityDialog;

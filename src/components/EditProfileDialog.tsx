// src/components/EditProfileDialog.tsx
import { useState, useRef, useEffect } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X, Camera, Upload, Trash2 } from "lucide-react";
import { useUserProfile } from "@/hooks/useUserProfile";
import { updateUserProfile } from "@/api/userApi";
import { useQueryClient } from "@tanstack/react-query";
  
interface EditProfileDialogProps {
  children: React.ReactNode;
}

const EditProfileDialog = ({ children }: EditProfileDialogProps) => {
  const { data: profile } = useUserProfile();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: "",
    title: "",
    location: "",
    bio: ""
  });

  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [uploadError, setUploadError] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Prefill the form from profile
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name,
        title: profile.title,
        location: profile.location,
        bio: profile.bio
      });
      setSkills(profile.skills);
      setAvatarPreview(profile.avatar);
    }
  }, [profile]);

  // 👇 Log the avatar coming from backend after any update
  useEffect(() => {
    if (profile) {
      console.log("👀 Avatar URL from backend:", profile.avatar);
    }
  }, [profile]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills(prev => [...prev, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(prev => prev.filter(skill => skill !== skillToRemove));
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setUploadError("");

    if (file) {
      if (!file.type.startsWith("image/")) {
        setUploadError("Please select a valid image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setUploadError("File size must be less than 5MB");
        return;
      }

      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview("");
    setUploadError("");
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSave = async () => {
    try {
      await updateUserProfile({
        name: formData.name,
        location: formData.location,
        bio: formData.bio,
        skills,
        avatar: avatarFile || avatarPreview
      });

      await queryClient.invalidateQueries({ queryKey: ["userProfile"] });

      setIsOpen(false);
    } catch (error) {
      console.error("Profile update failed:", error);
      alert("Failed to update profile.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto bg-gray-50">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Avatar Section */}
          <div className="flex flex-col items-center space-y-3">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={
                  avatarPreview?.startsWith("/uploads/")
                  ? `http://localhost:8080${avatarPreview}`
                  : avatarPreview }/>
                <AvatarFallback>
                  {formData.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <button
                type="button"
                onClick={handleAvatarClick}
                className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 hover:bg-primary/90 transition-colors"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            <div className="flex gap-2">
              <Button type="button" size="sm" onClick={handleAvatarClick} className="flex items-center gap-1">
                <Upload className="w-3 h-3" />
                Upload Photo
              </Button>
              {avatarFile && (
                <Button type="button" size="sm" onClick={removeAvatar} className="flex items-center gap-1 text-destructive hover:text-destructive">
                  <Trash2 className="w-3 h-3" />
                  Remove
                </Button>
              )}
            </div>

            {uploadError && (
              <p className="text-sm text-destructive">{uploadError}</p>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="title">Professional Title</Label>
            <Input
              id="title"
              value={formData.title}
              disabled
            />
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              rows={4}
            />
          </div>

          <div>
            <Label>Skills & Interests</Label>
            <div className="flex flex-wrap gap-2 mt-2 mb-3">
              {skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                  {skill}
                  <X className="w-3 h-3 cursor-pointer hover:text-red-500" onClick={() => removeSkill(skill)} />
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add a skill"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addSkill()}
              />
              <Button type="button" onClick={addSkill}>
                Add
              </Button>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleSave} className="flex-1">
              Save Changes
            </Button>
            <Button variant="default" onClick={() => setIsOpen(false)} className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;

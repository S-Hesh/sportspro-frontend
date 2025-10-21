// src/components/UserAvatar.tsx
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface UserAvatarProps {
  src?: string;
  name?: string;
  className?: string;
}

const UserAvatar = ({ src, name = "User", className = "" }: UserAvatarProps) => {
  const imageUrl = src?.startsWith("/uploads/")
    ? `http://localhost:8080${src}`
    : src;

  const fallback = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Avatar className={className}>
      <AvatarImage src={imageUrl} />
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;

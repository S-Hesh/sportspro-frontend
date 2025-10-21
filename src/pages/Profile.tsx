import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Calendar, Trophy, Target } from "lucide-react";
import EditProfileDialog from "@/components/EditProfileDialog";
import { useUserProfile } from "@/hooks/useUserProfile";

const Profile = () => {
  const { data: profile, isLoading, isError } = useUserProfile();

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Card>
          <CardContent>
            <div className="py-10 text-center text-gray-500">Loading profile…</div>
          </CardContent>
        </Card>
      </div>
    );
  }      

  if (isError || !profile) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Card>
          <CardContent>
            <div className="py-10 text-center text-red-500">Failed to load profile.</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Profile Header */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src={
                profile.avatar?.startsWith("/uploads/")
                 ? `http://localhost:8080${profile.avatar}`
                 : profile.avatar
              }/>
              <AvatarFallback>
                {profile.name.split(" ").map((n) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
              <p className="text-lg text-gray-600">{profile.title}</p>
              <div className="flex items-center text-sm text-gray-500 mt-2">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{profile.location}</span>
                <Calendar className="w-4 h-4 ml-4 mr-1" />
                <span>Joined {profile.joined}</span>
              </div>
              <p className="mt-4 text-gray-700">{profile.bio}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                {profile.skills.map((s) => (
                  <Badge key={s}>{s}</Badge>
                ))}
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <EditProfileDialog>
                <Button>Edit Profile</Button>
              </EditProfileDialog>
              <Button variant="default">Share Profile</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stats */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Career Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {profile.stats.map((stat) => (
                <div key={stat.label} className="flex justify-between">
                  <span className="text-gray-600">{stat.label}</span>
                  <span className="font-semibold">{stat.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trophy className="w-5 h-5 mr-2" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {profile.achievements.map((achievement, idx) => (
                <div key={idx} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{achievement.title}</h3>
                    <p className="text-sm text-gray-600">{achievement.sport} • {achievement.year}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {profile.recentActivity.map((activity, idx) => (
              <div key={idx} className="flex items-start space-x-4">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={profile.avatar} />
                  <AvatarFallback>
                    {profile.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm">
                    <span className="font-semibold">{profile.name}</span> {activity.message}
                  </p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;

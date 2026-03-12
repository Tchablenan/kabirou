"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import ProfileForm from "@/components/admin/ProfileForm";

export default function ProfilePage() {
  return (
    <div className="flex justify-center max-w-4xl mx-auto py-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Mon Profil</CardTitle>
          <CardDescription>
            Gérez vos informations personnelles et votre photo de profil.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm />
        </CardContent>
      </Card>
    </div>
  );
}

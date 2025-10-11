import React from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export const ProfilePage = ({ onBack, onEditProfile }) => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Profile</h1>
        <div className="space-x-2">
          <Button onClick={onEditProfile}>Edit Profile</Button>
          <Button variant="outline" onClick={onBack}>Back</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Profile details will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

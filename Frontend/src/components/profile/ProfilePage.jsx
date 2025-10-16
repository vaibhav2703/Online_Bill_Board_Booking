import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Separator } from '../ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  ArrowLeft,
  MapPin,
  Mail,
  Phone,
  Building,
  Calendar,
  DollarSign,
  Activity,
  TrendingUp,
  Settings,
  FileText,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { bookingAPI, ownerAPI } from '../../services/api';
import toast from 'react-hot-toast';

export const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userBookings, setUserBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [ownerBillboards, setOwnerBillboards] = useState([]);
  const [ownerBookings, setOwnerBookings] = useState([]);

  const fetchUserBookings = async () => {
    if (!user) {
      console.warn('User not authenticated, skipping bookings fetch');
      toast.error('Please log in to view your bookings');
      setBookingsLoading(false);
      return;
    }
    setBookingsLoading(true);
    try {
      const response = await bookingAPI.getUserBookings();
      setUserBookings(response.data);
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      if (error.response && error.response.status === 403) {
        toast.error('Authentication failed. Please log in again.');
        localStorage.removeItem('token');
      } else {
        toast.error('Failed to load bookings');
      }
    } finally {
      setBookingsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchUserBookings();
    if (user?.role === 'OWNER') {
      fetchOwnerBillboards();
      fetchOwnerBookings();
    }
  }, []);

  const fetchOwnerBillboards = async () => {
    try {
      const response = await ownerAPI.getBillboards();
      setOwnerBillboards(response.data);
    } catch (error) {
      console.error('Error fetching owner billboards:', error);
    }
  };

  const fetchOwnerBookings = async () => {
    try {
      const response = await ownerAPI.getBookings();
      setOwnerBookings(response.data);
    } catch (error) {
      console.error('Error fetching owner bookings:', error);
    }
  };

  // Mock data - in real app this would come from API/context
  const profileData = {
    name: user?.name || 'John Doe',
    email: user?.email || 'john.doe@example.com',
    phone: user?.phone || '+1 (555) 123-4567',
    company: user?.company || 'Acme Advertising Co.',
    bio: user?.bio || 'Passionate about outdoor advertising and helping brands reach their audience through strategic billboard placements.',
    avatarUrl: user?.avatarUrl || '',
    joinedDate: 'January 2024',
    location: 'New York, NY',
    timezone: user?.preferences?.timezone || 'America/New_York',
    language: user?.preferences?.language || 'English',
    currency: user?.preferences?.currency || 'USD',
  };

  // Calculate stats from real data
  const customerStats = {
    totalBookings: userBookings.length,
    // activeBillboards:customerActivity.map((activity) => activity.status === 'active').length,
    //activeBillboards: new Set(userBookings.filter(b => (b.status?.toLowerCase() === 'active' || b.status?.toLowerCase() === 'confirmed')).map(b => b.billboard?.id || b.billboardId)).size,
    totalSpent: userBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0),
    averageBookingValue: userBookings.length > 0 ? userBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0) / userBookings.length : 0,
    savedBillboards: 8, // Mock for now
  };

  // Calculate stats from real billboards and bookings data
  const totalRevenue = ownerBookings.reduce((sum, booking) => sum + (booking.totalPrice || 0), 0);
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyRevenue = ownerBookings
    .filter(booking => {
      const bookingDate = new Date(booking.startDate);
      return bookingDate.getMonth() === currentMonth && bookingDate.getFullYear() === currentYear;
    })
    .reduce((sum, booking) => sum + (booking.totalPrice || 0), 0);

  // Get currently active/confirmed bookings
  const activeBookings = ownerBookings.filter(booking =>
    booking.status?.toLowerCase() === 'active' ||
    booking.status?.toLowerCase() === 'confirmed'
  );

  // Calculate booked billboards (unique billboard IDs from active bookings)
  const bookedBillboardIds = new Set(activeBookings.map(booking => booking.billboard?.id || booking.billboardId));
  const bookedBillboards = bookedBillboardIds.size;

  // Available billboards = total billboards - booked billboards
  const availableBillboards = ownerBillboards.length - bookedBillboards;

  // Calculate current occupancy as percentage of booked billboards
  const averageOccupancy = ownerBillboards.length > 0 ? Math.round((bookedBillboards / ownerBillboards.length) * 100) : 0;

  const ownerStats = {
    totalBillboards: ownerBillboards.length,
    availableBillboards,
    bookedBillboards,
    totalRevenue,
    monthlyRevenue,
    averageOccupancy,
  };

  // Convert bookings to activity format
  const customerActivity = userBookings.slice(0, 3).map((booking) => ({
    id: booking.id,
    type: 'booking',
    title: booking.billboard?.name || 'Unknown Billboard',
    status: booking.status || 'active',
    date: booking.startDate,
    amount: booking.totalPrice || 0,
  }));
  const allCustomerActivity = userBookings.map((booking) => ({
    id: booking.id,
    type: 'booking',
    title: booking.billboard?.name || 'Unknown Billboard',
    status: booking.status || 'active',
    date: booking.startDate,
    amount: booking.totalPrice || 0,
  }));
  const activeBillboards = customerActivity.map((activity) => activity.status === 'active').length;
  // Generate owner activity from real billboards data
  const ownerActivity = ownerBillboards.slice(0, 3).map((billboard) => {
    let bookingDate = null;
    if (billboard.status === 'booked') {
      const booking = ownerBookings.find(b => b.billboard?.id === billboard.id);
      if (booking) {
        bookingDate = booking.startDate;
      }
    }
    return {
      id: billboard.id,
      type: 'listing',
      title: `${billboard.name} billboard added`,
      date: billboard.createdAt || new Date().toISOString(),
      status: billboard.status || 'available',
      bookingDate: bookingDate,
    };
  });

  const getInitials = () => {
    return user?.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
      case 'confirmed':
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'completed':
      case 'booked':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getIconStyle = (status) => {
    switch (status) {
      case 'available':
        return { bg: 'bg-green-100', text: 'text-green-600' };
      case 'booked':
        return { bg: 'bg-blue-100', text: 'text-blue-600' };
      case 'maintenance':
        return { bg: 'bg-yellow-100', text: 'text-yellow-600' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-600' };
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={() => navigate(user?.role === 'OWNER' ? '/owner' : '/user')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">Profile</h1>
            <p className="text-muted-foreground">View your profile information and activity</p>
          </div>
        </div>
        <Button onClick={() => navigate(user?.role === 'OWNER' ? '/owner/profile/settings' : '/user/profile/settings')}>
          <Settings className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-32 w-32 mb-4">
                  {profileData.avatarUrl ? (
                    <AvatarImage src={profileData.avatarUrl} />
                  ) : null}
                  <AvatarFallback className="text-3xl">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>

                <h2 className="text-xl font-semibold mb-1">{profileData.name}</h2>
                <Badge className="mb-4 capitalize">
                  {user?.role}
                </Badge>


                <Separator className="my-4" />

                <div className="w-full space-y-3 text-sm">
                  <div className="flex items-center text-left">
                    <Mail className="h-4 w-4 mr-3 text-muted-foreground flex-shrink-0" />
                    <span className="text-muted-foreground break-all">{profileData.email}</span>
                  </div>

                  {profileData.phone && (
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-3 text-muted-foreground flex-shrink-0" />
                      <span className="text-muted-foreground">{profileData.phone}</span>
                    </div>
                  )}

                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preferences Card */}
          {/* <Card>
            <CardHeader>
              <CardTitle className="text-base">Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Language</span>
                <span className="font-medium">{profileData.language}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Timezone</span>
                <span className="font-medium">{profileData.timezone}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Currency</span>
                <span className="font-medium">{profileData.currency}</span>
              </div>
            </CardContent>
          </Card> */}
        </div>

        {/* Right Column - Stats and Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Cards */}
          {user?.role === 'USER' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Activity className="h-5 w-5 text-muted-foreground" />
                    <Badge variant="secondary">{activeBillboards} Active </Badge>
                  </div>
                  <p className="text-2xl font-semibold">{customerStats.totalBookings}</p>
                  <p className="text-sm text-muted-foreground">Total Bookings</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <DollarSign className="h-5 w-5 text-muted-foreground" />
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </div>
                  <p className="text-2xl font-semibold">${customerStats.totalSpent.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-2xl font-semibold">${customerStats.averageBookingValue.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Avg. Booking Value</p>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <Badge variant="secondary">{ownerStats.availableBillboards} Available</Badge>
                  </div>
                  <p className="text-2xl font-semibold">{ownerStats.totalBillboards}</p>
                  <p className="text-sm text-muted-foreground">Total Billboards</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <DollarSign className="h-5 w-5 text-muted-foreground" />
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </div>
                  <p className="text-2xl font-semibold">${ownerStats.totalRevenue.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Activity className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-2xl font-semibold">{ownerStats.averageOccupancy}%</p>
                  <p className="text-sm text-muted-foreground">Avg. Occupancy</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Activity Tabs */}
          <Card>
            <CardHeader>
              <CardTitle>Activity</CardTitle>
              <CardDescription>
                {user?.role === 'USER'
                  ? 'Your recent bookings and activity'
                  : 'Your recent business activity'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="recent" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="recent">Recent Activity</TabsTrigger>
                  <TabsTrigger value="all">All Activity</TabsTrigger>
                </TabsList>

                <TabsContent value="recent" className="space-y-4 mt-4">
                  {user?.role === 'USER' ? (
                    customerActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className={`p-2 rounded-lg ${
                            activity.status === 'active' ? 'bg-green-100' :
                            activity.status === 'completed' ? 'bg-blue-100' : 'bg-gray-100'
                          }`}>
                            {activity.status === 'active' ? (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : (
                              <Clock className="h-5 w-5 text-blue-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{activity.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(activity.date).toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${activity.amount.toLocaleString()}/mo</p>
                          <Badge className={getStatusColor(activity.status)} variant="secondary">
                            {activity.status}
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    ownerActivity.map((activity) => {
                      const iconStyle = getIconStyle(activity.status);
                      return (
                        <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                          <div className="flex items-center space-x-4">
                            <div className={`p-2 rounded-lg ${iconStyle.bg}`}>
                              <MapPin className={`h-5 w-5 ${iconStyle.text}`} />
                            </div>
                            <div>
                              <p className="font-medium">{activity.title}</p>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>
                                  {new Date(activity.date).toLocaleDateString('en-US', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric'
                                  })}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={getStatusColor(activity.status)} variant="secondary">
                              {activity.status}
                              {activity.bookingDate && (
                                <span className="ml-2 text-xs">
                                  ({new Date(activity.bookingDate).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric'
                                  })})
                                </span>
                              )}
                            </Badge>
                          </div>
                        </div>
                      );
                    })
                  )}
                </TabsContent>


              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

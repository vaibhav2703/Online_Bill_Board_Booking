import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { MapPin, Search, Filter, Calendar, DollarSign, BookOpen } from 'lucide-react';
import SimpleMapSearch from '../SimpleMapSearch';
import BookingDialog from '../BookingDialog';
import { ProfilePage } from '../profile/ProfilePage';
import { ProfileSettings } from '../profile/ProfileSettings';
import { billboardAPI, bookingAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const getStatusColor = (status) => {
  switch (status) {
    case 'available': return 'bg-green-100 text-green-800';
    case 'booked': return 'bg-blue-100 text-blue-800';
    case 'maintenance': return 'bg-yellow-100 text-yellow-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getImageUrl = (imagePath) => {
  if (!imagePath) return '/placeholder.png';
  // Check if it's a filename (contains _ or .) or base64
  if (imagePath.includes('_') || imagePath.includes('.')) {
    // It's a filename
    const filename = imagePath.split('\\').pop().split('/').pop();
    return `http://localhost:8080/uploads/${filename}`;
  } else {
    // It's base64
    return `data:image/png;base64,${imagePath}`;
  }
};

const UserDashboard = ({ showProfile, onCloseProfile, initialView = 'list' }) => {
  const navigate = useNavigate();
  const [view, setView] = useState(initialView);
  const [userBookings, setUserBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);

  useEffect(() => {
    if (showProfile) {
      setView('profile');
    }
  }, [showProfile]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBillboard, setSelectedBillboard] = useState(null);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [billboards, setBillboards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  const fetchUserBookings = async () => {
    setBookingsLoading(true);
    try {
      const response = await bookingAPI.getUserBookings();
      setUserBookings(response.data);
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setBookingsLoading(false);
    }
  };

  useEffect(() => {
    if (view === 'bookings') {
      fetchUserBookings();
    }
  }, [view]);

  const fetchBillboards = async () => {
    try {
      const response = await billboardAPI.getAll();
      const availableBillboards = response.data.filter(billboard => billboard.status === 'available');
      setBillboards(availableBillboards);
    } catch (error) {
      console.error('Error fetching billboards:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBillboards();
  }, []);

  const filteredBillboards = billboards.filter(billboard =>
    billboard.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    billboard.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    billboard.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBookBillboard = (billboard) => {
    setSelectedBillboard(billboard);
    setShowBookingDialog(true);
  };

  const handleBookingSubmit = async (bookingData) => {
    try {
      await bookingAPI.create(bookingData);
      toast.success('Booking successful!');
      setShowBookingDialog(false);
      setSelectedBillboard(null);
      fetchBillboards(); // Refetch to update the list
    } catch (error) {
      console.error('Booking failed:', error);
      toast.error('Booking failed. Please try again.');
    }
  };

  if (view === 'profile') {
    return (
      <ProfilePage
        onBack={() => {
          setView('list');
          onCloseProfile();
        }}
        onEditProfile={() => setView('settings')}
      />
    );
  }

  if (view === 'settings') {
    return (
      <ProfileSettings onBack={() => setView('profile')} />
    );
  }

  if (view === 'map') {
    return (
      <div className="h-full">
        <div className="p-4 border-b bg-white">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <h1 className="text-xl font-semibold">Find Billboards</h1>
            <Button variant="outline" onClick={() => setView('list')}>
              View List
            </Button>
          </div>
        </div>
        <SimpleMapSearch
          billboards={filteredBillboards}
          onSelectBillboard={handleBookBillboard}
        />
      </div>
    );
  }

  if (view === 'bookings') {
    return (
      <div className="p-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold">My Bookings</h1>
            <p className="text-muted-foreground">View and manage your billboard bookings</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/user/profile')}>
            Back to Profile
          </Button>
        </div>

        {bookingsLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading your bookings...</p>
          </div>
        ) : userBookings.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No bookings found</h3>
            <p className="text-muted-foreground mb-4">You haven't made any bookings yet</p>
            <Button onClick={() => navigate('/user')}>
              Browse Billboards
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userBookings.map((booking) => (
              <Card key={booking.id} className="overflow-hidden">
                <div className="relative aspect-video">
                  <img
                    src={getImageUrl(booking.billboard?.image)}
                    alt={booking.billboard?.name}
                    className="w-full h-full object-contain"
                  />
                  <Badge className="absolute top-2 right-2 bg-blue-100 text-blue-800">
                    Booked
                  </Badge>
                </div>

                <CardHeader>
                  <CardTitle className="flex items-center justify-between font-bold">
                    {booking.billboard?.name}
                  </CardTitle>
                  <CardDescription>{booking.billboard?.location}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="text-sm text-muted-foreground">
                    <p><strong>Company:</strong> {booking.companyName}</p>
                    <p><strong>Duration:</strong> {booking.duration} months</p>
                    <p><strong>Start Date:</strong> {new Date(booking.startDate).toLocaleDateString()}</p>
                    <p><strong>End Date:</strong> {new Date(booking.endDate).toLocaleDateString()}</p>
                    <p><strong>Total Price:</strong> ${booking.totalPrice?.toLocaleString()}</p>
                  </div>

                  <div className="text-sm">
                    <p className="line-clamp-2">{booking.campaignDetails}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-[-0.5rem] max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Find Billboard Advertising</h1>
          <p className="text-muted-foreground">Discover and book premium billboard locations</p>
        </div>

        <button className="px-4 py-2 flex items-center justify-center rounded-md disabled:opacity-50 disabled:cursor-not-allowed bg-[#030213] text-primary-foreground hover:bg-[#31313b]"
          onClick={() => setView('map')}>
          <MapPin className="h-4 w-4 mr-2" />
          View Map
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by location, title, or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-semibold">{filteredBillboards.length}</p>
                <p className="text-muted-foreground">Available Billboards</p>
              </div>
              <MapPin className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-semibold">
                  ${filteredBillboards.length > 0 ? Math.min(...filteredBillboards.map(b => b.price)).toLocaleString() : '0'}
                </p>
                <p className="text-muted-foreground">Starting From</p>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-semibold">24/7</p>
                <p className="text-muted-foreground">Instant Booking</p>
              </div>
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="relative w-full">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading billboards...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 grid-rows-2 gap-6">
              {(() => {
                const maxCards = 18;
                const displayedBillboards = filteredBillboards.slice(0, maxCards);
                const cardsPerPage = 6;
                const totalPages = Math.ceil(displayedBillboards.length / cardsPerPage);
                const currentCards = displayedBillboards.length <= 6 ? displayedBillboards : displayedBillboards.slice(currentPage * cardsPerPage, (currentPage + 1) * cardsPerPage);
                return currentCards.map((billboard) => {
                  const imageUrl = getImageUrl(billboard.image);
                  return (
                    <Card
                      key={billboard.id}
                      className="overflow-hidden w-72 flex flex-col auto-cols-max cursor-pointer"
                      onClick={() => {
                        setSelectedBillboard(billboard);
                        setShowDetailsDialog(true);
                      }}
                    >
                      <div className="relative aspect-video">
                        <img
                          src={imageUrl}
                          alt={billboard.name}
                          className="w-full h-full object-contain"
                        />
                        <Badge className={`absolute top-2 right-2 ${getStatusColor(billboard.status)}`}>
                          {billboard.status}
                        </Badge>
                      </div>

                      <CardHeader className="mt-[-40px]">
                        <CardTitle className="flex items-center justify-between font-bold">
                          {billboard.name}
                        </CardTitle>
                        <CardDescription>{billboard.location}</CardDescription>
                      </CardHeader>

                      <CardContent className="mt-[-35px] p-6">
                        <div className="flex items-center flex-col space-y-4">
                          <p className="text-sm line-clamp-2">{billboard.description}</p>
                          <div className="flex justify-between items-center space-x-12 text-sm">
                            <span className="text-muted-foreground">Size: {billboard.size}</span>
                            <span className="font-semibold">${billboard.price.toLocaleString()}/month</span>
                          </div>
                          <button
                            className="w-full px-4 py-2 flex items-center justify-center rounded-md disabled:opacity-50 disabled:cursor-not-allowed bg-[#030213] text-primary-foreground hover:bg-[#31313b]"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBookBillboard(billboard);
                            }}
                          >
                            Book Now
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                });
              })()}
            </div>

            {(() => {
              const maxCards = 18;
              const displayedBillboards = filteredBillboards.slice(0, maxCards);
              const cardsPerPage = 6;
              const totalPages = Math.ceil(displayedBillboards.length / cardsPerPage);
              return displayedBillboards.length > 6 ? (
                <>
                  <button
                    type="button"
                    className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
                    onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
                    disabled={currentPage === 0}
                  >
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                      <svg className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4" />
                      </svg>
                      <span className="sr-only">Previous</span>
                    </span>
                  </button>
                  <button
                    type="button"
                    className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))}
                    disabled={currentPage === totalPages - 1}
                  >
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                      <svg className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                      </svg>
                      <span className="sr-only">Next</span>
                    </span>
                  </button>
                </>
              ) : null;
            })()}
          </>
        )}
      </div>

      {filteredBillboards.length > 18 && (
        <div className="text-center mt-6">
          <Button onClick={() => setView('map')}>
            View All on Map
          </Button>
        </div>
      )}

      {filteredBillboards.length === 0 && (
        <div className="text-center py-12">
          <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No billboards found</h3>
          <p className="text-muted-foreground">Try adjusting your search criteria</p>
        </div>
      )}

      <BookingDialog
        billboard={selectedBillboard}
        open={showBookingDialog}
        onClose={() => setShowBookingDialog(false)}
        onSubmit={handleBookingSubmit}
      />

      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-sm p-0">
          <Card className="overflow-hidden gap-0">
            <div className="relative aspect-video">
              <img
                src={getImageUrl(selectedBillboard?.image)}
                alt={selectedBillboard?.name}
                className="w-full h-full object-contain"
              />
              <Badge className={`absolute top-2 right-2 ${getStatusColor(selectedBillboard?.status)}`}>
                {selectedBillboard?.status}
              </Badge>
            </div>

            <CardHeader className="pt-0">
              <CardTitle className="flex items-center justify-between font-bold">
                {selectedBillboard?.name}
              </CardTitle>
              <CardDescription>{selectedBillboard?.location}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-sm">{selectedBillboard?.description}</p>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Size: {selectedBillboard?.size}</span>
                <span className="font-semibold">${selectedBillboard?.price.toLocaleString()}/month</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Address: {selectedBillboard?.address}
              </div>

              <button
                className="w-full px-4 py-2 flex items-center justify-center rounded-md disabled:opacity-50 disabled:cursor-not-allowed bg-[#030213] text-primary-foreground hover:bg-[#31313b]"
                onClick={() => {
                  setShowDetailsDialog(false);
                  setShowBookingDialog(true);
                }}
              >
                Book Now
              </button>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserDashboard;

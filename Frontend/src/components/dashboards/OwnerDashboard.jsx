import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Plus, MapPin, DollarSign, Calendar, Edit, Trash2, RefreshCw } from 'lucide-react';
import { Badge } from '../ui/badge';
import { BillboardForm } from '../forms/BillboardForm';
import { ownerAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

export const OwnerDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [billboards, setBillboards] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBillboard, setEditingBillboard] = useState(null);
  const [error, setError] = useState('');

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    // Check if it's a filename (contains _ or .) or base64
    if (imagePath.includes('_') || imagePath.includes('.')) {
      // It's a filename
      const filename = imagePath.split('\\').pop().split('/').pop();
      return `http://localhost:8080/uploads/${filename}`;
    } else {
      // It's base64 data
      return `data:image/png;base64,${imagePath}`;
    }
  };

  useEffect(() => {
    loadBillboards();
  }, []);

  const loadBillboards = async () => {
    try {
      const response = await ownerAPI.getBillboards();
      setBillboards(response.data);
      setError('');
    } catch (err) {
      console.error('Failed to load billboards:', err);
      if (err.response?.status === 401) {
        setError('Authentication failed. Please log in again.');
        logout();
        navigate('/login');
      } else {
        setError('Failed to load billboards.');
      }
    }
  };

  const handleAddBillboard = async (billboardData) => {
    try {
      await ownerAPI.addBillboard(billboardData);
      setShowForm(false);
      loadBillboards();
    } catch (err) {
      console.error('Failed to add billboard:', err);
      if (err.response?.status === 401) {
        setError('Authentication failed. Please log in again.');
        logout();
        navigate('/login');
      } else {
        setError('Failed to add billboard.');
      }
    }
  };

  const handleEditBillboard = async (billboardData) => {
    if (editingBillboard) {
      try {
        await ownerAPI.updateBillboard(editingBillboard.id, billboardData);
        setEditingBillboard(null);
        setShowForm(false);
        loadBillboards();
      } catch (err) {
        console.error('Failed to update billboard:', err);
        if (err.response?.status === 401) {
          setError('Authentication failed. Please log in again.');
          logout();
          navigate('/login');
        } else {
          setError('Failed to update billboard.');
        }
      }
    }
  };

  const handleDeleteBillboard = async (id) => {
    try {
      await ownerAPI.deleteBillboard(id);
      loadBillboards();
    } catch (err) {
      console.error('Failed to delete billboard:', err);
      if (err.response?.status === 401) {
        setError('Authentication failed. Please log in again.');
        logout();
        navigate('/login');
      } else {
        setError('Failed to delete billboard.');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'booked': return 'bg-blue-100 text-blue-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (showForm) {
    return (
      <BillboardForm
        billboard={editingBillboard}
        onSubmit={editingBillboard ? handleEditBillboard : handleAddBillboard}
        onCancel={() => {
          setShowForm(false);
          setEditingBillboard(null);
        }}
      />
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">My Billboards</h1>
          <p className="text-muted-foreground">Manage your billboard properties and track bookings</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={loadBillboards}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <button onClick={() => navigate('/owner/registerBillboard')} className="px-4 py-2 flex items-center rounded-md disabled:opacity-50 disabled:cursor-not-allowed bg-[#030213] text-primary-foreground hover:bg-[#31313b]">
            <Plus className="h-4 w-4 mr-2" />
            Add Billboard
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-semibold">{billboards.length}</p>
                <p className="text-muted-foreground">Total Billboards</p>
              </div>
              <MapPin className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-semibold">{billboards.filter(b => b.status === 'booked').length}</p>
                <p className="text-muted-foreground">Active Bookings</p>
              </div>
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-semibold">${billboards.reduce((sum, b) => sum + (b.status === 'booked' ? b.price : 0), 0)}</p>
                <p className="text-muted-foreground">Monthly Revenue</p>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {billboards.map((billboard) => (
          <Card key={billboard.id} className="overflow-hidden w-72 flex flex-col auto-cols-max">
            <div className="relative aspect-video">
              <img
                src={getImageUrl(billboard.image)}
                alt={billboard.name}
                className="w-full h-full object-contain"
              />
              <Badge className={`absolute top-2 right-2 ${getStatusColor(billboard.status)}`}>
                {billboard.status}
              </Badge>
            </div>

            <CardHeader>
              <CardTitle className="mt-[-40px] flex items-center justify-between">
                {billboard.name}
                <div className="flex space-x-1">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setEditingBillboard(billboard);
                      setShowForm(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDeleteBillboard(billboard.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>{billboard.location}</CardDescription>
            </CardHeader>
            
            <CardContent className={"mt-[-35px] p-6"}>
              <div className="space-y-1">
                {/* <p className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1" />
                  {billboard.address}
                </p> */}
                <p className="text-sm">{billboard.description}</p>
                <div className="flex justify-between items-center mt-4">
                  <span className="font-semibold">${billboard.price}/month</span>
                  <span className="text-sm text-muted-foreground">{billboard.size}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OwnerDashboard;

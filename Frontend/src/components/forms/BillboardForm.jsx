import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { ArrowLeft } from 'lucide-react';
import { SimpleLocationPicker } from '../map/SimpleLocationPicker';

export const BillboardForm = ({ billboard, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: billboard?.name || '',
    location: billboard?.location || '',
    address: billboard?.address || '',
    phone: billboard?.phone || '',
    lat: billboard?.lat || 18.501489,
    lng: billboard?.lng || 73.858904,
    size: billboard?.size || '',
    price: billboard?.price || 0,
    description: billboard?.description || '',
    image: billboard?.image || null,
    status: billboard?.status || 'available'
  });

  const [errors, setErrors] = useState({});

    const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else {
      const phoneRegex = /^\+?\d{10,15}$/;
      if (!phoneRegex.test(formData.phone)) {
        newErrors.phone = 'Phone number must be 10-15 digits, optionally starting with +';
      }
    }
    if (!formData.size.trim()) newErrors.size = 'Size is required';
    if (formData.price <= 0) newErrors.price = 'Price must be greater than 0';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.image) newErrors.image = 'Image is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleLocationChange = (lat, lng, address) => {
    setFormData(prev => ({
      ...prev,
      lat,
      lng,
      address
    }));
    if (errors.address) {
      setErrors(prev => ({ ...prev, address: '' }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 1MB)
      if (file.size > 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: 'Image size must be less than 1MB' }));
        return;
      }
      // Convert file to base64
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result.split(',')[1]; // Remove data:image/...;base64, prefix
        setFormData(prev => ({ ...prev, image: base64String }));
        if (errors.image) {
          setErrors(prev => ({ ...prev, image: '' }));
        }
      };
      reader.onerror = () => {
        setErrors(prev => ({ ...prev, image: 'Failed to read image file' }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center space-x-4 mb-6">
        <Button variant="outline" size="sm" onClick={onCancel} className="flex items-center">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-semibold leading-tight">
            {billboard ? 'Edit Billboard' : 'Add New Billboard'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {billboard ? 'Update billboard information' : 'Register a new billboard property'}
          </p>
        </div>
      </div>

      <Card className="border border-gray-200 rounded-lg shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Billboard Details</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Provide accurate information about your billboard property
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="ml-[2px] space-y-8 max-w-full w-[800px]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col space-y-1">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">Billboard Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g., Highway Junction Billboard" className="text-[14px] bg-[#f2f2f2]"
                />
                {errors.name && <p className="text-destructive text-sm">{errors.name}</p>}
              </div>

              <div className="flex flex-col space-y-1">
                <Label htmlFor="location" className="text-sm font-medium text-gray-700">Location Name *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="e.g., Downtown Highway"
                  className=" bg-[#f2f2f2] border border-gray-300 rounded-md py-2 px-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {errors.location && <p className="text-destructive text-xs mt-1">{errors.location}</p>}
              </div>

              <div className="flex flex-col space-y-1">
                <Label htmlFor="address" className="text-sm font-medium text-gray-700">Full Address *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="e.g., 123 Main St, City Center"
                  className=" bg-[#f2f2f2] border border-gray-300 rounded-md py-2 px-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <p className="text-xs text-muted-foreground">
                  Address will be auto-filled when you select a location on the map below
                </p>
                {errors.address && <p className="text-destructive text-xs mt-1">{errors.address}</p>}
              </div>

              <div className="flex flex-col space-y-1">
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="e.g., +1 123-456-7890"
                  className=" bg-[#f2f2f2] border border-gray-300 rounded-md py-2 px-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {errors.phone && <p className="text-destructive text-xs mt-1">{errors.phone}</p>}
              </div>

              <div className="flex flex-col space-y-1">
                <Label htmlFor="size" className="text-sm font-medium text-gray-700">Billboard Size *</Label>
                <select
                  id="size"
                  value={formData.size}
                  onChange={(e) => handleInputChange('size', e.target.value)}
                  className=" bg-[#f2f2f2] border border-gray-300 rounded-md py-2 px-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select a size</option>
                  <option value="14x48 feet">14x48 feet (Bulletin)</option>
                  <option value="12x24 feet">12x24 feet (Poster)</option>
                  <option value="10x20 feet">10x20 feet (Junior Poster)</option>
                  <option value="6x12 feet">6x12 feet (6-Sheet)</option>
                  <option value="8x16 feet">8x16 feet (Digital)</option>
                </select>
                {errors.size && <p className="text-destructive text-xs mt-1">{errors.size}</p>}
              </div>

              <div className="flex flex-col space-y-1">
                <Label htmlFor="price" className="text-sm font-medium text-gray-700">Monthly Price (USD) *</Label>
                <Input
                  id="price"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                  placeholder="e.g., 2500"
                  className="border border-gray-300 rounded-md py-2 px-3 text-sm  placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500  bg-[#f2f2f2]"
                />
                {errors.price && <p className="text-destructive text-xs mt-1">{errors.price}</p>}
              </div>

              {/* <div className="flex flex-col space-y-1">
                <Label htmlFor="status" className="text-sm font-medium text-gray-700">Status</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className=" bg-[#f2f2f2] border border-gray-300 rounded-md py-2 px-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="available">Available</option>
                  <option value="booked">Booked</option>
                  <option value="maintenance">Under Maintenance</option>
                </select>
              </div> */}
            </div>

            {/* Location Picker Section */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Billboard Location *</Label>
              <p className="text-xs text-muted-foreground">
                Click on the map to select the exact location of your billboard, or use your current location
              </p>
              <SimpleLocationPicker
                initialLat={formData.lat}
                initialLng={formData.lng}
                onLocationChange={handleLocationChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium text-gray-700">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe the billboard location, visibility, traffic patterns, and any special features..."
                rows={4}
                className=" bg-[#f2f2f2] border border-gray-300 rounded-md py-2 px-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {errors.description && <p className="text-destructive text-xs mt-1">{errors.description}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="image" className="text-sm font-medium text-gray-700">Upload Image *</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mb-4 pb-10 cursor-pointer billboard-image-input"
              />
              {errors.image && <p className="text-destructive text-xs mt-1">{errors.image}</p>}
            </div>

            <div className="flex space-x-4 pt-4">
              <button type="submit" className="flex-1 px-4 py-2 items-center rounded-md disabled:opacity-50 disabled:cursor-not-allowed bg-[#030213] text-primary-foreground hover:bg-[#31313b]">
                {billboard ? 'Update Billboard' : 'Add Billboard'}
              </button>
              <Button
                variant="secondary"
                onClick={onCancel}
                className="px-4 py-2"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

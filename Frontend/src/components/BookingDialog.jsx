import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectItem } from './ui/select';
import { Textarea } from './ui/textarea';

const BookingDialog = ({ billboard, open, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    startDate: '',
    duration: '',
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    campaignDetails: '',
  });

  const [errors, setErrors] = useState({});

  if (!open) return null;

  const imageUrl = billboard?.image ? (billboard.image.startsWith('uploads') ? `http://localhost:8080/uploads/${billboard.image.replace(/^uploads[\/\\]/, '').replace(/\\/g, '/')}` : `data:image/png;base64,${billboard.image}`) : '/placeholder.png';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const calculateTotal = () => {
    const duration = parseInt(formData.duration) || 0;
    return billboard.price * duration;
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = ['companyName', 'contactPerson', 'email', 'phone', 'campaignDetails'];
    requiredFields.forEach(field => {
      if (!formData[field].trim()) {
        newErrors[field] = 'This field is required';
      }
    });
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.duration) newErrors.duration = 'Duration is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({ ...formData, billboardId: billboard.id });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50">
      <div className="mt-[10px] bg-white rounded-xl w-[520px] max-w-[92%] p-6 shadow-lg flex flex-col space-y-3">
        <div className="mb-[0.5rem]">
          <h2 className="mt-[1px] text-2xl font-semibold text-[#0a0a0a] mb-2">Book Billboard Space</h2>
          <p className="text-base text-[#6b7280]">Complete your booking for {billboard.name}</p>
        </div>

        <div className="flex flex-col gap-4 justify-between">
          {/* Billboard Summary */}
          <div className="bg-[#f7f7f7] p-2 rounded-xl mb-[5px] flex gap-4 justify-between">
            <div className="flex gap-4 items-center">
              <img src={imageUrl} alt={billboard.name} className="w-20 h-12 object-cover rounded" />
              <div className='mt-[-22px]'>
                <h3 className="text-sm font-semibold text-[#1a1a1a]">{billboard.name}</h3>
                <p className="text-sm text-[#6b7280]">Size: {billboard.size}</p>
                <p className="text-sm text-[#6b7280]">₹{billboard.price.toLocaleString()}/month</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className='max-w-full'>
            <form onSubmit={handleSubmit} className="max-w-full grid grid-cols-2 gap-3 mt-[-10px]">
              <div>
                <label className="block text-sm font-medium text-[#1a1a1a] mb-1">📅 Campaign Start Date</label>
                <Input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  required
                  className={errors.startDate ? 'border-red-500' : ''}
                />
                {errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1a1a1a] mb-1">Duration</label>
                <Select value={formData.duration} onValueChange={(value) => handleSelectChange('duration', value)} className="text-sm w-[230px]">
                  <SelectItem value="">Select duration</SelectItem>
                  <SelectItem value="1">1 Month</SelectItem>
                  <SelectItem value="3">3 Months</SelectItem>
                  <SelectItem value="6">6 Months</SelectItem>
                  <SelectItem value="12">12 Months</SelectItem>
                </Select>
                {errors.duration && <p className="text-red-500 text-xs mt-1">{errors.duration}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1a1a1a] mb-1">Company Name *</label>
                <Input
                  type="text"
                  name="companyName"
                  placeholder="Enter company name"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  required
                  className={errors.companyName ? 'border-red-500' : ''}
                />
                {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1a1a1a] mb-1">Contact Person *</label>
                <Input
                  type="text"
                  name="contactPerson"
                  placeholder="Enter contact person name"
                  value={formData.contactPerson}
                  onChange={handleInputChange}
                  required
                  className={errors.contactPerson ? 'border-red-500' : ''}
                />
                {errors.contactPerson && <p className="text-red-500 text-xs mt-1">{errors.contactPerson}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1a1a1a] mb-1">Email *</label>
                <Input
                  type="email"
                  name="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1a1a1a] mb-1">Phone Number *</label>
                <Input
                  type="tel"
                  name="phone"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className={errors.phone ? 'border-red-500' : ''}
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-[#1a1a1a] mb-1">Campaign Details *</label>
                <Textarea
                  name="campaignDetails"
                  placeholder="Describe your advertising campaign, target audience, and any special requirements..."
                  rows={3}
                  value={formData.campaignDetails}
                  onChange={handleInputChange}
                  required
                  className={errors.campaignDetails ? 'border-red-500' : ''}
                />
                {errors.campaignDetails && <p className="text-red-500 text-xs mt-1">{errors.campaignDetails}</p>}
              </div>
            </form>
          </div>


          {/* Pricing Summary */}
          <div className="bg-[#f7f7f7] p-3 rounded-xl text-sm">
            <div className="flex items-center gap-2">
              <span className="text-lg">💰</span>
              <h3 className="text-lg font-medium text-[#1a1a1a] mt-0">Pricing Summary</h3>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-sm text-[#6b7280]">Monthly Rate:</span>
                <span className="text-sm text-[#1a1a1a]">${billboard.price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-[#6b7280]">Duration:</span>
                <span className="text-sm text-[#1a1a1a]">{formData.duration} month(s)</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span className="text-sm text-[#1a1a1a]">Total:</span>
                <span className="text-sm text-[#1a1a1a]">${calculateTotal().toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              type="submit"
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 flex items-center justify-center rounded-md disabled:opacity-50 disabled:cursor-not-allowed bg-[#030213] text-primary-foreground hover:bg-[#31313b]"
            >
              Submit Booking Request
            </button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="py-2 px-3 text-sm"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDialog;

import React, { useState } from 'react';
import { bookingAPI } from '../../services/api';

function BookingForm({ billboard, onClose }) {
  const [bookingData, setBookingData] = useState({
    userName: '',
    userEmail: '',
    userContact: '',
    startDate: '',
    endDate: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('billboardId', billboard.id);
      formData.append('userName', bookingData.userName);
      formData.append('userEmail', bookingData.userEmail);
      formData.append('userContact', bookingData.userContact);
      formData.append('startDate', bookingData.startDate);
      formData.append('endDate', bookingData.endDate);

      await bookingAPI.create(formData);
      alert('Booking created successfully!');
      onClose();
    } catch (err) {
      console.error('Failed to create booking:', err);
      alert('Failed to create booking. Please try again.');
    }
  };

  return (
    <div style={{border: '1px solid #ccc', padding: '20px', margin: '20px 0'}}>
      <h3>Book Billboard: {billboard.name}</h3>
      <form onSubmit={handleSubmit}>
        <label>Name: <input value={bookingData.userName} onChange={e => setBookingData({...bookingData, userName: e.target.value})} required /></label>
        <label>Email: <input type="email" value={bookingData.userEmail} onChange={e => setBookingData({...bookingData, userEmail: e.target.value})} required /></label>
        <label>Contact: <input value={bookingData.userContact} onChange={e => setBookingData({...bookingData, userContact: e.target.value})} required /></label>
        <label>Start Date: <input type="date" value={bookingData.startDate} onChange={e => setBookingData({...bookingData, startDate: e.target.value})} required /></label>
        <label>End Date: <input type="date" value={bookingData.endDate} onChange={e => setBookingData({...bookingData, endDate: e.target.value})} required /></label>
        <button type="submit">Book Now</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </form>
    </div>
  );
}

export default BookingForm;

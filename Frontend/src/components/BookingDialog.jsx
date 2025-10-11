import React from 'react';
import { Button } from './ui/button';
import BookingForm from './forms/BookingForm';

const BookingDialog = ({ billboard, open, onClose, onSubmit }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Book Billboard</h2>
          <Button variant="ghost" onClick={onClose}>×</Button>
        </div>
        <BookingForm billboard={billboard} onClose={onClose} />
      </div>
    </div>
  );
};

export default BookingDialog;

import React from 'react';
import BillboardMap from './map/BillboardMap';

const SimpleMapSearch = ({ billboards, onSelectBillboard }) => {
  return (
    <div className="h-full">
      <BillboardMap billboards={billboards} onBook={onSelectBillboard} />
    </div>
  );
};

export default SimpleMapSearch;

import React from 'react';

interface SummaryProps {
  name: string;
  paymentMethod: string;
  deliveryDate: string;
  item: string;
  quantity: number;
  price: number;
}

const Summary: React.FC<SummaryProps> = ({
  name,
  paymentMethod,
  deliveryDate,
  item,
  quantity,
  price,
}) => {
  return (
    <div className="rounded-lg bg-white lg:w-4/5">
      <h2 className="mb-4 font-inter text-2xl font-bold">Summary</h2>
      <div className="grid gap-4">
        <div>
          <p className="font-inter text-gray-500">Name</p>
          <p className="font-inter">{name}</p>
        </div>
        <div>
          <p className="font-inter text-gray-500">Payment Method</p>
          <p className="font-inter">{paymentMethod}</p>
        </div>
        <div>
          <p className="font-inter text-gray-500">Delivery Date</p>
          <p className="font-inter">{deliveryDate}</p>
        </div>
        <p className="font-inter text-gray-500">Item</p>
        <div className="rounded-md bg-gray-100 px-5 pb-3">
          <div>
            <p className="font-inter">{item}</p>
          </div>
          <div className="grid grid-cols-2">
            <p className="font-inter text-gray-500">Quantity</p>
            <p className="font-inter">{quantity}</p>
          </div>
          <div className="grid grid-cols-2">
            <p className="font-inter text-gray-500">Price</p>
            <p className="font-inter">₦{price.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;

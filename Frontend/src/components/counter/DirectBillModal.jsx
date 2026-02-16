import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faReceipt } from "@fortawesome/free-solid-svg-icons";
import totalVisit from "../../utils/totalVisitsUtils";
import { useAuth } from "../../context/authContext";

const DirectBillModal = ({
  billItems = [],
  isOpen,
  onClose,
  total = 0,
  taxPercentage = 0,
  setTaxPercentage,
  paymentType = "",
  setPaymentType,
  handleConfirmPayment,
  printerStatus = "", 
  discount,
 setDiscount,
 discountType,
 setDiscountType,
mobileNumber
   
}) => {
  const {auth}= useAuth()

  
  const [visitCount,setVisitCount]= useState(0)
  if (!isOpen) return null;
  const totalVisits= async()=>{
    const count=await totalVisit(mobileNumber,auth.hotelId)
    setVisitCount(count)
    }
  useEffect(()=>{
    totalVisits()
  },[])
 
  const discountAmount = discountType === 'percentage' ? (total * discount) / 100 : parseFloat(discount || 0);
  // const totalAfterDiscount=total-discountAmount
   const gstAmount = taxPercentage ? (total * taxPercentage) / 100 : 0;
  const finalAmount = total + gstAmount -discountAmount;
  async function printBill() {
    total=finalAmount
    handleConfirmPayment(total)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg overflow-hidden">

        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <FontAwesomeIcon icon={faReceipt} />
            Settle Bill
          </h2>
          <button onClick={onClose}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4">

          {/* Amount Summary */}
          <div className="bg-gray-50 p-3 rounded">
            <p>Subtotal: ₹{total}</p>
            <p>GST ({taxPercentage || 0}%): ₹{gstAmount.toFixed(2)}</p>
            <p className="font-semibold text-lg">Final Amount: ₹{finalAmount}</p>
          </div>

          {/* GST */}
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium">GST %</label>
            <input
              type="number"
              className="border rounded px-2 py-1 w-24"
              value={taxPercentage}
              onChange={(e) => setTaxPercentage(e.target.value)}
            />
            <div className="flex items-center gap-3" >
              <span>Visits</span>
              {visitCount}
            </div>
          </div>
          {/* Discount */}
          <div  className="flex items-center gap-3">
        <label className="text-sm font-medium">Discount</label>
          <select className=" w-12 border rounded text-sm "
          value={discountType}
          onChange={e=>setDiscountType(e.target.value)}
          >
            <option value="percentage">%</option>
            <option value="amount">Rs</option>

          </select>
          <input type="number" placeholder="Discount" className="border rounded pl-2" onChange={e=>setDiscount(e.target.value)}  />
            </div>

          {/* Payment Method */}
          <select
            className="w-full border rounded px-3 py-2"
            value={paymentType}
            onChange={(e) => setPaymentType(e.target.value)}
          >
            <option value="">Select Payment Method</option>
            <option value="cash">Cash</option>
            <option value="upi">UPI</option>
            <option value="card">Card</option>
          </select>
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border py-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={printBill}
            className="flex-1 bg-green-600 text-white py-2 rounded"
          >
            Generate Bill
          </button>
        </div>
      </div>
    </div>
  );
};

export default DirectBillModal;

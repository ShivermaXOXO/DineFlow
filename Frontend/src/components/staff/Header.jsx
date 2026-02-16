import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser , faHotel } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
const Header = ({ name, hotelId }) => {
  return (
    <div className="mb-6">
      <p className="text-gray-600 mt-1 flex items-center">
      
        Welcome {name} - Hotel ID: {hotelId}
      </p>
    </div>
  );
};
export default Header;

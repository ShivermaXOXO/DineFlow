import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const HomePage = () => {
     
  
  const navigate = useNavigate();
  const { login } = useAuth(); 

  const [hotelId, setHotelId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState('hotelId'); // 'hotelId' or 'credentials'

  // Reset form when component mounts
  useEffect(() => {
    setEmail('');
    setPassword('');
    setRole('admin');
    setShowPassword(false);
    setIsLoading(false);
    setStep('hotelId');
  }, []);

  const handleHotelIdSubmit = async () => {
    if (!hotelId.trim()) {
      alert('Please enter Hotel ID');
      return;
    }

    // Validate if it's a number (since hotelId is integer in database)
    if (isNaN(hotelId)) {
      alert('Please enter a valid numeric Hotel ID');
      return;
    }

    setIsLoading(true);
    try {
      // Check if hotel exists and is not restricted
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/hotels/${hotelId}/check`);
      
      if (response.data.exists) {
        if (response.data.status === 'restricted') {
          alert('This hotel account has been restricted. Please contact support.');
          return;
        }
        // Hotel exists and is active, proceed to credentials step
        setStep('credentials');
      } else {
        alert('Hotel ID not found. Please check the ID and try again.');
      }
    } catch (err) {
      if (err.response?.status === 404) {
        alert('Hotel ID not found. Please check the ID and try again.');
      } else {
        console.error('Error checking hotel:', err);
        alert('Error verifying Hotel ID. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    if (isLoading) return;
    
    if (!email || !password) {
      alert('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/staff/login`, {
        email,
        password,
        role,
        hotelId: parseInt(hotelId), // Convert to integer for backend
      });

      login({
        token: res.data.token,
        role: res.data.user.role,
        name: res.data.user.name,
        userId: res.data.user.id,
        hotelId: res.data.user.hotelId,
      });

      if (res.data.user.role === 'admin') {
        navigate(`/admin/${res.data.user.hotelId}`);
      } else {
        navigate(`/staff/${res.data.user.hotelId}`);
      }
    } catch (err) {
      if (err.response?.status === 404) {
        if (err.response.data.message === 'Hotel not found') {
          alert('Hotel not found. Please check your Hotel ID.');
          setStep('hotelId');
        } else {
          alert('User not found for this hotel');
        }
      } else if (err.response?.status === 403) {
        alert('This hotel account has been restricted. Please contact support.');
        setStep('hotelId');
      } else if (err.response?.status === 401) {
        alert('Invalid password');
      } else {
        alert('Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const goBackToHotelId = () => {
    setStep('hotelId');
    setEmail('');
    setPassword('');
  };

  return (
    <>
       
   
       
   
         {/* MAIN CONTENT */}
         <div className="w-full min-h-screen bg-white text-gray-800 font-sans">
   
           {/* HERO SECTION */}
           <section className="min-h-[70vh] flex flex-col justify-center items-center text-center px-6 bg-gradient-to-br from-white via-orange-50 to-orange-100 py-20">
             <h1 className="text-5xl font-extrabold text-orange-700 mb-4">
               Smart Billing Made Beautiful
             </h1>
             <p className="text-lg text-gray-700 max-w-2xl">
               A modern restaurant & café billing solution crafted for simplicity, speed, and elegance.
             </p>
           </section>
   
           {/* WHY DineFlow */}
           <section className="py-20 px-6 max-w-7xl mx-auto">
             <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
               Why Choose DineFlow?
             </h2>
   
             <div className="flex flex-col md:flex-row gap-8 justify-center">
               {[
                 {
                   title: "Smart Billing",
                   desc: "Fast, smooth, and easy-to-use billing designed for cafés and restaurants.",
                 },
                 {
                   title: "Live Sales Insights",
                   desc: "Monitor sales and trends in real-time.",
                 },
                 {
                   title: "Device-Friendly Billing",
                   desc: "Works on mobile, desktop, and tablet without losing session.",
                 },
               ].map((item, i) => (
                 <div
                   key={i}
                   className="flex-1 bg-white shadow-md border border-gray-200 p-8 rounded-xl text-center 
                   hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                 >
                   <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h3>
                   <p className="text-gray-600">{item.desc}</p>
                 </div>
               ))}
             </div>
           </section>
   
           {/* FEATURES */}
           <section className="py-16 bg-white">
             <div className="max-w-7xl mx-auto px-6">
               <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
                 Features That Make Billing Smarter
               </h2>
   
               <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                 {[
                   {
                     title: "Realtime Billing Sync",
                     desc: "Watch your GST & sales update live from any device.",
                   },
                   {
                     title: "Auto-GST Calculation",
                     desc: "No manual math—accurate GST calculation instantly.",
                   },
                   {
                     title: "Multi-Staff Support",
                     desc: "Multiple staff can bill at same time smoothly.",
                   },
                   {
                     title: "Inventory & Expiry Alerts",
                     desc: "Get low-stock warnings and expiry alerts automatically.",
                   },
                   {
                     title: "Royal Customer Tracking",
                     desc: "Track loyal customers and reward them.",
                   },
                   {
                     title: "Multi-Device Support",
                     desc: "Mobile, tablet, desktop—all synced instantly.",
                   },
                 ].map((item, i) => (
                   <div
                     key={i}
                     className="p-6 border border-gray-200 rounded-xl shadow-sm bg-white hover:shadow-xl 
                     hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                   >
                     <div className="text-orange-600 text-4xl mb-4">★</div>
                     <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                     <p className="text-gray-600 text-sm mt-2">{item.desc}</p>
                   </div>
                 ))}
               </div>
             </div>
           </section>
   
           {/* HOW IT WORKS */}
           <section className="py-16 bg-orange-50">
             <div className="max-w-6xl mx-auto px-6">
               <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
                 How DineFlow Works
               </h2>
   
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 {[
                   {
                     step: "Sign Up Your Restaurant",
                     desc: "Enter details & get started instantly.",
                   },
                   {
                     step: "Add Staff & Start Billing",
                     desc: "Your team learns it in minutes.",
                   },
                   {
                     step: "Track Realtime Sales",
                     desc: "Monitor earnings without waiting till closing.",
                   },
                 ].map((item, i) => (
                   <div
                     key={i}
                     className="p-8 bg-white rounded-xl shadow-md border border-gray-200 text-center 
                     hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                   >
                     <div className="text-indigo-600 text-4xl font-bold mb-4">{i + 1}</div>
                     <h3 className="text-xl font-semibold text-gray-800">{item.step}</h3>
                     <p className="text-gray-600 text-sm mt-3">{item.desc}</p>
                   </div>
                 ))}
               </div>
             </div>
           </section>
   
           {/* PRICING */}
           <section className="py-20 px-6 bg-gradient-to-br from-white via-orange-50 to-orange-100 text-center">
             <h2 className="text-3xl font-bold text-gray-800 mb-6">
               Simple & Transparent Pricing
             </h2>
             <p className="text-gray-600 mb-10 text-lg">
               Perfect for restaurants, cafés, and cloud kitchens.
             </p>
   
             <div className="max-w-md mx-auto bg-white shadow-lg border border-gray-200 p-10 rounded-xl 
               hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
             >
               <p className="text-4xl font-extrabold text-gray-800 mb-2">₹5000 / Year</p>
               <p className="text-gray-600 text-lg mb-6">Just ₹17 per day</p>
   
               <ul className="text-left text-gray-700 space-y-3 mb-8">
                 <li>✔ Free Installation</li>
                 <li>✔ Free Demo</li>
                 <li>✔ 24×7 Support</li>
                 <li>✔ Unlimited Device Access</li>
               </ul>
   
               <button className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition">
                 Get Started
               </button>
             </div>
           </section>
   
           {/* REFERRAL */}
           <section className="py-20 px-6 max-w-5xl mx-auto text-center">
             <h2 className="text-3xl font-bold text-gray-800 mb-4">
               Referral Bonus Program
             </h2>
   
             <p className="text-gray-600 mb-10 text-lg">
               Share DineFlow with friends and grow together.
             </p>
   
             <div className="bg-white shadow-md border border-gray-200 p-10 rounded-xl max-w-3xl mx-auto 
               hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
             >
               <p className="text-xl text-gray-800 mb-3">
                 Bring 1 client → <b>Get ₹1000 cashback</b>
               </p>
               <p className="text-xl text-gray-800">
                 Bring 5 clients → <b>Your entire year is FREE!</b>
               </p>
             </div>
           </section>
         </div>
   
        
       </>
  );
};

export default HomePage;
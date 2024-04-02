"use client";
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Import useNavigate

const ThankYou = () => {
  const router = useRouter(); // Create an instance of useNavigate

  useEffect(() => {
    // Set a timeout to navigate to the main page after 5 seconds
    const timer = setTimeout(() => router.push('/order'), 5000);

    // Cleanup function to clear the timeout if the component unmounts before 5 seconds
    return () => clearTimeout(timer);
  }, [router]); // Dependency array with navigate to ensure effect runs once

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', textAlign: 'center' }}>
      <h1>Thank you for your business!</h1>
      <p>Your order will be out shortly.</p>
    </div>
  );
};

export default ThankYou;
import React from 'react'
import useAuth from '../Hooks/useAuth';

const Thanks = () => {
    const { user } = useAuth();
  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  let greeting;

  if (currentHour >= 5 && currentHour < 12) {
    greeting = "Good morning";
  } else if (currentHour >= 12 && currentHour < 18) {
    greeting = "Good afternoon";
  } else {
    greeting = "Good night";
  }
  return (
    <section className="px-5 pt-7">
    <div>
      <h1 className="text-base font-bold">
        {greeting}, {user?.displayName}!
      </h1>
      <p className="text-gray-700">
        Welcome Our Trends Shop
      </p>
    </div>
  </section>
  )
}

export default Thanks
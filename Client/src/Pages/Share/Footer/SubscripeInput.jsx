import { Input, Button } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import toast from "../../../Components/Toast/LuxuryToast";
import { useState } from 'react';

const SubscribeInput = () => {
  const [email, setEmail] = useState('');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Function to handle email subscription
  const handleSubscription = () => {
    // Check if the email is not empty, has a valid format, and correct domain
    if (!email) {
      toast.warning("Please enter your email address to subscribe.", {
        title: "Email Required ✉️",
      });
    } else if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.", {
        title: "Invalid Email ✉️",
      });
    } else if (email.includes('@gamil.com')) { // Check for common typo
      toast.warning("Did you mean '@gmail.com'?", {
        title: "Typo Detected 💡",
      });
    } else {
      toast.success("Thank you for subscribing to Trends Shop updates!", {
        title: "Subscribed Successfully 🎉",
        badge: "Newsletter VIP",
      });
    }
  };
  return (
    <div style={{ position: 'relative', width: '100%' }} className='mt-6'>
      <Input
        variant="outlined"
        size="large"
        placeholder="Enter your email"
        style={{ width: '100%', paddingRight: '40px' }}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button
        type="primary"
        icon={<ArrowRightOutlined onClick={handleSubscription}/>}
        size="large"
        style={{ 
          position: 'absolute', 
          top: 0, 
          right: 0, 
          height: '100%', 
          background: '#f59e0b', // Amber-500 brand color
          color: '#0f172a',
          border: 'none'
        }}
      />
    </div>
  );
};

export default SubscribeInput;
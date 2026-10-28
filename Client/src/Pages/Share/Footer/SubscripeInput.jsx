import { Input, Button } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import toast from 'react-hot-toast';
import { useState } from 'react';

const SubscribeInput = () => {
  const [email, setEmail] = useState('');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Function to handle email subscription
  const handleSubscription = () => {
    // Check if the email is not empty, has a valid format, and correct domain
    if (!email) {
      toast.error("Please enter an email address.");
    } else if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
    } else if (email.includes('@gamil.com')) { // Check for common typo
      toast.error("Did you mean '@gmail.com'?");
    } else {
      toast.success("Please wait, it's working. We will be back soon.");
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
          background: 'red', // Change button color to red
          border: 'none' // Remove button border if needed
        }}
      />
    </div>
  );
};

export default SubscribeInput;
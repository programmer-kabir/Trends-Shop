import { Input, Button } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';

const SubscribeInput = () => {
  return (
    <div style={{ position: 'relative', width: '100%' }} className='mt-6'>
      <Input
        variant="outlined"
        size="large"
        placeholder="Enter your email"
        style={{ width: '100%', paddingRight: '40px' }} // Adjust paddingRight to accommodate the button
      />
      <Button
        type="primary"
        icon={<ArrowRightOutlined />}
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
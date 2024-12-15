import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Komunitas from './Komunitas';

function CommunityPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to Komunitas component
    navigate('/komunitas');
  }, [navigate]);

  return <Komunitas />;
}

export default CommunityPage; 
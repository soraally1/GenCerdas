import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Courses from './Courses';

function CoursesPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to Courses component
    navigate('/courses');
  }, [navigate]);

  return <Courses />;
}

export default CoursesPage; 
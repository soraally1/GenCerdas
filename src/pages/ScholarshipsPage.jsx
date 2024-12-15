import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { toast } from 'react-hot-toast';

function ScholarshipsPage() {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        const scholarshipsRef = collection(db, 'scholarships');
        const snapshot = await getDocs(scholarshipsRef);
        const scholarshipsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setScholarships(scholarshipsData);
      } catch (error) {
        console.error('Error fetching scholarships:', error);
        toast.error('Failed to load scholarships');
      } finally {
        setLoading(false);
      }
    };

    fetchScholarships();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFA726] to-[#FF9800] p-8">
      <div className="max-w-7xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-white mb-8"
        >
          Available Scholarships
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scholarships.map((scholarship) => (
            <motion.div
              key={scholarship.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl p-6 shadow-lg"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {scholarship.title}
              </h2>
              <p className="text-gray-600 mb-4">{scholarship.description}</p>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Provider:</span> {scholarship.provider}
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Deadline:</span> {scholarship.deadline}
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Value:</span> {scholarship.value}
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Learn More
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ScholarshipsPage; 
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { scholarshipData } from '../data/scholarshipData';
import ApplicationForm from '../components/scholarship/ApplicationForm';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

function Beasiswa() {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const { currentUser } = useAuth();
  const [selectedScholarship, setSelectedScholarship] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [userDocuments, setUserDocuments] = useState({});

  useEffect(() => {
    fetchScholarships();
    fetchUserDocuments();
  }, []);

  const fetchScholarships = async () => {
    try {
      let scholarshipsData = scholarshipData.map(scholarship => ({
        ...scholarship,
        hasApplied: false
      }));

      if (currentUser) {
        const applicationsRef = collection(db, 'applications');
        const userApplicationsQuery = query(
          applicationsRef, 
          where('userId', '==', currentUser.uid)
        );
        const userApplications = await getDocs(userApplicationsQuery);
        const appliedScholarshipIds = userApplications.docs.map(doc => doc.data().scholarshipId);

        scholarshipsData = scholarshipsData.map(scholarship => ({
          ...scholarship,
          hasApplied: appliedScholarshipIds.includes(scholarship.id)
        }));
      }

      setScholarships(scholarshipsData);
    } catch (error) {
      console.error('Error fetching scholarships:', error);
      toast.error('Failed to load scholarships');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDocuments = async () => {
    if (!currentUser?.uid) return;

    try {
      const documentsRef = collection(db, 'documents');
      const q = query(documentsRef, where('userId', '==', currentUser.uid));
      const snapshot = await getDocs(q);
      
      const docs = {};
      snapshot.forEach((doc) => {
        const data = doc.data();
        docs[data.type] = {
          url: data.url,
          fileName: data.fileName,
          uploadedAt: data.uploadedAt
        };
      });
      
      setUserDocuments(docs);
    } catch (error) {
      console.error('Error fetching user documents:', error);
    }
  };

  const handleApplicationSubmit = async (formData) => {
    if (!currentUser) {
      toast.error('Please login to apply');
      return;
    }

    setApplying(true);
    try {
      const storage = getStorage();
      const documentUrls = { ...formData.documentUrls };

      for (const [key, file] of Object.entries(formData.documents)) {
        if (file && !documentUrls[key]) {
          const storageRef = ref(storage, `applications/${currentUser.uid}/${selectedScholarship.id}/${key}`);
          await uploadBytes(storageRef, file);
          documentUrls[key] = await getDownloadURL(storageRef);
        }
      }

      const applicationsRef = collection(db, 'applications');
      await addDoc(applicationsRef, {
        userId: currentUser.uid,
        scholarshipId: selectedScholarship.id,
        scholarshipTitle: selectedScholarship.title,
        provider: selectedScholarship.provider,
        status: 'pending',
        appliedAt: new Date().toISOString(),
        deadline: selectedScholarship.deadline,
        value: selectedScholarship.value,
        applicationData: {
          ...formData,
          documents: documentUrls
        }
      });

      toast.success('Application submitted successfully!');
      setShowForm(false);
      fetchScholarships();
    } catch (error) {
      console.error('Error applying for scholarship:', error);
      toast.error('Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  const handleApply = (scholarship) => {
    setSelectedScholarship(scholarship);
    setShowForm(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFA726] to-[#FF9800] p-8">
      <div className="ml-0 md:ml-24 max-w-7xl mx-auto">
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
              className="bg-white rounded-xl overflow-hidden shadow-lg"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={scholarship.image} 
                  alt={scholarship.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium ${
                  scholarship.hasApplied 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-orange-100 text-orange-600'
                }`}>
                  {scholarship.hasApplied ? 'Applied' : scholarship.status}
                </span>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      {scholarship.title}
                    </h2>
                    <p className="text-gray-600">{scholarship.provider}</p>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4">{scholarship.description}</p>
                
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Value:</span> {scholarship.value}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Deadline:</span> {new Date(scholarship.deadline).toLocaleDateString()}
                  </p>
                </div>

                <a
                  href={scholarship.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-500 hover:text-orange-600 text-sm flex items-center gap-1 mb-4"
                >
                  Visit Website
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleApply(scholarship)}
                  disabled={scholarship.hasApplied || applying}
                  className={`w-full py-2 rounded-lg font-semibold transition-colors ${
                    scholarship.hasApplied
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      : 'bg-orange-500 text-white hover:bg-orange-600'
                  }`}
                >
                  {scholarship.hasApplied ? 'Already Applied' : 'Apply Now'}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        <ApplicationForm
          scholarship={selectedScholarship}
          isOpen={showForm}
          onClose={() => setShowForm(false)}
          onSubmit={handleApplicationSubmit}
          userDocuments={userDocuments}
        />
      </div>
    </div>
  );
}

export default Beasiswa; 
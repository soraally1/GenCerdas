import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { courseData } from './courseData';
import { courseTitles } from '../utils/uploadQuizData';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const course = courseData.find(course => course.id === parseInt(id));
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [courseProgress, setCourseProgress] = useState({
    completed: false,
    progress: 0,
    score: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch quiz data
        const quizDocRef = doc(db, 'quizzes', courseTitles[id]);
        const quizDocSnap = await getDoc(quizDocRef);
        
        if (quizDocSnap.exists()) {
          setQuizData(quizDocSnap.data());
        }

        // Fetch user progress
        if (currentUser) {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            const completedCourse = userData.completedCourses?.find(
              course => course.id === id
            );
            
            if (completedCourse) {
              setCourseProgress({
                completed: true,
                progress: completedCourse.progress || 0,
                score: completedCourse.score || 0
              });
            }
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, currentUser]);

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFA726] to-[#FF9800] p-4 flex items-center justify-center">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold mb-2">Course Not Found</h2>
          <button
            onClick={() => navigate('/courses')}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFA726] to-[#FF9800] p-4 flex items-center justify-center">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          <p className="mt-4 text-gray-600">Loading course details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFA726] to-[#FF9800] p-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Hero Section */}
          <div className="relative">
            <img 
              src={course.image} 
              alt={course.title}
              className="w-full h-48 md:h-64 lg:h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20 flex items-end">
              <div className="p-6 md:p-8">
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-2xl md:text-4xl font-bold mb-3 text-white"
                >
                  {course.title}
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-sm md:text-base mb-4 text-white/90"
                >
                  {course.description}
                </motion.p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-orange-500/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm text-white font-medium">
                    ⏱️ 4 Jam
                  </span>
                  <span className="bg-blue-500/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm text-white font-medium">
                    📚 16 Modul
                  </span>
                  <span className="bg-green-500/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm text-white font-medium">
                    🎓 Sertifikat
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Course Progress */}
          <div className="bg-gradient-to-r from-orange-50 to-orange-100/50 p-6 md:p-8">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Progress Belajar</h2>
                <span className="text-orange-600 font-semibold text-lg">
                  {courseProgress.progress}%
                </span>
              </div>
              <div className="h-4 bg-white/50 rounded-full overflow-hidden shadow-inner">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${courseProgress.progress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-orange-500 to-orange-400"
                />
              </div>
              {courseProgress.completed && (
                <div className="mt-3 text-sm text-green-600 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Completed with score: {courseProgress.score}</span>
                </div>
              )}
            </div>
          </div>

          {/* Course Content */}
          <div className="p-6 md:p-8">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="md:col-span-2">
                <h2 className="text-xl font-bold mb-6 text-gray-800">Level Pembelajaran</h2>
                <div className="space-y-6">
                  {quizData && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              courseProgress.completed ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                            }`}>
                              {courseProgress.completed ? (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              ) : (
                                <span className="text-lg font-semibold">1</span>
                              )}
                            </div>
                            <div>
                              <h3 className="font-medium text-lg text-gray-800">{courseTitles[id]}</h3>
                              <span className="text-sm text-gray-500">5 Soal Quiz</span>
                            </div>
                          </div>
                        </div>

                        {/* Quiz Section */}
                        <div className="mt-6 bg-gradient-to-br from-orange-50 to-orange-100/50 p-6 rounded-xl">
                          <h4 className="font-medium text-lg mb-3 text-gray-800">Quiz {courseTitles[id]}</h4>
                          <p className="text-gray-600 mb-4">
                            Uji pemahaman Anda tentang {courseTitles[id]} melalui quiz interaktif
                          </p>
                          <button 
                            className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-all transform hover:scale-[1.02] active:scale-[0.98] font-medium shadow-sm hover:shadow-md"
                            onClick={() => navigate(`/quiz/${id}`)}
                          >
                            {courseProgress.completed ? 'Ulangi Quiz' : 'Mulai Quiz'}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <div className="md:col-span-1">
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl p-6 sticky top-6 shadow-sm"
                >
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-orange-600 mb-2">
                      Gratis
                    </div>
                    <p className="text-gray-600">
                      Akses penuh ke semua materi
                    </p>
                  </div>

                  <button 
                    className="w-full bg-orange-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-orange-600 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md mb-6"
                    onClick={() => navigate(`/quiz/${id}`)}
                  >
                    Mulai Belajar Sekarang
                  </button>

                  <div className="space-y-4">
                    {[
                      { icon: "🔓", text: "Akses Seumur Hidup" },
                      { icon: "🎓", text: "Sertifikat Kelulusan" },
                      { icon: "👨‍🏫", text: "Konsultasi dengan Mentor" }
                    ].map((item, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + (index * 0.1) }}
                        className="flex items-center gap-3 text-gray-600"
                      >
                        <span className="text-xl">{item.icon}</span>
                        <span>{item.text}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default CourseDetail;

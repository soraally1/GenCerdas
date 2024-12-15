import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import mascot from '../assets/mascot.png';
import PropTypes from 'prop-types';
import { DOCUMENT_TYPES } from '../services/documentService';

function Profile() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [completedCourses, setCompletedCourses] = useState([]);
  const [userStats, setUserStats] = useState({
    weeklyTargets: { completed: 4, total: 5 },
    xpPoints: 1240,
    level: 3,
    streak: 7,
    totalMinutesLearned: 420,
    rank: "Pelajar Perunggu",
    nextRankXP: 2000,
    achievements: [
      { 
        id: 1, 
        name: "Langkah Pertama", 
        icon: "🎯", 
        description: "Selesaikan kursus pertamamu",
        progress: 100,
        reward: 50,
        unlocked: true,
        category: 'courses',
        date: '2024-01-15'
      },
      { 
        id: 2, 
        name: "Pembelajar Cepat", 
        icon: "⚡", 
        description: "Selesaikan 5 kursus",
        progress: 60,
        reward: 100,
        unlocked: false,
        category: 'courses',
        requirements: "3/5 kursus selesai"
      },
      { 
        id: 3, 
        name: "Rajin Belajar", 
        icon: "🔥", 
        description: "7 hari berturut-turut belajar",
        progress: 100,
        reward: 150,
        unlocked: true,
        category: 'engagement',
        date: '2024-01-20'
      },
      { 
        id: 4, 
        name: "Pencari Ilmu", 
        icon: "📚", 
        description: "Tonton 10 video pembelajaran",
        progress: 30,
        reward: 200,
        unlocked: false,
        category: 'learning',
        requirements: "3/10 video ditonton"
      }
    ],
    recentMilestones: [
      {
        id: 1,
        title: "Mencapai Level 3",
        date: "20 Jan 2024",
        xpGained: 500
      },
      {
        id: 2,
        title: "7 Hari Berturut-turut Belajar",
        date: "19 Jan 2024",
        xpGained: 150
      }
    ]
  });
  const [documents, setDocuments] = useState({});
  const [scholarships] = useState([
    {
      id: 1,
      name: "Beasiswa Unggulan",
      deadline: "2024-04-30",
      provider: "Kemendikbud",
      coverage: "Full",
      eligibility: "IPK min. 3.5",
      status: "open",
      icon: "🎓"
    },
    {
      id: 2,
      name: "Beasiswa LPDP",
      deadline: "2024-05-15",
      provider: "Kemenkeu",
      coverage: "Full",
      eligibility: "IPK min. 3.0",
      status: "open",
      icon: "🌟"
    }
  ]);
  const [appliedScholarships, setAppliedScholarships] = useState([]);

  // Fetch user data from Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser?.uid) return;

      try {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          const completedCourses = userData.completedCourses || [];
          
          // Create activities from completed courses
          const activities = completedCourses.map(course => ({
            id: course.id,
            time: course.completedAt ? new Date(course.completedAt) : new Date(),
            title: `Menyelesaikan ${course.title}`,
            score: course.score || 0,
            totalQuestions: course.totalQuestions || 10,
            progress: course.progress || 100,
            streak: userData.stats?.streak || 0
          }));

          activities.sort((a, b) => b.time - a.time);
          
          setCompletedCourses(completedCourses);
          
          // Update userStats with achievements and milestones
          setUserStats(prev => ({
            ...prev,
            ...userData.stats,
            achievements: userData.achievements || prev.achievements,
            recentMilestones: userData.recentMilestones || prev.recentMilestones,
            rank: userData.stats?.rank || prev.rank,
            nextRankXP: userData.stats?.nextRankXP || prev.nextRankXP
          }));

          // Fetch documents
          const documentsRef = collection(db, 'documents');
          const q = query(documentsRef, where('userId', '==', currentUser.uid));
          const documentsSnapshot = await getDocs(q);
          
          const userDocuments = {};
          documentsSnapshot.forEach((doc) => {
            const data = doc.data();
            userDocuments[data.type] = {
              url: data.url,
              fileName: data.fileName,
              uploadedAt: data.uploadedAt
            };
          });
          
          setDocuments(userDocuments);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to load user data');
      }
    };

    fetchUserData();
  }, [currentUser]);

  useEffect(() => {
    const fetchAppliedScholarships = async () => {
      if (!currentUser?.uid) return;

      try {
        const applicationsRef = collection(db, 'applications');
        const q = query(applicationsRef, where('userId', '==', currentUser.uid));
        const snapshot = await getDocs(q);
        
        const applications = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setAppliedScholarships(applications);
      } catch (error) {
        console.error('Error fetching applications:', error);
        toast.error('Failed to load scholarship applications');
      }
    };

    fetchAppliedScholarships();
  }, [currentUser]);

  const totalCourses = 16;
  const progressPercentage = Math.round((completedCourses.length / totalCourses) * 100);

  async function handleLogout() {
    try {
      setLoading(true);
      await logout();
      navigate('/login');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Failed to log out:', error);
      toast.error('Failed to log out');
    } finally {
      setLoading(false);
    }
  }

  const handleOpenClass = () => {
    navigate('/courses');
  };

  const handleDailyTarget = async () => {
    if (!currentUser?.uid) return;

    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      const newTarget = {
        ...userStats.weeklyTargets,
        completed: Math.min(userStats.weeklyTargets.completed + 1, userStats.weeklyTargets.total)
      };

      await updateDoc(userDocRef, {
        'stats.weeklyTargets': newTarget
      });

      setUserStats(prev => ({
        ...prev,
        weeklyTargets: newTarget
      }));

      toast.success('Daily target updated!');
    } catch (error) {
      console.error('Error updating daily target:', error);
      toast.error('Failed to update daily target');
    }
  };

  const formatActivityTime = (date) => {
    const now = new Date();
    const activityDate = new Date(date);
    const diffDays = Math.floor((now - activityDate) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hari ini';
    if (diffDays === 1) return 'Kemarin';
    if (diffDays < 7) return `${diffDays} hari yang lalu`;
    return activityDate.toLocaleDateString();
  };

  const renderActivityDetails = (activity) => (
    <div>
      <p className="text-sm text-gray-500">{formatActivityTime(activity.time)}</p>
      <h3 className="font-semibold text-gray-800 mt-1">{activity.title}</h3>
      {activity.score !== undefined && (
        <p className="text-sm text-gray-600 mt-1">
          {activity.score !== undefined && `Score: ${activity.score}/${activity.totalQuestions * 2} • `}
          {activity.progress !== undefined && `Progress: ${activity.progress}% • `}
          {activity.streak !== undefined && `Streak: ${activity.streak}🔥`}
        </p>
      )}
    </div>
  );

  const StatsCard = ({ title, value, icon, change }) => {
    StatsCard.propTypes = {
      title: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired,
      change: PropTypes.number
    };
    
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-white rounded-xl p-4 shadow-lg"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
            {change && (
              <p className={`text-sm ${change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {change > 0 ? '↑' : '↓'} {Math.abs(change)}% vs last week
              </p>
            )}
          </div>
          <div className="p-3 bg-orange-100 rounded-full">
            {icon}
          </div>
        </div>
      </motion.div>
    );
  };

  const DocumentCard = ({ type, document }) => {
    DocumentCard.propTypes = {
      type: PropTypes.string.isRequired,
      document: PropTypes.shape({
        url: PropTypes.string.isRequired,
        fileName: PropTypes.string.isRequired,
        uploadedAt: PropTypes.any
      }).isRequired
    };

    const getDocumentTitle = (type) => {
      switch (type) {
        case DOCUMENT_TYPES.KARTU_KELUARGA:
          return 'Kartu Keluarga';
        case DOCUMENT_TYPES.AKTA_KELAHIRAN:
          return 'Akta Kelahiran';
        case DOCUMENT_TYPES.IJAZAH:
          return 'Ijazah';
        case DOCUMENT_TYPES.PIAGAM:
          return 'Piagam';
        case DOCUMENT_TYPES.KIP:
          return 'KIP';
        default:
          return type;
      }
    };

    return (
      <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-800">{getDocumentTitle(type)}</h3>
          <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
            Verified
          </span>
        </div>
        <p className="text-sm text-gray-500 truncate">{document.fileName}</p>
        <div className="mt-2">
          <a
            href={document.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-500 hover:text-orange-600 text-sm flex items-center gap-1"
          >
            View Document
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    );
  };

  if (!completedCourses.length) {
    return (
      <div className="text-gray-500 text-center py-4">
        No recent activities
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFA726] to-[#FF9800] p-4">
      <div className="ml-0 md:ml-24 max-w-7xl mx-auto">
        {/* Enhanced Header Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-[#FF9800] to-[#FF7043] rounded-3xl p-4 md:p-8 flex flex-col md:flex-row justify-between items-center mb-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
          {/* Left section */}
          <div className="space-y-4 md:space-y-6 w-full md:w-auto">
            <div>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 mb-3">
                <div>
                  <h1 className="text-white text-2xl md:text-3xl font-bold">
                    {currentUser?.displayName || 'Username'} 
                    <span className="ml-2 text-sm bg-white/20 px-3 py-1 rounded-full">Level {userStats.level}</span>
                  </h1>
                  <p className="text-white/80">
                    {userStats.streak} Day Streak
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <StatsCard
                title="Weekly Learning Hours"
                value={`${Math.round(userStats.totalMinutesLearned / 60)}h`}
                icon="⏱️"
                change={12}
              />
              <StatsCard
                title="Current Streak"
                value={`${userStats.streak} days`}
                icon="🔥"
                change={5}
              />
              <StatsCard
                title="XP This Week"
                value={userStats.xpPoints}
                icon="⭐"
                change={8}
              />
              <StatsCard
                title="Course Completion"
                value={`${progressPercentage}%`}
                icon="📚"
                change={15}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 md:gap-4">
              <button 
                onClick={handleOpenClass}
                className="bg-white text-[#FF9800] px-6 py-3 rounded-xl text-sm font-medium hover:bg-opacity-90 transition-all flex items-center shadow-md hover:shadow-lg"
              >
                <span className="mr-2">📚</span> Buka Kelas
              </button>
              <button 
                onClick={handleDailyTarget}
                className="bg-[#FF7043] text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-opacity-90 transition-all flex items-center shadow-md hover:shadow-lg"
              >
                <span className="mr-2">🎯</span> Target Harian
              </button>
              <button
                onClick={handleLogout}
                disabled={loading}
                className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-2 backdrop-blur-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                {loading ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          </div>

          {/* Right section - Mascot */}
          <motion.img 
            src={mascot} 
            alt="Mascot" 
            className="h-[200px] md:h-[500px] drop-shadow-2xl mt-4 md:mt-0"
            animate={{ y: [0, -10, 0] }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>

        {/* Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Badges Card */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-3xl p-4 md:p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6 text-[#FFA726]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 15.4L8.24 17.67L9.24 13.39L5.92 10.51L10.3 10.13L12 6.1L13.71 10.14L18.09 10.52L14.77 13.4L15.77 17.68L12 15.4Z"/>
                </svg>
                <h2 className="text-[#FFA726] font-bold text-xl">Achievements</h2>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/achievements')}
                className="text-sm text-orange-500 hover:text-orange-600 flex items-center gap-1"
              >
                View All
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {userStats.achievements.slice(0, 4).map((achievement) => (
                <motion.div 
                  key={achievement.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`rounded-xl p-4 flex items-start gap-3 ${
                    achievement.unlocked 
                      ? 'bg-orange-50 border-2 border-orange-200' 
                      : 'bg-gray-50 border border-gray-200'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-lg ${
                    achievement.unlocked 
                      ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white' 
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-800">{achievement.name}</h3>
                      <span className="text-xs font-medium text-orange-500 bg-orange-100 px-2 py-1 rounded-full">
                        +{achievement.reward} XP
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                    {!achievement.unlocked && (
                      <div className="mt-2">
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gray-300"
                            initial={{ width: 0 }}
                            animate={{ width: `${achievement.progress}%` }}
                            transition={{ duration: 1 }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{achievement.requirements}</p>
                      </div>
                    )}
                    {achievement.unlocked && (
                      <span className="text-xs text-green-500 flex items-center gap-1 mt-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Completed {achievement.date}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Recent Activity Card */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-3xl p-4 md:p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-6 h-6 text-[#FFA726]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13.5,8H12V13L16.28,15.54L17,14.33L13.5,12.25V8M13,3A9,9 0 0,0 4,12H1L4.96,16.03L9,12H6A7,7 0 0,1 13,5A7,7 0 0,1 20,12A7,7 0 0,1 13,19C11.07,19 9.32,18.21 8.06,16.94L6.64,18.36C8.27,19.99 10.51,21 13,21A9,9 0 0,0 22,12A9,9 0 0,0 13,3"/>
              </svg>
              <h2 className="text-[#FFA726] font-bold text-xl">Aktivitas Terakhir</h2>
            </div>

            <div className="space-y-4">
              {completedCourses.map((activity) => (
                <div key={activity.id} className="relative pl-8 pb-6 border-l-2 border-orange-100">
                  <div className="absolute left-[-8px] top-0 w-4 h-4 bg-[#FFA726] rounded-full"></div>
                  {renderActivityDetails(activity)}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Progress Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 bg-white rounded-3xl p-4 md:p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
          <div className="flex flex-col md:flex-row justify-between">
            {/* Left Section */}
            <div className="w-full md:w-1/2 mb-6 md:mb-0">
              <div className="flex items-center gap-2 mb-1">
                <svg className="w-6 h-6 text-[#FFA726]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13 3C8.03 3 4 7.03 4 12H1L4.89 15.89L4.96 16.03L9 12H6C6 8.13 9.13 5 13 5C16.87 5 20 8.13 20 12C20 15.87 16.87 19 13 19C11.07 19 9.32 18.21 8.06 16.94L6.64 18.36C8.27 19.99 10.51 21 13 21C17.97 21 22 16.97 22 12C22 7.03 17.97 3 13 3Z"/>
                </svg>
                <h2 className="text-[#FFA726] font-bold text-xl">Progress</h2>
              </div>
              <p className="text-gray-400 text-sm ml-8">Progress yang sudah anda capai</p>

              <div className="mt-8 ml-8">
                <span className="text-[#FFA726] text-5xl font-bold">{progressPercentage}%</span>
              </div>

              <div className="mt-4 flex justify-center md:justify-start">
                <svg className="w-32 h-32 md:w-48 md:h-48" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#FFA72633"
                    strokeWidth="10"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#FFA726"
                    strokeWidth="10"
                    strokeDasharray="282.7"
                    strokeDashoffset={282.7 * (1 - progressPercentage / 100)}
                    transform="rotate(-90 50 50)"
                  />
                </svg>
              </div>
            </div>

            {/* Right Section */}
            <div className="w-full md:w-1/2">
              <div className="h-full bg-[#FFA726] rounded-3xl md:rounded-r-3xl p-4 md:p-6">
                <h3 className="text-white font-semibold mb-4">Kelas Terselesaikan:</h3>
                <div className="space-y-3">
                  {completedCourses.map((course) => (
                    <div key={course.id} className="flex items-center gap-2 text-white/90">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm">{course.title}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-white/20">
                  <p className="text-white/80 text-sm">
                    {completedCourses.length} dari {totalCourses} kelas selesai
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Documents Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 bg-white rounded-3xl p-4 md:p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
          <div className="flex items-center gap-2 mb-6">
            <svg className="w-6 h-6 text-[#FFA726]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14,17H7V15H14M17,13H7V11H17M17,9H7V7H17M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3Z" />
            </svg>
            <h2 className="text-[#FFA726] font-bold text-xl">Documents</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(documents).map(([type, doc]) => (
              <DocumentCard key={type} type={type} document={doc} />
            ))}
          </div>
        </motion.div>

        {/* Applied Scholarships Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 bg-white rounded-3xl p-4 md:p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
          <div className="flex items-center gap-2 mb-6">
            <svg className="w-6 h-6 text-[#FFA726]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,3L1,9L12,15L21,10.09V17H23V9M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18Z" />
            </svg>
            <h2 className="text-[#FFA726] font-bold text-xl">Applied Scholarships</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {appliedScholarships.map((application) => (
              <motion.div
                key={application.id}
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800">{application.scholarshipTitle}</h3>
                    <p className="text-sm text-gray-600">{application.provider}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    application.status === 'pending' 
                      ? 'bg-yellow-100 text-yellow-600'
                      : application.status === 'approved'
                      ? 'bg-green-100 text-green-600'
                      : 'bg-red-100 text-red-600'
                  }`}>
                    {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                  </span>
                </div>
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Applied:</span>{' '}
                    {new Date(application.appliedAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Deadline:</span> {application.deadline}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Value:</span> {application.value}
                  </p>
                </div>
              </motion.div>
            ))}
            {appliedScholarships.length === 0 && (
              <div className="col-span-2 text-center py-8 text-gray-500">
                No scholarship applications yet
              </div>
            )}
          </div>
        </motion.div>

        {/* Upcoming Scholarships Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 bg-white rounded-3xl p-4 md:p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
          <div className="flex items-center gap-2 mb-6">
            <svg className="w-6 h-6 text-[#FFA726]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,3L1,9L12,15L21,10.09V17H23V9M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18Z" />
            </svg>
            <h2 className="text-[#FFA726] font-bold text-xl">Upcoming Scholarships</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {scholarships.map((scholarship) => (
              <motion.div
                key={scholarship.id}
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200"
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center text-2xl text-white">
                    {scholarship.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-800">{scholarship.name}</h3>
                        <p className="text-sm text-gray-600">{scholarship.provider}</p>
                      </div>
                      <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                        {scholarship.status}
                      </span>
                    </div>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Coverage:</span> {scholarship.coverage}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Eligibility:</span> {scholarship.eligibility}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Deadline:</span> {new Date(scholarship.deadline).toLocaleDateString()}
                      </p>
                    </div>
                    <button className="mt-3 text-orange-500 hover:text-orange-600 text-sm font-medium">
                      Learn More →
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Profile; 
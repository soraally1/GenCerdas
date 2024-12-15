import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc, updateDoc, writeBatch } from 'firebase/firestore';
import { db } from '../config/firebase';
import { motion} from 'framer-motion';
import mascot from '../assets/mascot.png';
import { toast } from 'react-hot-toast';

function Achievements() {
  const { currentUser } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [userData, setUserData] = useState({
    stats: {
      completedTasks: 5,
      attendedMeetings: 8,
      totalXP: 1240,
      level: 3,
      streak: 7,
      totalMinutesLearned: 420,
      rank: "Pelajar Perunggu",
      nextRankXP: 2000,
      podcastsListened: 3,
      totalPodcastMinutes: 45
    },
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
      },
      { 
        id: 5, 
        name: "Juara Kuis", 
        icon: "🏆", 
        description: "Dapatkan nilai 100% di 3 kuis",
        progress: 66,
        reward: 300,
        unlocked: false,
        category: 'quizzes',
        requirements: "2/3 nilai sempurna"
      },
      {
        id: 6,
        name: "Kupu-kupu Sosial",
        icon: "🦋",
        description: "Berpartisipasi dalam 5 diskusi komunitas",
        progress: 40,
        reward: 150,
        unlocked: false,
        category: 'social',
        requirements: "2/5 diskusi"
      },
      // New Podcast Achievements
      {
        id: 7,
        name: "Pendengar Setia",
        icon: "🎧",
        description: "Dengarkan 5 podcast sampai selesai",
        progress: 60,
        reward: 100,
        unlocked: false,
        category: 'podcast',
        requirements: "3/5 podcast selesai"
      },
      {
        id: 8,
        name: "Pencinta Audio",
        icon: "🎙️",
        description: "Dengarkan total 2 jam podcast",
        progress: 38,
        reward: 200,
        unlocked: false,
        category: 'podcast',
        requirements: "45/120 menit"
      },
      {
        id: 9,
        name: "Kolektor Podcast",
        icon: "📻",
        description: "Dengarkan podcast dari 5 kategori berbeda",
        progress: 20,
        reward: 250,
        unlocked: false,
        category: 'podcast',
        requirements: "1/5 kategori"
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
      },
      {
        id: 3,
        title: "Menyelesaikan Podcast Pertama",
        date: "18 Jan 2024",
        xpGained: 100
      }
    ]
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser?.uid) return;
      setLoading(true);
      setError(null);

      try {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData(prev => ({
            ...prev,
            stats: {
              ...prev.stats,
              ...data.stats
            },
            achievements: data.achievements || prev.achievements,
            recentMilestones: data.recentMilestones || prev.recentMilestones
          }));
        } else {
          // Create initial user data if it doesn't exist
          await updateDoc(userDocRef, {
            stats: userData.stats,
            achievements: userData.achievements,
            recentMilestones: userData.recentMilestones
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load achievements');
        toast.error('Failed to load achievements');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser]);

  useEffect(() => {
    const checkAchievementsInterval = setInterval(() => {
      checkAllAchievements();
    }, 60000); // Check every minute

    return () => clearInterval(checkAchievementsInterval);
  }, [userData.stats]);

  const calculateLevel = (xp) => {
    return Math.floor(xp / 1000) + 1;
  };

  const calculateRank = (xp) => {
    if (xp >= 5000) return { rank: "Pelajar Emas", nextRankXP: 10000 };
    if (xp >= 2000) return { rank: "Pelajar Perak", nextRankXP: 5000 };
    return { rank: "Pelajar Perunggu", nextRankXP: 2000 };
  };

  const updateAchievementProgress = async (achievementId, newProgress) => {
    if (!currentUser?.uid) return;

    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      const batch = writeBatch(db);

      // Update achievement progress
      const updatedAchievements = userData.achievements.map(achievement => {
        if (achievement.id === achievementId) {
          const wasUnlocked = achievement.unlocked;
          const isNowUnlocked = newProgress >= 100;
          
          return {
            ...achievement,
            progress: Math.min(newProgress, 100),
            unlocked: isNowUnlocked,
            date: isNowUnlocked && !wasUnlocked ? 
              new Date().toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              }) : 
              achievement.date
          };
        }
        return achievement;
      });

      // If achievement is newly completed
      const achievement = userData.achievements.find(a => a.id === achievementId);
      if (achievement && newProgress >= 100 && !achievement.unlocked) {
        const newMilestone = {
          id: Date.now(),
          title: `Membuka pencapaian "${achievement.name}"`,
          date: new Date().toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }),
          xpGained: achievement.reward
        };

        const updatedMilestones = [newMilestone, ...userData.recentMilestones].slice(0, 5);
        const newTotalXP = userData.stats.totalXP + achievement.reward;
        const newRank = calculateRank(newTotalXP);

        batch.update(userDocRef, {
          achievements: updatedAchievements,
          recentMilestones: updatedMilestones,
          'stats.totalXP': newTotalXP,
          'stats.rank': newRank.rank,
          'stats.nextRankXP': newRank.nextRankXP,
          'stats.level': calculateLevel(newTotalXP)
        });

        // Commit all updates in one batch
        await batch.commit();

        setUserData(prev => ({
          ...prev,
          achievements: updatedAchievements,
          recentMilestones: updatedMilestones,
          stats: {
            ...prev.stats,
            totalXP: newTotalXP,
            rank: newRank.rank,
            nextRankXP: newRank.nextRankXP,
            level: calculateLevel(newTotalXP)
          }
        }));

        // Show success toast with animation
        toast.custom(() => (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-white rounded-lg shadow-lg p-4 flex items-center gap-3"
          >
            <div className="text-2xl">{achievement.icon}</div>
            <div>
              <h3 className="font-bold text-gray-800">Achievement Unlocked!</h3>
              <p className="text-sm text-gray-600">{achievement.name}</p>
              <p className="text-xs text-orange-500">+{achievement.reward} XP</p>
            </div>
          </motion.div>
        ));
      } else {
        // Just update achievements if no completion
        batch.update(userDocRef, {
          achievements: updatedAchievements
        });
        await batch.commit();

        setUserData(prev => ({
          ...prev,
          achievements: updatedAchievements
        }));
      }
    } catch (error) {
      console.error('Error updating achievement:', error);
      toast.error('Gagal memperbarui pencapaian');
    }
  };

  const filterAchievements = (category) => {
    setSelectedCategory(category);
  };

  const handleAchievementClick = (achievement) => {
    // Implement a modal component that uses these:
    // const [showRewardModal, setShowRewardModal] = useState(false);
    // const [selectedAchievement, setSelectedAchievement] = useState(null);
  };

  const calculateAchievementProgress = (achievement, stats) => {
    switch (achievement.id) {
      case 1: // Langkah Pertama
        return stats.completedCourses > 0 ? 100 : 0;
      case 2: // Pembelajar Cepat
        return (stats.completedCourses / 5) * 100;
      case 3: // Rajin Belajar
        return (stats.streak / 7) * 100;
      case 4: // Pencari Ilmu
        return (stats.watchedVideos / 10) * 100;
      case 5: // Juara Kuis
        return (stats.perfectQuizzes / 3) * 100;
      case 6: // Kupu-kupu Sosial
        return (stats.communityParticipation / 5) * 100;
      case 7: // Pendengar Setia
        return (stats.podcastsListened / 5) * 100;
      case 8: // Pencinta Audio
        return (stats.totalPodcastMinutes / 120) * 100;
      case 9: // Kolektor Podcast
        return (stats.uniquePodcastCategories / 5) * 100;
      default:
        return 0;
    }
  };

  const checkAllAchievements = async () => {
    if (!currentUser?.uid || !userData.stats) return;

    const achievements = userData.achievements;
    let updated = false;

    for (const achievement of achievements) {
      if (!achievement.unlocked) {
        const calculatedProgress = calculateAchievementProgress(achievement, userData.stats);
        if (calculatedProgress !== achievement.progress) {
          await updateAchievementProgress(achievement.id, calculatedProgress);
          updated = true;
        }
      }
    }

    return updated;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFA726] to-[#FF9800] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFA726] to-[#FF9800] flex items-center justify-center">
        <div className="bg-white rounded-lg p-6 text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-[#FF9800] text-white px-4 py-2 rounded-lg hover:bg-[#F57C00]"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  const categories = [
    { id: 'all', name: 'Semua' },
    { id: 'courses', name: 'Kursus' },
    { id: 'quizzes', name: 'Kuis' },
    { id: 'learning', name: 'Pembelajaran' },
    { id: 'engagement', name: 'Keaktifan' },
    { id: 'social', name: 'Sosial' },
    { id: 'podcast', name: 'Podcast' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFA726] to-[#FF9800] p-4 pb-20">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Enhanced Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20"
        >
          {/* User Level and Rank Section */}
          <div className="flex items-center justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                      {userData.stats.level}
                    </span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-yellow-400 rounded-full p-1">
                    <span className="text-xs">🏆</span>
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">
                    Level {userData.stats.level}
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-4 py-1 bg-gradient-to-r from-[#CD7F32] to-[#B87333] text-white rounded-full text-sm font-medium shadow-lg">
                      {userData.stats.rank}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* XP Progress Bar */}
              <div className="w-full max-w-md">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>{userData.stats.totalXP} XP</span>
                  <span>{userData.stats.nextRankXP} XP</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ 
                      width: `${(userData.stats.totalXP / userData.stats.nextRankXP) * 100}%` 
                    }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-orange-400 to-orange-600"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {userData.stats.nextRankXP - userData.stats.totalXP} XP untuk naik peringkat
                </p>
              </div>
            </div>
            
            <motion.img
              src={mascot}
              alt="Maskot"
              className="h-32 w-32 object-contain"
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, 0, -5, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {[
              { label: "Streak Belajar", value: `${userData.stats.streak} Hari`, icon: "🔥", color: "from-red-400 to-orange-500" },
              { label: "Tugas Selesai", value: userData.stats.completedTasks, icon: "✅", color: "from-green-400 to-emerald-500" },
              { label: "Waktu Belajar", value: `${Math.round(userData.stats.totalMinutesLearned / 60)}j`, icon: "⏱️", color: "from-blue-400 to-cyan-500" },
              { label: "Podcast Didengar", value: userData.stats.podcastsListened, icon: "🎧", color: "from-purple-400 to-pink-500" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative group"
              >
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`} />
                  <div className="text-3xl mb-3">{stat.icon}</div>
                  <div className="font-bold text-2xl text-gray-800">{stat.value}</div>
                  <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Milestones */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <span className="text-orange-500">🏆</span>
            Pencapaian Terbaru
          </h2>
          <div className="space-y-4">
            {userData.recentMilestones.map((milestone, index) => (
              <motion.div 
                key={milestone.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between bg-orange-50 p-4 rounded-xl hover:bg-orange-100 transition-colors duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white shadow-lg">
                    🎉
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{milestone.title}</h3>
                    <p className="text-sm text-gray-500">{milestone.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-orange-500 font-bold">+{milestone.xpGained}</span>
                  <span className="text-orange-400 text-sm">XP</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Achievement Categories */}
        <div className="sticky top-4 z-10 py-4 backdrop-blur-xl bg-white/20 rounded-2xl">
          <div className="flex gap-2 overflow-x-auto pb-2 px-4 scrollbar-hide">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => filterAchievements(category.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                  selectedCategory === category.id
                    ? 'bg-white text-orange-500 shadow-lg'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {category.name}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Achievements Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {userData.achievements
            .filter(achievement => selectedCategory === 'all' || achievement.category === selectedCategory)
            .map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className={`bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer
                  ${achievement.unlocked ? 'border-2 border-orange-400' : 'border border-white/20'}`}
                onClick={() => handleAchievementClick(achievement)}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-2xl shadow-lg
                    ${achievement.unlocked 
                      ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white' 
                      : 'bg-gray-100 text-gray-400'}`}
                  >
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-gray-800 text-lg">{achievement.name}</h3>
                      <span className="text-sm font-medium text-orange-500 bg-orange-100 px-3 py-1 rounded-full">
                        +{achievement.reward} XP
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      {achievement.description}
                    </p>
                    <div className="mt-4">
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full ${
                            achievement.unlocked 
                              ? 'bg-gradient-to-r from-orange-400 to-orange-600' 
                              : 'bg-gray-300'
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${achievement.progress}%` }}
                          transition={{ duration: 1 }}
                        />
                      </div>
                      <div className="flex justify-between mt-2">
                        <span className="text-xs text-gray-500">
                          {achievement.requirements || `Progress: ${achievement.progress}%`}
                        </span>
                        {achievement.unlocked && (
                          <span className="text-xs text-green-500 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Completed {achievement.date}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
        </motion.div>
      </div>
    </div>
  );
}

export default Achievements;
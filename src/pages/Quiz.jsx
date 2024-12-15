import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { motion, AnimatePresence } from 'framer-motion';
import { courseTitles } from '../utils/uploadQuizData';
import { useAuth } from '../contexts/AuthContext';

function Quiz() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [lives, setLives] = useState(3);
  const [streak, setStreak] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        setLoading(true);
        const courseTitle = courseTitles[courseId];
        if (!courseTitle) {
          throw new Error("Invalid course ID");
        }

        const docRef = doc(db, 'quizzes', courseTitle);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setQuizData(docSnap.data().questions);
        } else {
          throw new Error("Quiz not found");
        }
      } catch (error) {
        console.error("Error fetching quiz data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizData();
  }, [courseId]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFA726] to-[#FF9800] p-4 flex items-center justify-center">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          <p className="mt-4 text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFA726] to-[#FF9800] p-4 flex items-center justify-center">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold mb-2">Error Loading Quiz</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate(`/course/${courseId}`)}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Back to Course
          </button>
        </div>
      </div>
    );
  }

  // Show error if no quiz data
  if (!quizData || quizData.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFA726] to-[#FF9800] p-4 flex items-center justify-center">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 text-center">
          <div className="text-orange-500 text-xl mb-4">ℹ️</div>
          <h2 className="text-xl font-bold mb-2">No Quiz Available</h2>
          <p className="text-gray-600 mb-4">This course doesn&apos;t have any quiz questions yet.</p>
          <button
            onClick={() => navigate(`/course/${courseId}`)}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Back to Course
          </button>
        </div>
      </div>
    );
  }

  const handleQuizComplete = async () => {
    try {
      if (!currentUser) return;

      const userDocRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const completedCourses = userData.completedCourses || [];
        const courseTitle = courseTitles[courseId];
        
        // Calculate progress percentage
        const totalQuestions = quizData.length;
        const correctAnswers = score;
        const progressPercentage = Math.round((correctAnswers / totalQuestions) * 100);
        
        // Check if course was previously completed
        const existingCourseIndex = completedCourses.findIndex(course => course.id === courseId);
        
        const courseData = {
          id: courseId,
          title: courseTitle,
          completedAt: new Date().toISOString(),
          score: score,
          progress: progressPercentage,
          totalQuestions: totalQuestions,
          correctAnswers: correctAnswers,
          streak: streak
        };

        let updatedCompletedCourses;
        if (existingCourseIndex !== -1) {
          // Update existing course data if score is higher
          if (score > completedCourses[existingCourseIndex].score) {
            updatedCompletedCourses = [...completedCourses];
            updatedCompletedCourses[existingCourseIndex] = courseData;
          } else {
            updatedCompletedCourses = completedCourses;
          }
        } else {
          // Add new course completion
          updatedCompletedCourses = [...completedCourses, courseData];
        }

        // Update user stats
        const updatedStats = {
          xpPoints: (userData.stats?.xpPoints || 0) + score,
          totalMinutesLearned: (userData.stats?.totalMinutesLearned || 0) + 30,
          weeklyTargets: {
            completed: Math.min((userData.stats?.weeklyTargets?.completed || 0) + 1, 
                              (userData.stats?.weeklyTargets?.total || 5)),
            total: userData.stats?.weeklyTargets?.total || 5
          },
          level: Math.floor(((userData.stats?.xpPoints || 0) + score) / 500) + 1,
          streak: Math.max(userData.stats?.streak || 0, streak)
        };

        // Update user document
        await updateDoc(userDocRef, {
          completedCourses: updatedCompletedCourses,
          'stats': updatedStats,
          lastActivityAt: new Date().toISOString()
        });
      }

      setShowResult(true);
    } catch (error) {
      console.error("Error completing quiz:", error);
    }
  };

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
    const correct = answerIndex === quizData[currentQuestion].correctAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      setStreak(streak + 1);
      setScore(score + (streak >= 3 ? 2 : 1)); // Double points for 3+ streak
    } else {
      setStreak(0);
      setLives(lives - 1);
    }

    // Auto-proceed after feedback
    setTimeout(() => {
      handleNext();
    }, 2000);
  };

  const handleNext = () => {
    setShowFeedback(false);
    
    if (lives === 0) {
      handleQuizComplete();
      return;
    }

    if (currentQuestion + 1 < quizData.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
    } else {
      handleQuizComplete();
    }
  };

  const handleBackToCourse = () => {
    navigate(`/course/${courseId}`);
  };

  const renderQuestion = () => {
    const question = quizData[currentQuestion];
    
    switch (question.type) {
      case 'multipleChoice':
        return (
          <div className="space-y-4">
            {question.options.map((option, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`w-full p-5 text-left rounded-xl border-2 transition-all duration-300 hover:shadow-md ${
                  selectedAnswer === index
                    ? isCorrect
                      ? 'border-green-500 bg-green-50 shadow-green-100'
                      : 'border-red-500 bg-red-50 shadow-red-100'
                    : 'border-gray-200 hover:border-orange-500 hover:bg-orange-50'
                }`}
                onClick={() => handleAnswerSelect(index)}
                disabled={selectedAnswer !== null}
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 font-medium">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="text-gray-700">{option}</span>
                </div>
              </motion.button>
            ))}
          </div>
        );

      case 'trueFalse':
        return (
          <div className="space-y-6">
            <p className="text-lg font-medium text-gray-700 mb-6">{question.statement}</p>
            <div className="grid grid-cols-2 gap-6">
              {['True', 'False'].map((option, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`p-6 rounded-xl border-2 font-medium transition-all duration-300 hover:shadow-md ${
                    selectedAnswer === (index === 0)
                      ? isCorrect
                        ? 'border-green-500 bg-green-50 shadow-green-100'
                        : 'border-red-500 bg-red-50 shadow-red-100'
                      : 'border-gray-200 hover:border-orange-500 hover:bg-orange-50'
                  }`}
                  onClick={() => handleAnswerSelect(index === 0)}
                  disabled={selectedAnswer !== null}
                >
                  {option}
                </motion.button>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFA726] to-[#FF9800] p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {!showResult ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8"
          >
            {/* Quiz Title with better styling */}
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                {courseTitles[courseId]}
              </h1>
              <p className="text-gray-500">Complete the quiz to earn points and badges</p>
            </div>

            {/* Enhanced Header */}
            <div className="flex items-center justify-between mb-8 bg-orange-50 p-4 rounded-xl">
              <div className="flex items-center gap-3">
                {[...Array(lives)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-7 h-7 text-red-500 drop-shadow-md"
                  >
                    ❤️
                  </motion.div>
                ))}
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-orange-100/50 px-4 py-2 rounded-full">
                  <span className="text-orange-500 text-lg">🔥</span>
                  <span className="font-semibold text-orange-600">{streak}</span>
                </div>
                <div className="bg-orange-500 text-white px-4 py-2 rounded-full font-medium">
                  Score: {score}
                </div>
              </div>
            </div>

            {/* Improved Progress Bar */}
            <div className="mb-10">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Progress</span>
                <span className="text-sm font-medium text-gray-600">
                  Question {currentQuestion + 1} of {quizData.length}
                </span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                <motion.div 
                  className="h-full bg-gradient-to-r from-orange-500 to-orange-400"
                  initial={{ width: 0 }}
                  animate={{ 
                    width: `${((currentQuestion + 1) / quizData.length) * 100}%` 
                  }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Question Section */}
            <AnimatePresence mode='wait'>
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="mb-8"
              >
                <h2 className="text-xl md:text-2xl font-bold mb-8 text-gray-800">
                  {quizData[currentQuestion].question}
                </h2>
                {renderQuestion()}
              </motion.div>
            </AnimatePresence>

            {/* Enhanced Feedback */}
            <AnimatePresence>
              {showFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  className={`fixed bottom-0 left-0 right-0 p-6 text-white ${
                    isCorrect ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-red-500 to-red-600'
                  } shadow-lg backdrop-blur-sm`}
                >
                  <div className="max-w-3xl mx-auto">
                    <p className="font-bold text-lg mb-1">
                      {isCorrect ? '🎉 Correct!' : '❌ Incorrect'} 
                    </p>
                    <p className="text-white/90">
                      {quizData[currentQuestion].explanation}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 text-center"
          >
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2 text-gray-800">
                {lives > 0 ? '🎉 Quiz Completed!' : '💔 Game Over'}
              </h2>
              <p className="text-gray-500">
                {lives > 0 ? "Great job! Here's your performance:" : "Don't worry, you can try again!"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="bg-orange-50 rounded-xl p-6">
                <p className="text-4xl font-bold text-orange-500 mb-2">{score}</p>
                <p className="text-gray-600">Final Score</p>
              </div>
              <div className="bg-orange-50 rounded-xl p-6">
                <p className="text-4xl font-bold text-orange-500 mb-2">{streak}</p>
                <p className="text-gray-600">Highest Streak</p>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <button
                className="bg-orange-500 text-white px-8 py-3 rounded-xl font-medium hover:bg-orange-600 transition-all shadow-lg hover:shadow-xl"
                onClick={handleBackToCourse}
              >
                Back to Course
              </button>
              <button
                className="bg-blue-500 text-white px-8 py-3 rounded-xl font-medium hover:bg-blue-600 transition-all shadow-lg hover:shadow-xl"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default Quiz; 
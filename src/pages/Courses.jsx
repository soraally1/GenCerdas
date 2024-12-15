import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { courseData } from './courseData';

function Courses() {
  const navigate = useNavigate();

  const courseCategories = [
    {
      title: "Persiapan Dokumen Dasar",
      icon: "📄",
      courses: courseData.filter(course => [1, 2, 3, 6].includes(course.id))
    },
    {
      title: "Persiapan Bahasa Inggris",
      icon: "🇬🇧",
      courses: courseData.filter(course => [4, 5, 7, 8, 16].includes(course.id))
    },
    {
      title: "Persiapan Bahasa Jepang",
      icon: "🇯🇵",
      courses: courseData.filter(course => [9, 10, 11, 12, 13, 14, 15].includes(course.id))
    },
    {
      title: "Persiapan Bahasa Mandarin",
      icon: "🇨🇳",
      courses: courseData.filter(course => [17, 18, 19, 20].includes(course.id))
    },
    {
      title: "Persiapan Bahasa Korea",
      icon: "🇰🇷",
      courses: courseData.filter(course => [21, 22, 23, 24].includes(course.id))
    },
    {
      title: "Pengembangan Jaringan",
      icon: "🌐",
      courses: courseData.filter(course => [25].includes(course.id))
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFA726] to-[#FF9800]">
      {/* Header Section with Animation */}
      <motion.div 
        className="bg-white/10 backdrop-blur-md shadow-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.h1 
            className="text-4xl font-bold text-white"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            Kursus Beasiswa
          </motion.h1>
          <motion.p 
            className="mt-3 text-lg text-white/90"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            Pilih kursus sesuai kebutuhan persiapan beasiswa Anda
          </motion.p>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {courseCategories.map((category, index) => (
            <motion.div 
              key={index} 
              className="mb-16"
              variants={itemVariants}
            >
              {/* Category Header */}
              <div className="flex items-center gap-4 mb-8">
                <span className="text-3xl">{category.icon}</span>
                <h2 className="text-2xl font-bold text-white">{category.title}</h2>
                <div className="h-0.5 flex-grow bg-white/20 rounded-full" />
              </div>

              {/* Course Grid */}
              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                variants={containerVariants}
              >
                {category.courses.map((course) => (
                  <motion.div
                    key={course.id}
                    variants={itemVariants}
                    whileHover={{ y: -8, transition: { duration: 0.2 } }}
                    className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                    onClick={() => navigate(`/course/${course.id}`)}
                  >
                    {/* Course Image */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <motion.img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                      
                      {/* Course Duration & Modules */}
                      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                        <motion.div 
                          className="flex items-center gap-2.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full"
                          whileHover={{ scale: 1.05 }}
                        >
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-white text-sm font-medium">
                            {course.modules?.reduce((total, module) => {
                              const duration = parseInt(module.duration);
                              return total + (isNaN(duration) ? 0 : duration);
                            }, 0)} Menit
                          </span>
                        </motion.div>
                        <motion.div 
                          className="flex items-center gap-2.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full"
                          whileHover={{ scale: 1.05 }}
                        >
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 4v12l-4-2-4 2V4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-white text-sm font-medium">
                            {course.modules?.length || 0} Modul
                          </span>
                        </motion.div>
                      </div>
                    </div>

                    {/* Course Content */}
                    <div className="p-6 space-y-4">
                      <div className="flex flex-wrap gap-2">
                        <motion.span 
                          className="bg-orange-100/80 text-orange-600 text-xs px-3 py-1.5 rounded-full font-semibold tracking-wide"
                          whileHover={{ scale: 1.05 }}
                        >
                          Level {Math.floor(course.id / 5) + 1}
                        </motion.span>
                        <motion.span 
                          className="bg-blue-100/80 text-blue-600 text-xs px-3 py-1.5 rounded-full font-semibold tracking-wide"
                          whileHover={{ scale: 1.05 }}
                        >
                          Sertifikat
                        </motion.span>
                        {course.id <= 5 && (
                          <motion.span 
                            className="bg-green-100/80 text-green-600 text-xs px-3 py-1.5 rounded-full font-semibold tracking-wide"
                            whileHover={{ scale: 1.05 }}
                          >
                            Populer
                          </motion.span>
                        )}
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2">
                          {course.title}
                        </h3>

                        <p className="text-gray-600 text-sm line-clamp-2">
                          {course.description}
                        </p>
                      </div>

                      <motion.button 
                        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white px-5 py-3.5 rounded-2xl text-sm font-semibold
                          hover:from-orange-600 hover:to-orange-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2
                          active:from-orange-700 active:to-orange-800"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span>Mulai Belajar</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export default Courses; 
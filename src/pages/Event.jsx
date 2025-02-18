import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiCalendar,
  FiMapPin,
  FiUsers,
  FiGlobe,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import Banner1 from "../assets/Campusexpo.png";
import Banner2 from "../assets/Campusexpo2.jpeg";

const EventPage = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isFormOpen, setIsFormOpen] = useState(false); // State to handle form visibility
  const [selectedEvent, setSelectedEvent] = useState(null); // State to store the selected event

  const bannerSlides = [
    {
      id: 1,
      image: Banner1,
      title: "Discover Your Global Education Journey",
      subtitle: "Explore opportunities at world-class universities",
    },
    {
      id: 2,
      image: Banner2,
      title: "Shape Your Future with GenCerdas",
      subtitle: "Connect with leading international institutions",
    },
  ];

  const events = [
    {
      id: 1,
      title: "International Campus Expo 2025",
      date: "5-6 Maret 2025",
      location: "Jakarta Convention Center",
      description:
        "Pameran kampus internasional terbesar di Indonesia dengan partisipasi lebih dari 50 universitas terkemuka dari seluruh dunia.",
      universities: [
        "University of Tokyo",
        "National University of Singapore",
        "University of Melbourne",
        "Seoul National University",
      ],
      attendees: "2000+",
      image: "/api/placeholder/600/300",
      category: "Asia Pacific",
    },
    {
      id: 2,
      title: "European Universities Fair",
      date: "12-13 April 2025",
      location: "Ballroom Hotel Mulia Senayan",
      description:
        "Kesempatan eksklusif untuk bertemu langsung dengan perwakilan universitas top Eropa dan mendapatkan informasi beasiswa.",
      universities: [
        "University of Oxford",
        "TU Munich",
        "ETH Zurich",
        "KU Leuven",
      ],
      attendees: "1500+",
      image: "/api/placeholder/600/300",
      category: "Europe",
    },
  ];

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % bannerSlides.length);
  };

  const prevSlide = () => {
    setActiveSlide(
      (prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000); // Auto-play every 5 seconds

    return () => clearInterval(interval);
  }, [activeSlide]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  const handleRegisterClick = (event) => {
    setSelectedEvent(event); // Store the selected event
    setIsFormOpen(true); // Open the registration form
  };

  const handleFormClose = () => {
    setIsFormOpen(false); // Close the form
    setSelectedEvent(null); // Clear the selected event
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFA726] to-[#FF9800]">
      {/* Banner Section */}
      <div className="relative h-[400px] overflow-hidden">
        {bannerSlides.map((slide, index) => (
          <motion.div
            key={slide.id}
            initial={{ opacity: 0 }}
            animate={{
              opacity: activeSlide === index ? 1 : 0,
              x: `${(index - activeSlide) * 100}%`,
            }}
            transition={{ duration: 0.5 }}
            className="absolute w-full h-full"
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover brightness-50"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-5xl font-bold mb-4"
              >
                {slide.title}
              </motion.h1>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-xl"
              >
                {slide.subtitle}
              </motion.p>
            </div>
          </motion.div>
        ))}

        {/* Banner Navigation */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 p-2 rounded-full text-white transition-colors"
        >
          <FiChevronLeft size={24} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 p-2 rounded-full text-white transition-colors"
        >
          <FiChevronRight size={24} />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {bannerSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                activeSlide === index ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Events Section */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-8 md:grid-cols-2"
        >
          {events.map((event) => (
            <motion.div
              key={event.id}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              {/* Event Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-white/90 px-4 py-1 rounded-full">
                  <span className="text-orange-500 font-medium">
                    {event.category}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {event.title}
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-600">
                    <FiCalendar className="w-5 h-5 mr-2 text-orange-500" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FiMapPin className="w-5 h-5 mr-2 text-orange-500" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FiUsers className="w-5 h-5 mr-2 text-orange-500" />
                    <span>{event.attendees} Peserta Terdaftar</span>
                  </div>
                </div>

                <p className="text-gray-600 mb-6">{event.description}</p>

                <div className="space-y-4">
                  <div className="flex items-center text-gray-600">
                    <FiGlobe className="w-5 h-5 mr-2 text-orange-500" />
                    <span className="font-semibold">Universitas Peserta:</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {event.universities.map((uni, index) => (
                      <div
                        key={index}
                        className="text-sm text-gray-600 bg-orange-50 rounded-full px-3 py-1"
                      >
                        {uni}
                      </div>
                    ))}
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-6 w-full bg-gradient-to-r from-[#FFA726] to-[#FF9800] text-white font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity"
                  onClick={() => handleRegisterClick(event)} // Open registration form
                >
                  Daftar Sekarang
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Registration Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full transform transition-all duration-300 scale-100 hover:scale-105 shadow-xl">
            <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
              Pendaftaran {selectedEvent.title}
            </h2>
            <form>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-600">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  placeholder="Masukkan nama lengkap"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-600">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  placeholder="Masukkan email"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-600">
                  Nomor Telepon
                </label>
                <input
                  type="tel"
                  className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  placeholder="Masukkan nomor telepon"
                />
              </div>
              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={handleFormClose}
                  className="text-gray-600 font-medium hover:text-gray-800 transition-all"
                >
                  <i className="fas fa-times-circle mr-2"></i>Batal
                </button>
                <button
                  type="submit"
                  className="bg-orange-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                >
                  Daftar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventPage;

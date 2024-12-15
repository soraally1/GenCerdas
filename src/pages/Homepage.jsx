import '@fontsource/plus-jakarta-sans';
import { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { HiOutlineArrowCircleDown, HiOutlineHeart, HiOutlineUserGroup } from 'react-icons/hi';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaGithub } from 'react-icons/fa';
import { HiMail, HiPhone, HiLocationMarker } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import money from '../assets/needed/money.png';
import GGon from '../assets/G-Gon.png';
import book from '../assets/needed/book.png';
import friends from '../assets/needed/friend.png';
import MEXTImg from '../assets/beasiswa/MEXT.png';
import LPDPImg from '../assets/beasiswa/LPDP.png';
import BIImg from '../assets/beasiswa/BI.png';
import kampongImg from '../assets/kampong.png';
import hutanRimbaImg from '../assets/HutanRimba.jpg';
import gencerdasLogo from '../assets/gencerdaslog.png';

function Homepage() {
  const navigate = useNavigate();
  const [selectedScholarship, setSelectedScholarship] = useState(null);

  const { scrollYProgress } = useScroll();
  const forestImageY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const textOpacity = useTransform(scrollYProgress, [0.5, 0.8], [0, 1]);
  const textY = useTransform(scrollYProgress, [0.5, 0.8], ['50px', '0px']);

  const scholarships = [
    {
      title: "MEXT Scholarship",
      org: "Japanese Government",
      img: MEXTImg,
      description: "Program beasiswa dari pemerintah Jepang untuk mahasiswa internasional yang ingin melanjutkan studi S1/S2/S3 di Jepang. Program ini menawarkan kesempatan untuk belajar di universitas terbaik Jepang dengan dukungan penuh.",
      requirements: [
        "Usia dibawah 35 tahun",
        "IPK minimal 3.0 dari 4.0",
        "Kemampuan Bahasa Jepang/Inggris yang baik",
        "Sehat jasmani dan rohani",
        "Belum pernah menerima beasiswa MEXT sebelumnya",
        "Siap untuk mempelajari bahasa Jepang"
      ],
      benefits: [
        "Biaya kuliah penuh",
        "Tunjangan bulanan ¥143,000-¥145,000",
        "Tiket pesawat PP ke Jepang",
        "Biaya persiapan keberangkatan ¥200,000",
        "Kursus bahasa Jepang selama 6 bulan",
        "Asuransi kesehatan"
      ],
      deadline: "Mei 2024",
      link: "https://www.studyinjapan.go.jp/en/smap-stopj-applications-research.html"
    },
    {
      title: "Beasiswa LPDP",
      org: "Kemenkeu",
      img: LPDPImg,
      description: "LPDP (Lembaga Pengelola Dana Pendidikan) menyediakan beasiswa untuk pendidikan pascasarjana bagi putra-putri Indonesia yang ingin melanjutkan studi baik di dalam maupun luar negeri.",
      requirements: [
        "WNI berusia maksimal 35 tahun (S2) atau 40 tahun (S3)",
        "IPK minimal 3.0",
        "Skor TOEFL ITP min. 550 / IELTS min. 6.0",
        "Telah diterima di perguruan tinggi tujuan",
        "Menandatangani kontrak ikatan dinas",
        "Sehat jasmani dan rohani"
      ],
      benefits: [
        "Biaya pendidikan penuh",
        "Biaya hidup bulanan",
        "Asuransi kesehatan",
        "Biaya transportasi",
        "Biaya visa dan pembuatan passport",
        "Tunjangan keluarga (untuk program tertentu)"
      ],
      deadline: "Batch 1: 31 Januari 2024, Batch 2: 30 Juni 2024",
      link: "https://lpdp.kemenkeu.go.id/"
    },
    {
      title: "Beasiswa Bank Indonesia",
      org: "Bank Indonesia",
      img: BIImg,
      description: "Program Beasiswa Bank Indonesia ditujukan untuk mahasiswa berprestasi yang tertarik dalam bidang ekonomi, perbankan, dan keuangan. Program ini mendukung pengembangan SDM berkualitas di Indonesia.",
      requirements: [
        "Mahasiswa S1 semester 4-6",
        "IPK minimal 3.25",
        "Aktif dalam kegiatan organisasi",
        "Tidak sedang menerima beasiswa lain",
        "Berasal dari jurusan ekonomi/manajemen/akuntansi",
        "Lolos seleksi administrasi dan wawancara"
      ],
      benefits: [
        "Bantuan biaya pendidikan per semester",
        "Tunjangan buku",
        "Pelatihan dan workshop",
        "Kesempatan magang di Bank Indonesia",
        "Networking dengan penerima beasiswa lain"
      ],
      deadline: "15 April 2024",
      link: "https://www.bi.go.id/id/institute/beasiswa/"
    }
  ];

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="bg-[#FAB12F] font-['Plus_Jakarta_Sans']">
      <div className="min-h-screen relative overflow-hidden  bg-[#FAB12F]">
        <div className="relative z-10">
          {/* Hero Section */}
          <section className="pt-32 lg:pt-64 pb-16 px-4 bg-[#FAB12F]">
            <div className="container mx-auto px-4 lg:px-0 lg:ml-72">
              <div className="w-full lg:w-[65%] ml-auto">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="bg-[#FF8A4C] rounded-[32px] p-6 lg:p-10 shadow-xl relative mx-4 lg:mr-64"
                >
                  <div className="min-h-[220px] flex flex-col lg:flex-row items-center">
                    {/* Text Content */}
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                      className="flex flex-col items-center lg:items-start text-center lg:text-left w-full lg:max-w-[55%] mb-8 lg:mb-0"
                    >
                      <h1 className="text-3xl lg:text-5xl font-bold mb-4 text-white">
                        Hai aku G&apos;GON
                      </h1>
                      <p className="text-base lg:text-lg mb-8 leading-relaxed text-white">
                        Kedepannya aku akan membantu kamu untuk belajar dan mencari beasiswa
                      </p>
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-white hover:bg-gray-50 text-[#FF8A4C] px-6 lg:px-8 py-2 lg:py-3 rounded-full font-semibold transition-colors text-base lg:text-lg"
                      >
                        Ayo berinteraksi!
                      </motion.button>
                    </motion.div>

                    {/* Mascot Image */}
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, delay: 0.6 }}
                      className="w-[60%] lg:w-[50%] lg:absolute lg:right-3 lg:rotate-12"
                    >
                      <img 
                        src={GGon} 
                        alt="G'GON Mascot" 
                        className="w-full h-auto object-contain transform scale-90 lg:scale-110"
                      />
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Wave Section */}
          <section className="relative">
            <div className="w-full bg-[#FAB12F]">

              {/* Updated button container positioning and styling */}
              <div className="absolute left-1/2 -translate-x-1/2 top-[40%] z-10 flex flex-col items-center">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="text-white text-3xl font-bold mb-4"
                >
                  Pelajari Lebih Lanjut
                </motion.div>
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ 
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="hover:scale-110 transition-transform"
                >
                  <HiOutlineArrowCircleDown className="text-white text-5xl cursor-pointer" />
                </motion.div>
              </div>

              <svg
                viewBox="0 90 1450 700"
                className="translate-y-[1px] relative z-1"
                preserveAspectRatio="none"
              >
                {/* First wave - lighter orange */}
                <path
                  d="M0,100 
                     C960,50 1100,1100 1500,400 
                     L1500,1000 
                     L0,400 
                     Z"
                  fill="#F1A41A"
                  opacity="0.6"
                />
                
                {/* Second wave - darker orange */}
                <path
                  d="M0,190 
                     C800,80 1090,1150 1490,500 
                     L1450,1000  
                     L0 1000,400 
                     Z"
                  fill="#FA812F"
                />
              </svg>
            </div>
          </section>

          {/* Scholarship Section */}
          <section className="bg-[#FA812F] pt-0 pb-16 relative z-10">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-white text-3xl font-bold mb-3">Ayo cari beasiswa mu!</h2>
                <p className="text-white text-xl mb-8">Temukan beasiswa yang cocok untuk diri kamu!</p>
              </motion.div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto px-4 lg:px-0">
                {scholarships?.map((scholarship, index) => (
                  <motion.div
                    key={scholarship.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="relative rounded-[32px] shadow-lg hover:shadow-2xl transition-all cursor-pointer overflow-hidden group"
                    onClick={() => setSelectedScholarship(selectedScholarship?.title === scholarship.title ? null : scholarship)}
                  >
                    {/* Full poster image */}
                    <img 
                      src={scholarship.img}
                      alt={scholarship.title}
                      className="w-full h-full object-cover"
                    />

                    {/* Gradient overlay - only at bottom */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Content overlay - positioned at bottom left */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-2xl font-bold text-white mb-1 drop-shadow-lg">
                        {scholarship.title}
                      </h3>
                      <p className="text-white/90 font-medium mb-2 drop-shadow-lg">
                        {scholarship.org}
                      </p>
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="text-white hover:text-orange-200 text-sm font-semibold flex items-center gap-1 drop-shadow-lg"
                        >
                          Selengkapnya
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </motion.button>
                        <span className="text-white/80 text-sm font-medium drop-shadow-lg">
                          • Deadline: {scholarship.deadline}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Scholarship Details Section */}
              {selectedScholarship && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ 
                    opacity: selectedScholarship ? 1 : 0,
                    height: selectedScholarship ? 'auto' : 0
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden mt-8"
                >
                  <div className="bg-white rounded-2xl p-8 shadow-xl">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h3 className="text-2xl font-bold text-orange-800 mb-2">
                          {selectedScholarship.title}
                        </h3>
                        <p className="text-orange-600 font-medium">
                          {selectedScholarship.org}
                        </p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedScholarship(null)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </motion.button>
                    </div>

                    <p className="text-gray-700 mb-6 leading-relaxed">
                      {selectedScholarship.description}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="bg-orange-50 p-6 rounded-xl">
                        <h4 className="font-semibold text-orange-800 mb-3 flex items-center">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Persyaratan
                        </h4>
                        <ul className="space-y-2 text-gray-700">
                          {selectedScholarship.requirements?.map((req, index) => (
                            <li key={index} className="flex items-start">
                              <span className="mr-2">•</span>
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-orange-50 p-6 rounded-xl">
                        <h4 className="font-semibold text-orange-800 mb-3 flex items-center">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                          Benefits
                        </h4>
                        <ul className="space-y-2 text-gray-700">
                          {selectedScholarship.benefits?.map((benefit, index) => (
                            <li key={index} className="flex items-start">
                              <span className="mr-2">•</span>
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between pt-4 border-t border-gray-200">
                      <div className="mb-4 md:mb-0">
                        <p className="text-orange-800 font-semibold">
                          Deadline: <span className="text-gray-700">{selectedScholarship.deadline}</span>
                        </p>
                      </div>
                      <motion.a
                        href={selectedScholarship.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full font-semibold transition-colors"
                      >
                        Daftar Sekarang
                      </motion.a>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </section>

          {/* Innovation Section */}
          <section className="bg-[#FA812F] py-16 relative z-10">
            <div className="container mx-auto px-4">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-4xl font-bold text-white text-center mb-16"
              >
                Inovasi Kami
              </motion.h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                {/* Chat AI Card */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="bg-[#FAB12F] rounded-[32px] p-6 lg:p-8 relative overflow-visible group shadow-xl hover:shadow-2xl transition-all"
                >
                  <img 
                    src={GGon} 
                    alt="Chat AI"
                    className="absolute hidden lg:block pt-28 rotate-12 pl-12 right-0 w-48 h-auto transform translate-x-8 group-hover:scale-110 transition-transform duration-300 z-20"
                  />
                  <div className="relative z-10">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-3 bg-white/20 rounded-2xl">
                        <svg 
                          className="w-8 h-8 text-white" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                      </div>
                      <h3 className="text-3xl font-bold text-white">Chat AI</h3>
                    </div>
                    <p className="text-white/90 text-lg leading-relaxed mb-6">
                      Memudahkan siswa untuk melakukan tanya jawab dengan AI yang dapat membantu memberikan informasi seputar beasiswa
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleNavigate('/chat')}
                      className="px-6 py-2 bg-white text-[#FAB12F] rounded-full font-semibold hover:bg-orange-50 transition-colors"
                    >
                      Mulai Chat
                    </motion.button>
                  </div>
                  {/* Decorative elements */}
                  <div className="absolute top-4 right-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
                  <div className="absolute bottom-4 left-4 w-32 h-32 bg-white/10 rounded-full blur-xl" />
                </motion.div>

                {/* Pembelajaran Card */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="bg-[#FAB12F] rounded-[32px] p-8 relative overflow-hidden group shadow-xl hover:shadow-2xl transition-all"
                >
                  <img 
                    src={book} 
                    alt="Pembelajaran"
                    className="absolute top-28 right-0 w-48 h-auto transform translate-x-8 translate-y-4 group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="relative z-10">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-3 bg-white/20 rounded-2xl">
                        <svg 
                          className="w-8 h-8 text-white" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <h3 className="text-3xl font-bold text-white">Pembelajaran</h3>
                    </div>
                    <p className="text-white/90 text-lg leading-relaxed mb-6">
                      Siswa dapat belajar mandiri mengenai materi beasiswa dengan konten yang telah kami sediakan
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleNavigate('/courses')}
                      className="px-6 py-2 bg-white text-[#FAB12F] rounded-full font-semibold hover:bg-orange-50 transition-colors"
                    >
                      Mulai Belajar
                    </motion.button>
                  </div>
                  <div className="absolute top-4 right-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
                  <div className="absolute bottom-4 left-4 w-32 h-32 bg-white/10 rounded-full blur-xl" />
                </motion.div>

                {/* Komunitas Card */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="bg-[#FAB12F] rounded-[32px] p-8 relative overflow-hidden group shadow-xl hover:shadow-2xl transition-all"
                >
                  <div className="relative z-10">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-3 bg-white/20 rounded-2xl">
                        <svg 
                          className="w-8 h-8 text-white" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <h3 className="text-3xl font-bold text-white">Komunitas</h3>
                    </div>
                    <p className="text-white/90 text-lg leading-relaxed mb-6">
                      Siswa bisa saling berinteraksi dengan siswa lain untuk berbagi pengalaman dan informasi
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleNavigate('/community')}
                      className="px-6 py-2 bg-white text-[#FAB12F] rounded-full font-semibold hover:bg-orange-50 transition-colors"
                    >
                      Gabung Komunitas
                    </motion.button>
                  </div>
                  <img 
                    src={friends}
                    alt="Komunitas"
                    className="absolute bottom-0 right-0 w-48 h-auto transform translate-x-8 translate-y-4 group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
                  <div className="absolute bottom-4 left-4 w-32 h-32 bg-white/10 rounded-full blur-xl" />
                </motion.div>

                {/* Bantuan Card */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="bg-[#FAB12F] rounded-[32px] p-8 relative overflow-hidden group shadow-xl hover:shadow-2xl transition-all"
                >
                  <div className="relative z-10">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-3 bg-white/20 rounded-2xl">
                        <svg 
                          className="w-8 h-8 text-white" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-3xl font-bold text-white">Bantuan</h3>
                    </div>
                    <p className="text-white/90 text-lg leading-relaxed mb-6">
                      Beasiswa khusus untuk masyarakat kurang mampu dengan berbagai kemudahan
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleNavigate('/scholarships')}
                      className="px-6 py-2 bg-white text-[#FAB12F] rounded-full font-semibold hover:bg-orange-50 transition-colors"
                    >
                      Cari Bantuan
                    </motion.button>
                  </div>
                  <img 
                    src={money}
                    alt="Bantuan"
                    className="absolute bottom-0 right-0 w-48 h-auto transform translate-x-8 translate-y-4 group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
                  <div className="absolute bottom-4 left-4 w-32 h-32 bg-white/10 rounded-full blur-xl" />
                </motion.div>
              </div>
            </div>
          </section>

          {/* Landscape Section - Updated for better responsiveness */}
          <section className="relative bg-[#FA812F] pt-[200px] sm:pt-[300px] md:pt-[800px] lg:pt-[1500px] pb-16 sm:pb-32 md:pb-56 overflow-hidden">
            <div className="relative h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px]">
              {/* Mountain Background - Improved mobile scaling */}
              <div className="absolute bottom-0 left-0 right-0 z-0">
                <img 
                  src={kampongImg}
                  alt="Mountain Background"
                  className="w-full h-auto object-cover object-center transform scale-120 translate-y-1/5 md:translate-y-[30%] lg:translate-y-[40%]"
                />
              </div>

              {/* Bottom Wave - Adjusted for mobile */}
              <div className="absolute bottom-0 left-0 right-0 z-10">
                <svg
                  viewBox="0 80 1500 700"
                  className="translate-y-[150px] md:translate-y-[200px] lg:translate-y-[300px] w-full"
                  preserveAspectRatio="none"
                >
                  {/* First wave - lighter color */}
                  <path
                    d="M0,150 C960,50 1100,1100 1590,400 L1500,1500 L0,400 Z"
                    fill="#FFC298"
                    opacity="1"
                  />
                  
                  {/* Second wave - solid color */}
                  <path
                    d="M0,200 C900,80 1090,1150 1590,500 L1450,1500 L0,1000 Z"
                    fill="#FFFFFF"
                  />
                </svg>
              </div>
            </div>
          </section>

          {/* Forest Support Section - Enhanced mobile layout */}
          <section className="relative bg-white">
            <div className="relative w-full">
              {/* Forest Background with Responsive Height */}
              <motion.div 
                className="relative h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh]"
                style={{ y: forestImageY }}
              >
                <img 
                  src={hutanRimbaImg}
                  alt="Mountain Forest Landscape"
                  className="w-full h-full object-cover"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
              </motion.div>

              {/* Content Container - Improved mobile positioning */}
              <motion.div 
                className="absolute top-1/2 left-0 transform -translate-y-1/2 w-full px-4 sm:px-8 md:px-12 lg:px-24"
                style={{ opacity: textOpacity, y: textY }}
              >
                <div className="max-w-xl backdrop-blur-sm rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="space-y-6 md:space-y-8"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-2 md:p-3 bg-orange-500/20 rounded-xl">
                        <HiOutlineHeart className="w-6 h-6 md:w-8 md:h-8 text-orange-500" />
                      </div>
                      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                        Dukung Kami!
                      </h2>
                    </div>
                    
                    <p className="text-white/90 text-lg md:text-xl lg:text-2xl leading-relaxed">
                      Untuk membantu pendidikan pada daerah yang tertinggal dan membangun masa depan yang lebih baik.
                    </p>
                    
                    <div className="flex gap-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center justify-center space-x-2 bg-white text-gray-800 px-4 md:px-8 py-3 md:py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors shadow-lg text-sm md:text-base"
                      >
                        <HiOutlineUserGroup className="w-4 h-4 md:w-5 md:h-5" />
                        <span>Jadi Sukarelawan</span>
                      </motion.button>
                    </div>

                    {/* Stats - Improved mobile grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 pt-6 md:pt-8">
                      {/* Stats items with responsive text sizes */}
                      <motion.div 
                        className="text-center"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">500+</div>
                        <div className="text-white/80 text-sm md:text-base lg:text-lg">Sukarelawan</div>
                      </motion.div>
                      <motion.div 
                        className="text-center"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">50+</div>
                        <div className="text-white/80 text-sm md:text-base lg:text-lg">Daerah</div>
                      </motion.div>
                      <motion.div 
                        className="text-center col-span-2 md:col-span-1"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">1000+</div>
                        <div className="text-white/80 text-sm md:text-base lg:text-lg">Pelajar Terbantu</div>
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {/* Wave Separator - Adjusted height for mobile */}
            <div className="relative">
              <svg 
                viewBox="0 0 1440 120" 
                className="w-full h-[60px] md:h-auto fill-white"
                preserveAspectRatio="none"
              >
                <path d="M0,32L60,42.7C120,53,240,75,360,80C480,85,600,75,720,58.7C840,43,960,21,1080,16C1200,11,1320,21,1380,26.7L1440,32L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z" />
              </svg>
            </div>
          </section>
        </div>
      </div>

      {/* Footer Section - Enhanced mobile layout */}
      <footer className="bg-gradient-to-b from-white to-gray-50 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {/* Company Info - Improved mobile spacing */}
            <div className="space-y-4 md:space-y-6">
              <motion.img 
                whileHover={{ scale: 1.05 }}
                src={gencerdasLogo}
                alt="GenCerdas Logo"
                className="h-10 md:h-12 w-auto"
              />
              <p className="text-gray-600 text-sm leading-relaxed">
                Platform pembelajaran dan pencarian beasiswa yang membantu siswa Indonesia meraih pendidikan yang lebih baik.
              </p>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-gray-600">
                  <HiLocationMarker className="h-5 w-5 text-orange-500" />
                  <span className="text-sm">Jakarta, Indonesia</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-600">
                  <HiPhone className="h-5 w-5 text-orange-500" />
                  <span className="text-sm">+62 123 456 789</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-600">
                  <HiMail className="h-5 w-5 text-orange-500" />
                  <span className="text-sm">info@gencerdas.id</span>
                </div>
              </div>
            </div>

            {/* Quick Links - Mobile optimization */}
            <div className="mt-8 sm:mt-0">
              <h4 className="text-gray-900 font-semibold mb-4 md:mb-6">Perusahaan</h4>
              <ul className="space-y-4">
                <motion.li whileHover={{ x: 5 }} className="transition-colors">
                  <a href="#" className="text-gray-600 hover:text-orange-500 text-sm flex items-center space-x-2">
                    <span>→</span>
                    <span>Tentang Kami</span>
                  </a>
                </motion.li>
                <motion.li whileHover={{ x: 5 }} className="transition-colors">
                  <a href="#" className="text-gray-600 hover:text-orange-500 text-sm flex items-center space-x-2">
                    <span>→</span>
                    <span>Karir</span>
                  </a>
                </motion.li>
                <motion.li whileHover={{ x: 5 }} className="transition-colors">
                  <a href="#" className="text-gray-600 hover:text-orange-500 text-sm flex items-center space-x-2">
                    <span>→</span>
                    <span>Hubungi Kami</span>
                  </a>
                </motion.li>
              </ul>
            </div>

            {/* Resources - Mobile optimization */}
            <div className="mt-8 lg:mt-0">
              <h4 className="text-gray-900 font-semibold mb-4 md:mb-6">Sumber Daya</h4>
              <ul className="space-y-4">
                <motion.li whileHover={{ x: 5 }} className="transition-colors">
                  <a href="#" className="text-gray-600 hover:text-orange-500 text-sm flex items-center space-x-2">
                    <span>→</span>
                    <span>Blog</span>
                  </a>
                </motion.li>
                <motion.li whileHover={{ x: 5 }} className="transition-colors">
                  <a href="#" className="text-gray-600 hover:text-orange-500 text-sm flex items-center space-x-2">
                    <span>→</span>
                    <span>Panduan</span>
                  </a>
                </motion.li>
                <motion.li whileHover={{ x: 5 }} className="transition-colors">
                  <a href="#" className="text-gray-600 hover:text-orange-500 text-sm flex items-center space-x-2">
                    <span>→</span>
                    <span>FAQ</span>
                  </a>
                </motion.li>
              </ul>
            </div>

            {/* Newsletter - Mobile optimization */}
            <div className="mt-8 lg:mt-0">
              <h4 className="text-gray-900 font-semibold mb-4 md:mb-6">Berlangganan</h4>
              <p className="text-gray-600 text-sm mb-4">
                Dapatkan informasi terbaru tentang beasiswa dan pendidikan
              </p>
              <form className="space-y-3">
                <div className="relative">
                  <input 
                    type="email" 
                    placeholder="Email anda"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Berlangganan
                </motion.button>
              </form>
            </div>
          </div>

          {/* Divider - Adjusted spacing */}
          <div className="border-t border-gray-200 my-8 md:my-12"></div>

          {/* Bottom Bar - Improved mobile layout */}
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-600 text-xs md:text-sm text-center md:text-left">
              © 2024 GenCerdas. All rights reserved.
            </p>
            
            {/* Social Links - Better mobile spacing */}
            <div className="flex flex-wrap justify-center gap-3 md:gap-4">
              <motion.a 
                whileHover={{ y: -3 }}
                href="#" 
                className="bg-gray-100 p-2 rounded-full text-gray-600 hover:text-orange-500 hover:bg-orange-50 transition-colors"
              >
                <FaFacebookF className="h-5 w-5" />
              </motion.a>
              <motion.a 
                whileHover={{ y: -3 }}
                href="#" 
                className="bg-gray-100 p-2 rounded-full text-gray-600 hover:text-orange-500 hover:bg-orange-50 transition-colors"
              >
                <FaTwitter className="h-5 w-5" />
              </motion.a>
              <motion.a 
                whileHover={{ y: -3 }}
                href="#" 
                className="bg-gray-100 p-2 rounded-full text-gray-600 hover:text-orange-500 hover:bg-orange-50 transition-colors"
              >
                <FaInstagram className="h-5 w-5" />
              </motion.a>
              <motion.a 
                whileHover={{ y: -3 }}
                href="#" 
                className="bg-gray-100 p-2 rounded-full text-gray-600 hover:text-orange-500 hover:bg-orange-50 transition-colors"
              >
                <FaLinkedinIn className="h-5 w-5" />
              </motion.a>
              <motion.a 
                whileHover={{ y: -3 }}
                href="#" 
                className="bg-gray-100 p-2 rounded-full text-gray-600 hover:text-orange-500 hover:bg-orange-50 transition-colors"
              >
                <FaGithub className="h-5 w-5" />
              </motion.a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Homepage; 
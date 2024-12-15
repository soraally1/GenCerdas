import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { currentUser } = useAuth();

  // Enhanced scroll detection with throttling
  useEffect(() => {
    let timeoutId;
    
    const handleScroll = () => {
      if (timeoutId) return;
      
      timeoutId = setTimeout(() => {
        setIsScrolled(window.scrollY > 20);
        timeoutId = null;
      }, 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const isActive = (path) => location.pathname === path;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-4 pt-4 bg-transparent">
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`
          max-w-5xl mx-auto
          transition-all duration-300 ease-in-out
          ${isScrolled ? 'rounded-[24px] shadow-lg' : 'rounded-full'}
          overflow-hidden
          ${isScrolled 
            ? 'bg-[#FAB12F]/85 backdrop-blur-md' 
            : 'bg-transparent'
          }
          ${isMenuOpen && !isScrolled ? 'bg-[#FAB12F]' : ''}
        `}
      >
        <div className="px-4 py-3">
          <div className="flex justify-between items-center">
            {/* Logo with hover animation */}
            <Link to="/">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center"
              >
                <img 
                  src="/src/assets/gencerdaslog.png" 
                  alt="G'GON Logo" 
                  className="h-10 object-contain"
                />
              </motion.div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {[
                { path: '/ai-chat', label: 'G-Gon' },
                { path: '/komunitas', label: 'Komunitas' },
                { path: '/courses', label: 'Courses' },
              ].map((item) => (
                <Link 
                  key={item.path}
                  to={item.path}
                  className="relative group"
                >
                  <span className={`text-white font-medium transition-colors ${
                    isActive(item.path) ? 'text-orange-200' : 'hover:text-orange-200'
                  }`}>
                    {item.label}
                  </span>
                  <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full ${
                    isActive(item.path) ? 'w-full' : ''
                  }`} />
                </Link>
              ))}
              
              {/* Conditional Login/Profile Button */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {currentUser ? (
                  <Link 
                    to="/profile" 
                    className={`
                      px-6 py-2 rounded-full transition-all duration-300 font-semibold
                      flex items-center gap-2
                      ${isScrolled 
                        ? 'bg-white text-orange-500 hover:bg-orange-100 shadow-md hover:shadow-lg' 
                        : 'bg-[#FAB12F] text-white hover:bg-[#FAB12F]/90'
                      }
                    `}
                  >
                    <span>{currentUser.displayName || 'Profile'}</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </Link>
                ) : (
                  <Link 
                    to="/login" 
                    className={`
                      px-6 py-2 rounded-full transition-all duration-300 font-semibold
                      ${isScrolled 
                        ? 'bg-white text-orange-500 hover:bg-orange-100 shadow-md hover:shadow-lg' 
                        : 'bg-[#FAB12F] text-white hover:bg-[#FAB12F]/90'
                      }
                    `}
                  >
                    Login
                  </Link>
                )}
              </motion.div>
            </div>

            {/* Mobile Menu Button */}
            <motion.button 
              whileTap={{ scale: 0.95 }}
              className="md:hidden p-2 hover:bg-[#FAB12F]/50 rounded-full transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg 
                className="w-6 h-6 text-white" 
                fill="none" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </motion.button>
          </div>

          {/* Mobile Menu with Animation */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="md:hidden overflow-hidden"
              >
                <div className="py-4 border-t border-orange-400/30 space-y-4 mt-3">
                  {[
                    { path: '/ai-chat', label: 'G-Gon' },
                    { path: '/komunitas', label: 'Komunitas' },
                    { path: '/ruang-belajar', label: 'Ruang Belajar' },
                  ].map((item) => (
                    <motion.div
                      key={item.path}
                      whileHover={{ x: 4 }}
                      className="block"
                    >
                      <Link 
                        to={item.path}
                        className={`text-white font-medium transition-colors block py-2 ${
                          isActive(item.path) ? 'text-orange-200' : 'hover:text-orange-200'
                        }`}
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  ))}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {currentUser ? (
                      <Link 
                        to="/profile" 
                        className="bg-white text-orange-500 px-6 py-2 rounded-full hover:bg-orange-100 transition-colors inline-block text-center font-semibold w-full shadow-md flex items-center justify-center gap-2"
                      >
                        <span>{currentUser.displayName || 'Profile'}</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </Link>
                    ) : (
                      <Link 
                        to="/login" 
                        className="bg-white text-orange-500 px-6 py-2 rounded-full hover:bg-orange-100 transition-colors inline-block text-center font-semibold w-full shadow-md"
                      >
                        Login
                      </Link>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>
    </div>
  );
}

export default Navbar; 
import { Link, useLocation } from 'react-router-dom';
import { useState, useMemo, useCallback, memo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import { 
  HiOutlineUser,
  HiOutlineAcademicCap,
  HiOutlineBookOpen,
  HiOutlineDocument,
  HiOutlineStar,
  HiOutlineGift,
  HiOutlineHome
} from 'react-icons/hi';

const NavItem = memo(({ item, isActive, getLinkClass, getTooltipClass }) => {
  NavItem.displayName = 'NavItem';
  
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Link
        to={item.path}
        className={`group ${getLinkClass(item.path)}`}
      >
        <div className="relative z-10">
          {item.icon}
        </div>
        
        <motion.span 
          className={`hidden md:block ${getTooltipClass(item.path)}`}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
        >
          {item.label}
        </motion.span>
        
        {isActive && (
          <motion.div 
            layoutId="activeBackground"
            className="absolute inset-0 bg-white/20 rounded-2xl pointer-events-none"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
      </Link>
    </motion.div>
  );
});

NavItem.propTypes = {
  item: PropTypes.shape({
    path: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    icon: PropTypes.node.isRequired,
  }).isRequired,
  isActive: PropTypes.bool.isRequired,
  getLinkClass: PropTypes.func.isRequired,
  getTooltipClass: PropTypes.func.isRequired,
};

const ToggleButton = memo(({ isOpen, onClick }) => {
  ToggleButton.displayName = 'ToggleButton';
  
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className="fixed top-4 left-4 z-50 hidden md:flex items-center justify-center w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-lg"
    >
      <motion.svg
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="w-6 h-6 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d={isOpen ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
        />
      </motion.svg>
    </motion.button>
  );
});

ToggleButton.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

const themes = {
  light: {
    from: '[#FF9800]',
    to: '[#F57C00]',
    text: 'text-gray-800',
  },
  dark: {
    from: '[#2196F3]',
    to: '[#1976D2]',
    text: 'text-white',
  }
};

function Sidebar({ theme = 'light', initialIsOpen = true, onToggle = () => {} }) {
  const [sidebarOpen, setSidebarOpen] = useState(initialIsOpen);
  const location = useLocation();

  const currentTheme = themes[theme];

  const navItems = useMemo(() => [
    {
      path: '/',
      label: 'Home',
      icon: <HiOutlineHome className="w-6 h-6 text-white" />
    },
    {
      path: '/profile',
      label: 'Profile',
      icon: <HiOutlineUser className="w-6 h-6 text-white" />
    },
    {
      path: '/courses',
      label: 'Courses',
      icon: <HiOutlineAcademicCap className="w-6 h-6 text-white" />
    },
    {
      path: '/podcast',
      label: 'Podcast',
      icon: <HiOutlineBookOpen className="w-6 h-6 text-white" />
    },
    {
      path: '/document',
      label: 'Document',
      icon: <HiOutlineDocument className="w-6 h-6 text-white" />
    },
    {
      path: '/achievements',
      label: 'Achievements',
      icon: <HiOutlineStar className="w-6 h-6 text-white" />
    },
    {
      path: '/beasiswa',
      label: 'Beasiswa',
      icon: <HiOutlineGift className="w-6 h-6 text-white" />
    }
  ], []);

  const getLinkClass = useCallback((path) => {
    const baseClass = "relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-2xl transition-all duration-300";
    return `${baseClass} ${
      location.pathname === path 
        ? "bg-white/20 shadow-lg scale-110" 
        : "hover:bg-white/10 hover:scale-105"
    }`;
  }, [location.pathname]);

  const getTooltipClass = useCallback((path) => {
    return `absolute left-full ml-4 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-lg text-white text-sm font-medium
            opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300
            pointer-events-none whitespace-nowrap
            ${location.pathname === path ? 'bg-white/20' : ''}`;
  }, [location.pathname]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Escape') {
      setSidebarOpen(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    onToggle(sidebarOpen);
  }, [sidebarOpen, onToggle]);

  return (
    <>
      <ToggleButton 
        isOpen={sidebarOpen} 
        onClick={() => setSidebarOpen(!sidebarOpen)} 
      />

      <AnimatePresence mode="wait">
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ 
            x: sidebarOpen ? 0 : -100,
            opacity: sidebarOpen ? 1 : 0
          }}
          exit={{ x: -100, opacity: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 300,
            damping: 30,
            mass: 1
          }}
          className={`fixed bottom-0 left-0 md:top-0 w-full md:w-24 h-20 md:h-full 
                    bg-gradient-to-r md:bg-gradient-to-b from-${currentTheme.from} to-${currentTheme.to} ${currentTheme.text} 
                    backdrop-blur-lg z-40 border-t md:border-r border-white/10`}
        >
          <motion.nav 
            className="flex md:flex-col items-center justify-around md:justify-start h-full md:pt-20 md:space-y-6 px-4 md:px-0"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
          >
            {navItems.map((item) => (
              <motion.div
                key={item.path}
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: { opacity: 1, x: 0 }
                }}
              >
                <NavItem
                  item={item}
                  isActive={location.pathname === item.path}
                  getLinkClass={getLinkClass}
                  getTooltipClass={getTooltipClass}
                />
              </motion.div>
            ))}
          </motion.nav>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {!sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
            onClick={() => setSidebarOpen(true)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

Sidebar.propTypes = {
  theme: PropTypes.oneOf(['light', 'dark']),
  initialIsOpen: PropTypes.bool,
  onToggle: PropTypes.func,
};

export default Sidebar; 
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getGroups, joinGroup, checkGroupMembership } from '../services/communityService';
import { ref, onValue, off } from 'firebase/database';
import { database } from '../config/firebase';
import { initializeSampleGroups } from '../utils/initSampleGroups';

function Komunitas() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [joiningGroup, setJoiningGroup] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [groupMemberCounts, setGroupMemberCounts] = useState({});

  useEffect(() => {
    const loadGroups = async () => {
      try {
        setLoading(true);
        const fetchedGroups = await getGroups();
        setGroups(fetchedGroups);
      } catch (err) {
        console.error('Failed to load groups:', err);
        setError('Failed to load community groups');
      } finally {
        setLoading(false);
      }
    };

    loadGroups();
  }, []);

  useEffect(() => {
    const groupsRef = ref(database, 'groups');
    
    const listener = onValue(groupsRef, (snapshot) => {
      if (snapshot.exists()) {
        const groupData = snapshot.val();
        const counts = {};
        Object.entries(groupData).forEach(([id, data]) => {
          counts[id] = data.memberCount || 0;
        });
        setGroupMemberCounts(counts);
      }
    });

    return () => {
      // Cleanup subscription when component unmounts
      listener();
      off(groupsRef);
    };
  }, []);

  const categories = ['all', ...new Set(groups.map(group => group.category))];

  const filteredGroups = groups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         group.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || group.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleJoinGroup = async (group) => {
    if (!currentUser) {
      navigate('/login', { state: { from: '/komunitas' } });
      return;
    }

    try {
      setJoiningGroup(group.id);
      
      // Check if user is already a member
      const isMember = await checkGroupMembership(group.id, currentUser.uid);
      
      if (isMember) {
        // If already a member, just navigate to the group
        navigate(`/group/${group.id}`);
        return;
      }

      // If not a member, proceed with joining
      await joinGroup(group.id, currentUser.uid, {
        name: currentUser.displayName || 'Anonymous User',
        email: currentUser.email,
        avatar: currentUser.photoURL || '/default-avatar.png'
      });

      // Update the local groups state to reflect the new member count
      setGroups(prevGroups => 
        prevGroups.map(g => 
          g.id === group.id 
            ? { ...g, memberCount: (g.memberCount || 0) + 1 }
            : g
        )
      );

      navigate(`/group/${group.id}`);
    } catch (err) {
      console.error('Failed to join group:', err);
      setError('Failed to join group. Please try again.');
    } finally {
      setJoiningGroup(null);
    }
  };

  const handleInitializeSampleGroups = async () => {
    try {
      setLoading(true);
      await initializeSampleGroups();
      const fetchedGroups = await getGroups();
      setGroups(fetchedGroups);
    } catch (err) {
      console.error('Failed to initialize sample groups:', err);
      setError('Failed to initialize sample groups');
    } finally {
      setLoading(false);
    }
  };

  const renderGroupCard = (group) => (
    <div 
      key={group.id}
      className="bg-white/90 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 group transform hover:scale-[1.02]"
    >
      <div className="aspect-video relative overflow-hidden">
        <img 
          src={group.image} 
          alt={group.name}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-orange-600 rounded-full text-sm font-medium shadow-lg">
            {group.category}
          </span>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-orange-500 transition-colors">
          {group.name}
        </h3>
        <p className="text-gray-600 mb-6 line-clamp-2">
          {group.description}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 font-medium">
              {groupMemberCounts[group.id] || 0}
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-800">Members</span>
              <span className="text-xs text-gray-500">Active</span>
            </div>
          </div>
          <button
            onClick={() => handleJoinGroup(group)}
            disabled={joiningGroup === group.id}
            className="relative inline-flex items-center px-4 py-2 bg-orange-100 text-orange-600 rounded-full overflow-hidden transition-all hover:bg-orange-200 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {joiningGroup === group.id ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Joining...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Gabung
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  const renderFeaturedGroup = (featuredGroup) => (
    <div className="max-w-6xl mx-auto mb-16">
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/20 transform hover:scale-[1.01]">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3">
            <div className="aspect-video rounded-2xl overflow-hidden shadow-lg relative group">
              <img 
                src={featuredGroup.image}
                alt="Featured Group"
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </div>
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm font-medium">
                Featured Group
              </div>
              <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse"></div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">
              {featuredGroup.name}
            </h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              {featuredGroup.description}
            </p>
            <div className="flex items-center gap-6 pt-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 font-medium text-lg">
                  {groupMemberCounts[featuredGroup.id] || 0}
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-800 font-medium">Members</span>
                  <span className="text-sm text-gray-500">Active Community</span>
                </div>
              </div>
              <button
                onClick={() => handleJoinGroup(featuredGroup)}
                disabled={joiningGroup === featuredGroup.id}
                className="ml-auto group relative inline-flex items-center justify-center px-8 py-3 bg-orange-500 text-white rounded-full overflow-hidden transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
              >
                <div className="absolute inset-0 w-0 bg-orange-600 transition-all duration-300 ease-out group-hover:w-full"></div>
                <span className="relative flex items-center gap-2">
                  {joiningGroup === featuredGroup.id ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Joining...
                    </>
                  ) : (
                    <>
                      Gabung Sekarang
                      <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFB827] via-[#FF9636] to-[#FF8144] flex items-center justify-center p-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl text-center max-w-md">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-800 mb-4">{error}</p>
          <div className="space-y-2">
            <button
              onClick={() => window.location.reload()}
              className="w-full px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-all transform hover:scale-105"
            >
              Try Again
            </button>
            <button
              onClick={handleInitializeSampleGroups}
              className="w-full px-6 py-2 bg-gray-100 text-gray-800 rounded-full hover:bg-gray-200 transition-all transform hover:scale-105"
            >
              Initialize Sample Groups
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFB827] via-[#FF9636] to-[#FF8144] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute inset-0 bg-[url('/patterns/topography.svg')] opacity-10"></div>
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-lg mt-14">
            Komunitas Belajar
          </h1>
          <p className="text-white/90 max-w-2xl mx-auto text-lg mb-8">
            Bergabung dengan komunitas belajar, diskusi dengan teman-teman, dan berbagi pengalaman bersama.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!currentUser && (
              <button
                onClick={() => navigate('/login', { state: { from: '/komunitas' } })}
                className="group relative inline-flex items-center justify-center px-8 py-3 bg-white text-orange-500 rounded-full overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
              >
                <div className="absolute inset-0 w-3 bg-orange-500 transition-all duration-500 ease-out group-hover:w-full"></div>
                <span className="relative group-hover:text-white transition-colors duration-200 flex items-center gap-2">
                  Login untuk Bergabung
                  <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
            )}
            {groups.length === 0 && !loading && (
              <button
                onClick={handleInitializeSampleGroups}
                className="group relative inline-flex items-center justify-center px-8 py-3 bg-orange-500 text-white rounded-full overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
              >
                <div className="absolute inset-0 w-3 bg-white transition-all duration-500 ease-out group-hover:w-full"></div>
                <span className="relative group-hover:text-orange-500 transition-colors duration-200 flex items-center gap-2">
                  Initialize Sample Groups
                  <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Cari komunitas..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 pl-12 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                  />
                  <svg className="w-6 h-6 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              <div className="md:w-48">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all appearance-none bg-white"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Group */}
        {groups.find(g => g.type === 'featured') && (
          renderFeaturedGroup(groups.find(g => g.type === 'featured'))
        )}

        {/* Groups Grid */}
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white/90 animate-pulse rounded-xl overflow-hidden">
                  <div className="aspect-video bg-gray-200"></div>
                  <div className="p-6 space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredGroups.filter(g => g.type !== 'featured').length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto">
                <img src="/icons/empty-state.svg" alt="No results" className="w-32 h-32 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Communities Found</h3>
                <p className="text-gray-600">
                  We couldn&apos;t find any communities matching your search criteria. Try adjusting your filters or search terms.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGroups.filter(g => g.type !== 'featured').map((group) => (
                renderGroupCard(group)
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Komunitas;
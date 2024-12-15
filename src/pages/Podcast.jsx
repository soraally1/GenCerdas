import { useState, useEffect } from 'react';
import podcastService from '../services/podcastService';
import { Link } from 'react-router-dom';

function Podcast() {
  const [categories, setCategories] = useState([]);
  const [allPodcasts, setAllPodcasts] = useState([]);
  const [popularPodcasts, setPopularPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filteredPodcasts, setFilteredPodcasts] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      filterPodcastsByCategory(selectedCategory);
    } else {
      setFilteredPodcasts(allPodcasts);
    }
  }, [selectedCategory, allPodcasts]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [categoriesData, allPodcastsData, popularPodcastsData] = await Promise.all([
        podcastService.getCategories(),
        podcastService.getAllPodcasts(),
        podcastService.getPopularPodcasts()
      ]);

      setCategories(categoriesData);
      setAllPodcasts(allPodcastsData);
      setFilteredPodcasts(allPodcastsData);
      setPopularPodcasts(popularPodcastsData);
    } catch (err) {
      setError('Failed to fetch podcast data');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterPodcastsByCategory = (categoryId) => {
    const filtered = allPodcasts.filter(podcast => podcast.CategoryID === categoryId);
    setFilteredPodcasts(filtered);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFA726] to-[#FF9800] p-4 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFA726] to-[#FF9800] p-4 flex items-center justify-center">
        <div className="text-white text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFA726] to-[#FF9800] p-4">
      
      <div className="ml-0 md:ml-24">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 md:mb-8">Podcast</h1>

        <div className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 md:mb-8">Kategori</h1>
          <div className="flex flex-col gap-4 md:gap-6">
            {/* All Podcasts Card - Full Width */}
            <div
              onClick={() => setSelectedCategory(null)}
              className={`bg-[#FF7043] rounded-xl md:rounded-2xl p-4 md:p-8 cursor-pointer hover:bg-[#FF8A65] transition-all group relative overflow-hidden ${
                selectedCategory === null ? 'ring-4 ring-white' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-3xl font-bold text-white mb-2">All Podcast</h3>
                  <p className="text-white/80">Lihat semua podcast yang tersedia</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-all">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-bl-full -mr-20 -mt-20"></div>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-tl-full"></div>
            </div>

            {/* Category Cards - 2x2 Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              <div
                onClick={() => setSelectedCategory('1')}
                className={`bg-[#FF7043] rounded-2xl p-8 cursor-pointer hover:bg-[#FF8A65] transition-all group relative overflow-hidden ${
                  selectedCategory === '1' ? 'ring-4 ring-white' : ''
                }`}
              >
                <div className="flex flex-col h-full justify-between relative z-10">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">TOEFL</h3>
                    <p className="text-white/80 text-sm">Persiapan tes TOEFL</p>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full -mr-16 -mt-16"></div>
              </div>

              <div
                onClick={() => setSelectedCategory('2')}
                className={`bg-[#FF7043] rounded-2xl p-8 cursor-pointer hover:bg-[#FF8A65] transition-all group relative overflow-hidden ${
                  selectedCategory === '2' ? 'ring-4 ring-white' : ''
                }`}
              >
                <div className="flex flex-col h-full justify-between relative z-10">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Wawancara Beasiswa</h3>
                    <p className="text-white/80 text-sm">Tips interview beasiswa</p>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full -mr-16 -mt-16"></div>
              </div>

              <div
                onClick={() => setSelectedCategory('3')}
                className={`bg-[#FF7043] rounded-2xl p-8 cursor-pointer hover:bg-[#FF8A65] transition-all group relative overflow-hidden ${
                  selectedCategory === '3' ? 'ring-4 ring-white' : ''
                }`}
              >
                <div className="flex flex-col h-full justify-between relative z-10">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Strategi Beasiswa</h3>
                    <p className="text-white/80 text-sm">Panduan meraih beasiswa</p>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full -mr-16 -mt-16"></div>
              </div>

              <div
                onClick={() => setSelectedCategory('4')}
                className={`bg-[#FF7043] rounded-2xl p-8 cursor-pointer hover:bg-[#FF8A65] transition-all group relative overflow-hidden ${
                  selectedCategory === '4' ? 'ring-4 ring-white' : ''
                }`}
              >
                <div className="flex flex-col h-full justify-between relative z-10">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Pembelajaran Bahasa</h3>
                    <p className="text-white/80 text-sm">Tingkatkan kemampuan bahasa</p>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full -mr-16 -mt-16"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Filtered/All Podcasts */}
        <div className="mb-8 md:mb-12">
          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 md:mb-6">
            {selectedCategory ? 'Filtered Podcasts' : 'All Podcasts'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredPodcasts.map((podcast) => (
              <Link 
                key={podcast.id}
                to={`/podcast/${podcast.id}`}
                className="group relative rounded-xl md:rounded-2xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl bg-white/5 backdrop-blur-sm"
              >
                <div className="aspect-[4/3] relative">
                  {/* Image with shimmer loading effect */}
                  <div className="animate-pulse bg-gradient-to-r from-gray-200 to-gray-300 absolute inset-0" />
                  <img 
                    src={podcast.ImageURL} 
                    alt={podcast.Title}
                    className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                    onLoad={(e) => e.target.previousSibling.remove()}
                  />
                  
                  {/* Gradient overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                  <div className="absolute inset-0 bg-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Play button with enhanced hover effect */}
                  <button 
                    className="absolute bottom-2 md:bottom-4 right-2 md:right-4 w-10 h-10 md:w-14 md:h-14 bg-orange-500 rounded-full flex items-center justify-center text-white shadow-lg transform transition-all duration-300 hover:scale-110 hover:bg-orange-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle play logic if needed
                    }}
                  >
                    <svg className="w-5 h-5 md:w-7 md:h-7" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8 5v10l8-5-8-5z" />
                    </svg>
                  </button>

                  {/* Enhanced badges */}
                  <div className="absolute top-4 left-4 flex space-x-2">
                    <span className="bg-black/60 backdrop-blur-md text-white text-[10px] md:text-xs px-2 md:px-3 py-1 md:py-1.5 rounded-full font-medium flex items-center space-x-1
                                   transform transition-all duration-300 group-hover:translate-y-0 -translate-y-2 opacity-0 group-hover:opacity-100">
                      <svg className="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"/>
                      </svg>
                      {podcast.Duration || '20 min'}
                    </span>
                    <span className="bg-orange-500/80 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full font-medium
                                   transform transition-all duration-300 group-hover:translate-y-0 -translate-y-2 opacity-0 group-hover:opacity-100 delay-75">
                      {podcast.EpisodeCount || '1'} Episode
                    </span>
                  </div>
                </div>

                {/* Enhanced content section */}
                <div className="absolute bottom-0 left-0 right-0 p-3 md:p-6 bg-gradient-to-t from-black via-black/95 to-transparent">
                  <div className="space-y-2 md:space-y-3 transform transition-all duration-300 group-hover:translate-y-0 translate-y-2">
                    <h3 className="text-white font-bold text-base md:text-xl line-clamp-1 group-hover:text-orange-400 transition-colors">
                      {podcast.Title}
                    </h3>
                    <p className="text-white/80 text-xs md:text-sm line-clamp-2 font-medium leading-relaxed">
                      {podcast.Description}
                    </p>
                    
                    {/* Enhanced metadata */}
                    <div className="flex items-center justify-between pt-2 md:pt-3 border-t border-white/10">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center text-white/70 text-xs font-medium">
                          <svg className="w-4 h-4 mr-1.5 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"/>
                          </svg>
                          {podcast.PublishedDate || 'Jan 1, 2024'}
                        </div>
                        <div className="flex items-center text-white/70 text-xs font-medium">
                          <svg className="w-4 h-4 mr-1.5 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                          </svg>
                          {podcast.Views || '1.2k'} views
                        </div>
                      </div>
                      
                      {/* New category tag */}
                      <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-white/10 text-white/90">
                        {podcast.Category || 'Education'}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Popular Podcasts */}
        <div>
          <h2 className="text-2xl font-semibold text-white mb-6">Podcast populer</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {popularPodcasts.map((podcast) => (
              <div 
                key={podcast.id}
                className="group relative rounded-2xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
              >
                <div className="aspect-[4/3] relative">
                  <img 
                    src={podcast.ImageURL} 
                    alt={podcast.Title}
                    className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  
                  {/* Play button with hover effect */}
                  <button 
                    className="absolute bottom-4 right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center text-orange-500 shadow-lg transform transition-all duration-300 hover:scale-110 hover:bg-orange-500 hover:text-white"
                    onClick={() => window.location.href = `/podcast/${podcast.id}`}
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8 5v10l8-5-8-5z" />
                    </svg>
                  </button>

                  {/* Duration and Episode Count Badge */}
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <span className="bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                      {podcast.Duration || '20 min'}
                    </span>
                    <span className="bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                      {podcast.EpisodeCount || '1'} Episode
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent">
                  <div className="space-y-2">
                    <h3 className="text-white font-bold text-lg line-clamp-1 group-hover:text-orange-400 transition-colors">
                      {podcast.Title}
                    </h3>
                    <p className="text-white/80 text-sm line-clamp-2">
                      {podcast.Description}
                    </p>
                    
                    {/* Additional Info */}
                    <div className="flex items-center space-x-4 pt-2">
                      <div className="flex items-center text-white/60 text-xs">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"/>
                        </svg>
                        {podcast.PublishedDate || 'Jan 1, 2024'}
                      </div>
                      <div className="flex items-center text-white/60 text-xs">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                        </svg>
                        {podcast.Views || '1.2k'} views
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
export default Podcast;


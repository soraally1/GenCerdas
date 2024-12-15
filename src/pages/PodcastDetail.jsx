import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import podcastService from '../services/podcastService';
import { db } from '../config/firebase'; // Adjust the import based on your project structure
import { collection, addDoc } from 'firebase/firestore';
import logo from '../assets/G-Gon.png';

const getCategoryName = (categoryId) => {
  const categories = {
    '1': 'TOEFL',
    '2': 'Wawancara',
    '3': 'Strategi',
    '4': 'Bahasa'
  };
  return categories[categoryId] || 'Uncategorized';
};

const formatNumber = (num) => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

const formatDuration = (seconds) => {
  if (!seconds) return '5 min';
  const minutes = Math.floor(seconds / 60);
  return `${minutes} min`;
};

const formatDate = (timestamp) => {
  if (!timestamp) return 'Recently';
  const date = timestamp.toDate();
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(date);
};

export default function PodcastDetail() {
  const { id } = useParams();
  const [podcast, setPodcast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [soundUrl, setSoundUrl] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    const fetchPodcastData = async () => {
      try {
        setLoading(true);
        const [podcastData, soundUrl] = await Promise.all([
          podcastService.getPodcastById(id),
          podcastService.getPodcastAudio(id)
        ]);
        setPodcast(podcastData);
        setSoundUrl(soundUrl);
      } catch (err) {
        setError('Failed to fetch podcast details or audio URL not found');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPodcastData();
  }, [id]);

  const handlePlay = async () => {
    try {
      await podcastService.updatePlayCount(id);
    } catch (error) {
      console.error('Error updating play count:', error);
    }
  };

  const savePodcast = async () => {
    try {
      const docRef = await addDoc(collection(db, 'podcasts'), {
        title: 'Basic Japanese Conversation',
        description: 'A podcast episode about basic Japanese conversation.',
        soundCloudUrl: 'https://api.soundcloud.com/tracks/1984310395',
        author: {
          name: 'SoraStudio',
          photoURL: 'URL_to_author_photo'
        },
        createdAt: new Date().toISOString()
      });
      console.log('Document written with ID: ', docRef.id);
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#ff9553] to-[#ab1f1f] p-4 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#ff9553] to-[#ab1f1f] p-4 flex items-center justify-center">
        <div className="text-white text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ff9553] to-[#ab1f1f]">
      {podcast && (
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="flex flex-col md:flex-row gap-8 mb-12">
            {/* Podcast Cover */}
            <div className="w-full md:w-1/3">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src={podcast.ImageURL} 
                  alt={podcast.Title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>

            {/* Podcast Info */}
            <div className="w-full md:w-2/3 text-white">
              <div className="mb-4">
                <span className="text-white text-sm font-medium">
                  {getCategoryName(podcast.CategoryID)}
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">
                {podcast.Title}
              </h1>
              <p className="text-gray-400 text-xl mb-6">{podcast.subtitle}</p>
              
              {/* Author Info */}
              <div className="flex items-center gap-4 mb-6">
                <img 
                  src={logo} 
                  alt={podcast.author?.name}
                  className="w-12 h-12  border-orange-400"
                />
                <div>
                  <p className="text-white font-medium">{podcast.author?.name || 'GenCerdas Team'}</p>
                  <p className="text-white text-sm">Creator</p>
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-6 text-white">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                  </svg>
                  <span>{formatNumber(podcast.Played || 0)} plays</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"/>
                  </svg>
                  <span>{formatDuration(podcast.Duration)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"/>
                  </svg>
                  <span>{formatDate(podcast.CreatedAt)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Player Section */}
          {soundUrl && (
            <div className="bg-[#FF5733] rounded-xl p-6 mb-12 shadow-xl">
              <iframe
                width="100%"
                height="166"  
                scrolling="no"
                frameBorder="no"
                allow="autoplay"
                src={`https://w.soundcloud.com/player/?url=${soundUrl}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false`}
                className="rounded-lg"
              ></iframe>
            </div>
          )}

          {/* Description Section */}
          <div className="bg-[#FF5733] rounded-xl p-8 mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">About this episode</h2>
            <p className="text-white leading-relaxed whitespace-pre-line">
              {podcast.Description}
            </p>
          </div>

          {/* Episode Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              {
                title: 'Episode',
                value: `Episode ${podcast.EpisodeNumber || 'N/A'}`,
                icon: (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 100-12 6 6 0 000 12z"/>
                  </svg>
                )
              },
              {
                title: 'Duration',
                value: formatDuration(podcast.Duration),
                icon: (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"/>
                  </svg>
                )
              },
              {
                title: 'Category',
                value: getCategoryName(podcast.CategoryID),
                icon: (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/>
                  </svg>
                )
              }
            ].map((item, index) => (
              <div key={index} className="bg-[#FF5733] rounded-xl p-6 flex items-center gap-4">
                <div className="bg-orange-500 p-3 rounded-full text-white">
                  {item.icon}
                </div>
                <div>
                  <p className="text-white text-sm">{item.title}</p>
                  <p className="text-white font-semibold">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 
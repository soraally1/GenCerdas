import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

// Emoji categories with emojis
const emojiCategories = {
  smileys: ['😊', '😂', '🥰', '😎', '🤔', '😅', '😍', '🥺', '😭', '😤', '😴', '🤗', '😇', '🤩', '😋', '😜'],
  gestures: ['👋', '👍', '👎', '👏', '🙌', '🤝', '✌️', '🤞', '🤟', '🤙', '👌', '🫶', '❤️', '🔥', '✨', '💯'],
  animals: ['🐶', '🐱', '🦁', '🐯', '🐻', '🐨', '🐼', '🐸', '🐵', '🐔', '🐧', '🦄', '🦋', '🐙', '🦈', '🦖'],
  food: ['🍎', '🍕', '🍔', '🌮', '🍜', '🍣', '🍪', '🍩', '🍦', '🍫', '🍿', '🧃', '🥤', '🍷', '🍺', '🧋'],
};

function ChatInput({ onSendMessage, onTyping, isLoading, placeholder }) {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('smileys');
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);
  const emojiPickerRef = useRef(null);

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if ((message.trim() || previewImage) && !isLoading && !uploadingImage) {
      // Send both image and text together if both exist
      if (previewImage && message.trim()) {
        onSendMessage({
          type: 'mixed',
          content: {
            image: previewImage,
            text: message.trim()
          }
        });
        setPreviewImage(null);
        setMessage('');
      } else if (previewImage) {
        onSendMessage({
          type: 'image',
          content: previewImage
        });
        setPreviewImage(null);
      } else if (message.trim()) {
        onSendMessage({
          type: 'text',
          content: message.trim()
        });
        setMessage('');
      }
      setShowEmojiPicker(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
    onTyping();
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      alert('Please upload only image files.');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Please upload images smaller than 5MB.');
      return;
    }

    try {
      setUploadingImage(true);
      
      // Convert image to base64 URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setUploadingImage(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadingImage(false);
      alert('Failed to upload image. Please try again.');
    }
  };

  const cancelImageUpload = () => {
    setPreviewImage(null);
    fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-3">
      {/* Image Preview with Caption */}
      {previewImage && (
        <div className="flex items-start gap-4">
          <div className="relative w-32 h-32 group flex-shrink-0">
            <img 
              src={previewImage} 
              alt="Preview" 
              className="w-full h-full object-cover rounded-lg border-2 border-orange-500"
            />
            <button
              onClick={cancelImageUpload}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
              title="Remove image"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-1">
            <div className="text-sm text-gray-500 mb-1">
              Add a caption to your image (optional)
            </div>
          </div>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className={`p-2 hover:bg-gray-100 rounded-full transition-all text-gray-600 hover:text-orange-500 ${showEmojiPicker ? 'bg-orange-50 text-orange-500' : ''}`}
              title="Add emoji"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>

            {/* Enhanced Emoji Picker */}
            {showEmojiPicker && (
              <div 
                ref={emojiPickerRef}
                className="absolute bottom-full left-0 mb-2 bg-white rounded-xl shadow-xl border p-3 w-72 z-50 animate-fadeIn"
              >
                {/* Category Tabs */}
                <div className="flex gap-2 mb-3 pb-2 border-b overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  <button
                    type="button"
                    onClick={() => setSelectedCategory('smileys')}
                    className={`p-2 rounded-lg transition-colors ${selectedCategory === 'smileys' ? 'bg-orange-100 text-orange-500' : 'hover:bg-gray-100'}`}
                    title="Smileys"
                  >
                    😊
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedCategory('gestures')}
                    className={`p-2 rounded-lg transition-colors ${selectedCategory === 'gestures' ? 'bg-orange-100 text-orange-500' : 'hover:bg-gray-100'}`}
                    title="Gestures"
                  >
                    👋
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedCategory('animals')}
                    className={`p-2 rounded-lg transition-colors ${selectedCategory === 'animals' ? 'bg-orange-100 text-orange-500' : 'hover:bg-gray-100'}`}
                    title="Animals"
                  >
                    🐶
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedCategory('food')}
                    className={`p-2 rounded-lg transition-colors ${selectedCategory === 'food' ? 'bg-orange-100 text-orange-500' : 'hover:bg-gray-100'}`}
                    title="Food"
                  >
                    🍕
                  </button>
                </div>

                {/* Emoji Grid */}
                <div className="grid grid-cols-8 gap-1 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  {emojiCategories[selectedCategory].map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => {
                        setMessage(prev => prev + emoji);
                      }}
                      className="p-1 hover:bg-orange-50 rounded transition-all text-xl"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Image Upload Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`p-2 hover:bg-gray-100 rounded-full transition-all text-gray-600 hover:text-orange-500 relative ${previewImage ? 'bg-orange-50 text-orange-500' : ''}`}
              title="Attach image"
              disabled={uploadingImage}
            >
              {uploadingImage ? (
                <svg className="w-6 h-6 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              )}
            </button>
          </div>

          <input
            type="text"
            value={message}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            placeholder={previewImage ? "Add a caption..." : (placeholder || "Type a message...")}
            className="flex-1 px-4 py-2 rounded-full border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
            disabled={isLoading || uploadingImage}
          />
          <button
            type="submit"
            disabled={(!message.trim() && !previewImage) || isLoading || uploadingImage}
            className="p-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110 active:scale-95"
            title="Send message"
          >
            {isLoading || uploadingImage ? (
              <svg className="w-6 h-6 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={uploadingImage}
        />
      </form>
    </div>
  );
}

ChatInput.propTypes = {
  onSendMessage: PropTypes.func.isRequired,
  onTyping: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  placeholder: PropTypes.string
};

export default ChatInput; 
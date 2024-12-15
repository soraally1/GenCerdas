import PropTypes from 'prop-types';
import DragonMascot from '../../assets/g-gon.png';

function ChatMessage({ message, isLatest, displayedContent }) {
  const content = isLatest ? displayedContent : message.content;
  const timestamp = message.timestamp 
    ? new Date(message.timestamp).toLocaleTimeString()
    : new Date().toLocaleTimeString();
  
  return (
    <div 
      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn transition-all duration-300 ease-in-out`}
      role="listitem"
    >
      {message.type === 'ai' && (
        <div className="w-10 h-10 mr-3 flex-shrink-0 animate-bounce-slow">
          <img 
            src={DragonMascot} 
            alt="AI Assistant"
            className="w-full h-full object-contain rounded-full shadow-lg hover:scale-110 transition-transform duration-300 ring-2 ring-orange-300"
          />
        </div>
      )}
      <div className="flex flex-col max-w-[80%]">
        <div 
          className={`rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 ${
            message.type === 'user' 
              ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-tr-none hover:scale-[1.02]' 
              : message.isError
                ? 'bg-red-50 text-red-600 rounded-tl-none hover:bg-red-100'
                : 'bg-white text-gray-800 rounded-tl-none hover:bg-gray-50 hover:scale-[1.02]'
          }`}
        >
          <p className="text-sm md:text-base whitespace-pre-line leading-relaxed">
            {content.split('\n').map((text, i, arr) => (
              <span key={`${i}-${text.slice(0, 10)}`} className="transition-all duration-200">
                {text.startsWith('-') || text.startsWith('•') 
                  ? <span className="block ml-4 my-1 hover:ml-6 transition-all duration-200">{text}</span>
                  : text}
                {i < arr.length - 1 && <br/>}
              </span>
            ))}
          </p>
        </div>
        <span className={`text-xs text-gray-600 mt-2 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
          {timestamp}
        </span>
      </div>
    </div>
  );
}

ChatMessage.propTypes = {
  message: PropTypes.shape({
    type: PropTypes.oneOf(['user', 'ai']).isRequired,
    content: PropTypes.string.isRequired,
    timestamp: PropTypes.string,
    isError: PropTypes.bool
  }).isRequired,
  isLatest: PropTypes.bool.isRequired,
  displayedContent: PropTypes.string.isRequired
};

export default ChatMessage; 
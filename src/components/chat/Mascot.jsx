import PropTypes from 'prop-types';

function Mascot({ isAiTalking, IdleAnimation, TalkAnimation }) {
  return (
    <div className="relative w-full h-full">
      {/* Layered Background Effects */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Outer Glow */}
        <div className="absolute w-[95%] h-[95%] bg-gradient-radial from-orange-300/30 via-orange-200/10 to-transparent rounded-full blur-2xl animate-pulse-slow" />
        
        {/* Inner Glow */}
        <div className="absolute w-[80%] h-[80%] bg-gradient-radial from-orange-400/20 via-orange-300/5 to-transparent rounded-full blur-xl animate-pulse-slow delay-150" />
        
        {/* Animated Rings */}
        <div className="absolute w-[90%] h-[90%] border-2 border-orange-300/20 rounded-full animate-ping-slow" />
        <div className="absolute w-[85%] h-[85%] border-2 border-orange-300/15 rounded-full animate-ping-slow delay-300" />
      </div>

      {/* Mascot Shadow - Improved */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-6">
        <div className="w-full h-full bg-black/15 rounded-full blur-xl transform scale-y-50" />
      </div>
      
      {/* Mascot Container */}
      <div className="relative w-full h-full p-6">
        <div className="relative w-full h-full">
          {/* Particle Effects */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`absolute w-2 h-2 bg-orange-300/30 rounded-full
                  animate-float-particle transform
                  ${i % 2 === 0 ? 'animate-spin-slow' : 'animate-reverse-spin-slow'}
                  ${i % 3 === 0 ? 'scale-150' : 'scale-75'}`}
                style={{
                  left: `${20 + (i * 15)}%`,
                  top: `${10 + (i * 20)}%`,
                  animationDelay: `${i * 0.5}s`
                }}
              />
            ))}
          </div>

          {/* Video Elements */}
          {[
            { src: TalkAnimation, isVisible: isAiTalking },
            { src: IdleAnimation, isVisible: !isAiTalking }
          ].map((animation, index) => (
            <video
              key={index}
              autoPlay
              loop
              muted
              playsInline
              className={`absolute inset-0 w-full h-full object-contain transition-all duration-500 ease-in-out mix-blend-normal 
                ${animation.isVisible ? 'opacity-100 visible scale-100' : 'opacity-0 invisible scale-95'}
                [&::-webkit-media-controls]:hidden
                outline-none border-none`}
              style={{
                WebkitMaskImage: '-webkit-radial-gradient(white, black)',
                maskImage: 'radial-gradient(white, black)'
              }}
            >
              <source src={animation.src} type="video/mp4" />
            </video>
          ))}
          
          {/* Status Indicator - Enhanced */}
          <div className="absolute top-4 right-4 flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-orange-100/50">
            <div className="relative">
              <div className={`w-3 h-3 rounded-full ${isAiTalking ? 'bg-green-500' : 'bg-gray-400'}`} />
              {isAiTalking && (
                <div className="absolute inset-0 w-3 h-3 rounded-full bg-green-500 animate-ping" />
              )}
            </div>
            <span className="text-sm font-medium text-gray-700">
              {isAiTalking ? 'Speaking' : 'Listening'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

Mascot.propTypes = {
  isAiTalking: PropTypes.bool.isRequired,
  IdleAnimation: PropTypes.string.isRequired,
  TalkAnimation: PropTypes.string.isRequired
};

export default Mascot; 
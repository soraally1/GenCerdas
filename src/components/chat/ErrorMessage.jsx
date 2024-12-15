import PropTypes from 'prop-types';

function ErrorMessage({ message }) {
  return (
    <div className="flex items-center p-4 bg-red-50 rounded-2xl shadow-lg w-fit animate-fadeIn">
      <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span className="text-red-600">{message}</span>
    </div>
  );
}

ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired
};

export default ErrorMessage; 
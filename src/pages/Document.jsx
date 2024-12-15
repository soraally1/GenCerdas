import { useState } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { FaUpload, FaIdCard, FaBabyCarriage, FaGraduationCap, FaTrophy, FaCreditCard, FaExclamationTriangle, FaPaperPlane } from 'react-icons/fa';
import { DocumentService, DOCUMENT_TYPES } from '../services/documentService';

// ProgressBar Component
const ProgressBar = ({ progress }) => {
  return (
    <div className="w-full bg-orange-200 rounded-full h-4 mt-8">
      <motion.div 
        className="bg-orange-500 h-4 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5 }}
      />
    </div>
  );
};

ProgressBar.propTypes = {
  progress: PropTypes.number.isRequired
};

// UploadCard Component with file input
const UploadCard = ({ title, icon, type, onFileUpload, uploadedFile, fullWidth }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      // Create a temporary URL for the file
      const url = URL.createObjectURL(file);
      await onFileUpload(type, url, file.name);
    } catch (error) {
      setUploadError(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <motion.div
      className={`rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 p-6 ${fullWidth ? 'col-span-full' : ''} relative overflow-hidden shadow-lg`}
      whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="text-white relative z-10">
        <div className="flex items-center mb-4">
          <div className="text-4xl mr-4 bg-orange-400 p-3 rounded-full">{icon}</div>
          <div>
            <p className="text-sm font-medium opacity-80">Upload dokumen</p>
            <h3 className="text-2xl font-bold">{title}</h3>
          </div>
        </div>
        
        <input 
          type="file" 
          accept=".pdf,.jpg,.jpeg,.png" 
          onChange={handleFileChange} 
          className="hidden" 
          id={`file-upload-${type}`}
          disabled={isUploading}
        />
        
        <label 
          htmlFor={`file-upload-${type}`}
          className={`bg-amber-300 text-orange-700 rounded-lg px-4 py-2 text-sm font-semibold 
            hover:bg-amber-400 transition-colors flex items-center shadow-md cursor-pointer
            ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <FaUpload className="mr-2" />
          {isUploading ? 'Uploading...' : uploadedFile?.fileName || 'Upload'}
        </label>

        {uploadError && (
          <p className="mt-2 text-red-200 text-sm">{uploadError}</p>
        )}

        {uploadedFile?.url && (
          <div className="mt-2">
            <p className="text-sm opacity-80 truncate">
              File: {uploadedFile.fileName}
            </p>
            <a 
              href={uploadedFile.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-amber-300 hover:text-amber-400 text-sm underline"
            >
              View Document
            </a>
          </div>
        )}
      </div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-orange-400 rounded-bl-full opacity-30"></div>
    </motion.div>
  );
};

// PropTypes validation for UploadCard
UploadCard.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.element.isRequired,
  type: PropTypes.string.isRequired,
  onFileUpload: PropTypes.func.isRequired,
  uploadedFile: PropTypes.shape({
    url: PropTypes.string,
    fileName: PropTypes.string
  }),
  fullWidth: PropTypes.bool
};

// Default props for optional parameters
UploadCard.defaultProps = {
  uploadedFile: null,
  fullWidth: false
};

// Rest of the component remains the same (DocumentUpload component)
const DocumentUpload = () => {
  const [documents, setDocuments] = useState({});
  const [progress, setProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleFileUpload = async (type, url, fileName) => {
    try {
      const result = await DocumentService.uploadDocument(url, type, fileName);
      setDocuments(prev => ({
        ...prev,
        [type]: {
          url: url,
          fileName: fileName,
          id: result.id
        }
      }));
      setError(null);
    } catch (error) {
      setError(`Failed to upload ${type}: ${error.message}`);
      console.error('Upload error:', error);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);
    setProgress(0);

    try {
      // Check if required documents are present
      const requiredDocs = [
        DOCUMENT_TYPES.KARTU_KELUARGA,
        DOCUMENT_TYPES.AKTA_KELAHIRAN,
        DOCUMENT_TYPES.IJAZAH
      ];
      
      if (!requiredDocs.every(type => documents[type]?.url)) {
        setError('Please upload required documents (Kartu Keluarga, Akta Kelahiran, Ijazah)');
        return;
      }

      // Prepare documents for upload
      const docsToUpload = {};
      Object.entries(documents).forEach(([type, doc]) => {
        if (doc?.url) {
          docsToUpload[type] = {
            url: doc.url,
            fileName: doc.fileName
          };
        }
      });

      // Upload documents with progress updates
      setProgress(20);
      await DocumentService.uploadDocuments(docsToUpload);
      setProgress(100);

      // Success state
      setSuccess(true);
      
      // Clear form
      setDocuments({});

    } catch (err) {
      setError(err.message || 'Upload failed. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-400 to-amber-500 p-6">
      <div className="max-w-4xl mx-auto space-y-6 pt-20">
        <motion.h1 
          className="text-4xl font-bold text-white text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Upload Dokumen
        </motion.h1>
        
        {/* Progress Bar */}
        <ProgressBar progress={progress} />
        
        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">Documents uploaded successfully!</span>
          </div>
        )}
        
        {/* Grid for upload cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <UploadCard 
            title="Kartu Keluarga" 
            icon={<FaIdCard />} 
            type={DOCUMENT_TYPES.KARTU_KELUARGA}
            onFileUpload={handleFileUpload}
            uploadedFile={{
              url: documents[DOCUMENT_TYPES.KARTU_KELUARGA]?.url,
              fileName: documents[DOCUMENT_TYPES.KARTU_KELUARGA]?.fileName
            }}
          />
          <UploadCard 
            title="Akta Kelahiran" 
            icon={<FaBabyCarriage />} 
            type={DOCUMENT_TYPES.AKTA_KELAHIRAN}
            onFileUpload={handleFileUpload}
            uploadedFile={{
              url: documents[DOCUMENT_TYPES.AKTA_KELAHIRAN]?.url,
              fileName: documents[DOCUMENT_TYPES.AKTA_KELAHIRAN]?.fileName
            }}
          />
          <UploadCard 
            title="Ijazah" 
            icon={<FaGraduationCap />} 
            type={DOCUMENT_TYPES.IJAZAH}
            onFileUpload={handleFileUpload}
            uploadedFile={{
              url: documents[DOCUMENT_TYPES.IJAZAH]?.url,
              fileName: documents[DOCUMENT_TYPES.IJAZAH]?.fileName
            }}
          />
          <UploadCard 
            title="Piagam" 
            icon={<FaTrophy />} 
            type={DOCUMENT_TYPES.PIAGAM}
            onFileUpload={handleFileUpload}
            uploadedFile={{
              url: documents[DOCUMENT_TYPES.PIAGAM]?.url,
              fileName: documents[DOCUMENT_TYPES.PIAGAM]?.fileName
            }}
          />
        </motion.div>

        {/* KIP Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <UploadCard 
            title="KIP" 
            icon={<FaCreditCard />} 
            type={DOCUMENT_TYPES.KIP}
            onFileUpload={handleFileUpload}
            uploadedFile={{
              url: documents[DOCUMENT_TYPES.KIP]?.url,
              fileName: documents[DOCUMENT_TYPES.KIP]?.fileName
            }}
            fullWidth 
          />
        </motion.div>

        {/* Attention Section */}
        <motion.div 
          className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl p-6 text-white relative overflow-hidden shadow-lg"
          whileHover={{ scale: 1.01 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative z-10">
            <div className="space-y-4">
              <div className="flex items-center">
                <FaExclamationTriangle className="text-3xl mr-3 text-amber-300" />
                <h2 className="text-3xl font-bold">Perhatian!</h2>
              </div>
              <p className="max-w-md text-lg">
                Jika tidak memiliki KIP atau piagam bisa diskip terlebih dahulu ya teman-teman
              </p>
              <motion.button
                className={`bg-amber-300 text-orange-700 rounded-lg px-8 py-3 text-lg font-semibold hover:bg-amber-400 transition-colors flex items-center shadow-md ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                <FaPaperPlane className="mr-2" />
                {isSubmitting ? 'Mengirim...' : 'Kirim'}
              </motion.button>
            </div>
            <div className="hidden md:block">
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute bottom-0 left-0 opacity-20 pointer-events-none">
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="10" y="60" width="8" height="50" fill="currentColor" transform="rotate(-15)" />
              <rect x="30" y="65" width="8" height="45" fill="currentColor" transform="rotate(-5)" />
              <rect x="50" y="60" width="8" height="50" fill="currentColor" transform="rotate(10)" />
              <rect x="70" y="55" width="8" height="55" fill="currentColor" transform="rotate(-8)" />
            </svg>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DocumentUpload;
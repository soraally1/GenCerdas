import { useState } from 'react';
import { uploadQuizData } from '../utils/uploadQuizData';
import { initializeGroups } from '../services/initializeGroups';

function AdminDashboard() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [isInitializingGroups, setIsInitializingGroups] = useState(false);
  const [groupStatus, setGroupStatus] = useState('');

  const handleUploadData = async () => {
    try {
      setIsUploading(true);
      setUploadStatus('Uploading data...');
      await uploadQuizData();
      setUploadStatus('Data uploaded successfully!');
    } catch (error) {
      console.error('Error uploading data:', error);
      setUploadStatus('Error uploading data. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleInitializeGroups = async () => {
    try {
      setIsInitializingGroups(true);
      setGroupStatus('Initializing community groups...');
      await initializeGroups();
      setGroupStatus('Community groups initialized successfully!');
    } catch (error) {
      console.error('Error initializing groups:', error);
      setGroupStatus('Error initializing groups. Please try again.');
    } finally {
      setIsInitializingGroups(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Admin Dashboard
          </h1>
          
          <div className="space-y-8">
            {/* Quiz Data Management Section */}
            <div className="border-b pb-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                Quiz Data Management
              </h2>
              <button
                onClick={handleUploadData}
                disabled={isUploading}
                className={`${
                  isUploading 
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                } text-white px-4 py-2 rounded-md transition-colors duration-200`}
              >
                {isUploading ? 'Uploading...' : 'Upload Quiz Data to Firestore'}
              </button>
              
              {uploadStatus && (
                <p className={`mt-2 text-sm ${
                  uploadStatus.includes('successfully')
                    ? 'text-green-600'
                    : uploadStatus.includes('Error')
                    ? 'text-red-600'
                    : 'text-blue-600'
                }`}>
                  {uploadStatus}
                </p>
              )}
            </div>

            {/* Community Groups Management Section */}
            <div className="border-b pb-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                Community Groups Management
              </h2>
              <button
                onClick={handleInitializeGroups}
                disabled={isInitializingGroups}
                className={`${
                  isInitializingGroups 
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-orange-500 hover:bg-orange-600'
                } text-white px-4 py-2 rounded-md transition-colors duration-200`}
              >
                {isInitializingGroups ? 'Initializing...' : 'Initialize Community Groups'}
              </button>
              
              {groupStatus && (
                <p className={`mt-2 text-sm ${
                  groupStatus.includes('successfully')
                    ? 'text-green-600'
                    : groupStatus.includes('Error')
                    ? 'text-red-600'
                    : 'text-blue-600'
                }`}>
                  {groupStatus}
                </p>
              )}

              <div className="mt-4">
                <h3 className="text-md font-medium text-gray-700 mb-2">
                  Groups to be initialized:
                </h3>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Beasiswa Discussion Hub (Featured Group)</li>
                  <li>Tips & Trik Beasiswa</li>
                  <li>Study Abroad Community</li>
                  <li>Research Collaboration</li>
                  <li>Campus Life Stories</li>
                </ul>
              </div>
            </div>

            {/* Instructions Section */}
            <div className="mt-6">
              <h3 className="text-md font-medium text-gray-700 mb-2">
                Instructions:
              </h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Use the buttons above to manage application data</li>
                <li>Quiz data upload will update the quiz content in Firestore</li>
                <li>Group initialization will create community groups in Realtime Database</li>
                <li>Wait for confirmation messages before leaving the page</li>
                <li>These actions will overwrite existing data</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard; 
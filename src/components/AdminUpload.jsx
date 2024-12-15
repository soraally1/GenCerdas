import { uploadQuizData } from '../utils/uploadQuizData';

function AdminUpload() {
  const handleUpload = async () => {
    await uploadQuizData();
  };

  return (
    <div>
      <button 
        onClick={handleUpload}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Upload Quiz Data to Firestore
      </button>
    </div>
  );
}

export default AdminUpload;

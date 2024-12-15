import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc, query, where, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';

// Get Firebase instances
const auth = getAuth();
const db = getFirestore();

// Document upload types
const DOCUMENT_TYPES = {
  KARTU_KELUARGA: 'kartu_keluarga',
  AKTA_KELAHIRAN: 'akta_kelahiran',
  IJAZAH: 'ijazah',
  PIAGAM: 'piagam',
  KIP: 'kip'
};

// Document service class
class DocumentService {
  // Upload single document
  static async uploadDocument(url, documentType, fileName) {
    try {
      const user = auth.currentUser;
      
      if (!user) {
        throw new Error('User must be authenticated to upload documents');
      }

      // Save metadata to Firestore
      const documentData = {
        userId: user.uid,
        type: documentType,
        url: url,
        fileName: fileName,
        createdAt: new Date().toISOString(),
        status: 'submitted'
      };

      const docRef = await addDoc(collection(db, 'documents'), documentData);
      return { id: docRef.id, url: url };
    } catch (error) {
      console.error(`Upload error for ${documentType}:`, error);
      throw error;
    }
  }

  // Upload multiple documents
  static async uploadDocuments(documents) {
    try {
      const user = auth.currentUser;
      
      if (!user) {
        throw new Error('User must be authenticated to upload documents');
      }

      const uploadPromises = Object.entries(documents)
        .filter(([, doc]) => doc && doc.url && doc.fileName)
        .map(([type, doc]) => this.uploadDocument(doc.url, type, doc.fileName));

      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Documents upload failed:', error);
      throw error;
    }
  }

  // Delete a specific document
  static async deleteDocument(documentId) {
    try {
      const docRef = doc(db, 'documents', documentId);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error('Document deletion error:', error);
      throw error;
    }
  }

  // Retrieve user documents
  static async getUserDocuments() {
    try {
      const user = auth.currentUser;
      
      if (!user) {
        throw new Error('User must be authenticated to view documents');
      }

      const q = query(
        collection(db, 'documents'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const documents = [];
      
      querySnapshot.forEach((doc) => {
        documents.push({
          id: doc.id,
          ...doc.data()
        });
      });

      return documents;
    } catch (error) {
      console.error('Error fetching user documents:', error);
      throw error;
    }
  }

  // Get documents by type
  static async getDocumentsByType(documentType) {
    try {
      const user = auth.currentUser;
      
      if (!user) {
        throw new Error('User must be authenticated to view documents');
      }

      const q = query(
        collection(db, 'documents'),
        where('userId', '==', user.uid),
        where('type', '==', documentType),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const documents = [];
      
      querySnapshot.forEach((doc) => {
        documents.push({
          id: doc.id,
          ...doc.data()
        });
      });

      return documents;
    } catch (error) {
      console.error(`Error fetching ${documentType} documents:`, error);
      throw error;
    }
  }
}

export { 
  DocumentService, 
  DOCUMENT_TYPES 
};
import { storage, db } from "./firebase";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";

// ==================== FUNCIONES PARA STORAGE ====================

// Subir archivo a Storage
export const uploadFile = async (
  file: File,
  path: string
): Promise<string> => {
  try {
    const fileRef = ref(storage, path);
    await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(fileRef);
    return downloadURL;
  } catch (error) {
    console.error("Error subiendo archivo:", error);
    throw error;
  }
};

// Eliminar archivo de Storage
export const deleteFile = async (filePath: string): Promise<void> => {
  try {
    const fileRef = ref(storage, filePath);
    await deleteObject(fileRef);
  } catch (error) {
    console.error("Error eliminando archivo:", error);
    throw error;
  }
};

// ==================== FUNCIONES PARA FIRESTORE ====================

// Agregar documento a Firestore
export const addDocument = async (
  collectionName: string,
  data: Record<string, any>
): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error agregando documento:", error);
    throw error;
  }
};

// Obtener todos los documentos de una colección
export const getDocuments = async (
  collectionName: string
): Promise<Record<string, any>[]> => {
  try {
    const snapshot = await getDocs(collection(db, collectionName));
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error obteniendo documentos:", error);
    throw error;
  }
};

// Obtener documentos con filtro (consulta)
export const getDocumentsWhere = async (
  collectionName: string,
  field: string,
  operator: any,
  value: any
): Promise<Record<string, any>[]> => {
  try {
    const q = query(
      collection(db, collectionName),
      where(field, operator, value)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error obteniendo documentos con filtro:", error);
    throw error;
  }
};

// Actualizar documento
export const updateDocument = async (
  collectionName: string,
  docId: string,
  data: Record<string, any>
): Promise<void> => {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("Error actualizando documento:", error);
    throw error;
  }
};

// Eliminar documento
export const deleteDocument = async (
  collectionName: string,
  docId: string
): Promise<void> => {
  try {
    await deleteDoc(doc(db, collectionName, docId));
  } catch (error) {
    console.error("Error eliminando documento:", error);
    throw error;
  }
};

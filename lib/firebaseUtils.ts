// Stubs for firebase utilities (no real Firebase interaction). Remove before re-enabling backend.

export const uploadFile = async (
  file: File,
  path: string
): Promise<string> => {
  console.warn('uploadFile stub called', path);
  return '';
};

export const deleteFile = async (_filePath: string): Promise<void> => {
  console.warn('deleteFile stub called');
};

export const addDocument = async (
  _collectionName: string,
  _data: Record<string, any>
): Promise<string> => {
  console.warn('addDocument stub called');
  return 'stub-id';
};

export const getDocuments = async (
  _collectionName: string
): Promise<Record<string, any>[]> => {
  console.warn('getDocuments stub called');
  return [];
};

export const getDocumentsWhere = async (
  _collectionName: string,
  _field: string,
  _operator: any,
  _value: any
): Promise<Record<string, any>[]> => {
  console.warn('getDocumentsWhere stub called');
  return [];
};

export const updateDocument = async (
  _collectionName: string,
  _docId: string,
  _data: Record<string, any>
): Promise<void> => {
  console.warn('updateDocument stub called');
};

export const deleteDocument = async (
  _collectionName: string,
  _docId: string
): Promise<void> => {
  console.warn('deleteDocument stub called');
};

// src/types/Book.ts
export interface BookVolumeInfo {
  title: string;
  description?: string;
  authors?: string[];
  imageLinks?: {
    thumbnail?: string;
  };
  infoLink?: string;
}

export interface GoogleBook {
  id: string;
  volumeInfo: BookVolumeInfo;
}

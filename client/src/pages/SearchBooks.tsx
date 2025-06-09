// src/pages/SearchBooks.tsx
import { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { SAVE_BOOK } from '../utils/graphql';
import Auth from '../utils/auth';
import type { GoogleBook } from '../types/Book';

const SearchBooks = () => {
  const [searchedBooks, setSearchedBooks] = useState<GoogleBook[]>([]);
  const [saveBook] = useMutation(SAVE_BOOK);

  useEffect(() => {
    const fetchBooks = async () => {
      const res = await fetch('https://www.googleapis.com/books/v1/volumes?q=JavaScript');
      const data = await res.json();
      setSearchedBooks(data.items || []);
    };

    fetchBooks();
  }, []);

  const handleSaveBook = async (bookToSave: GoogleBook) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;
    if (!token) return false;

    try {
      await saveBook({
        variables: {
          bookData: {
            bookId: bookToSave.id,
            authors: bookToSave.volumeInfo.authors || [],
            description: bookToSave.volumeInfo.description || '',
            title: bookToSave.volumeInfo.title,
            image: bookToSave.volumeInfo.imageLinks?.thumbnail || '',
            link: bookToSave.volumeInfo.infoLink || '',
          },
        },
      });
      alert('Book saved!');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Search Results</h2>
      {searchedBooks.map((book) => (
        <div key={book.id} className="card mb-3">
          <div className="card-body">
            <h5 className="card-title">{book.volumeInfo.title}</h5>
            <p className="card-text">{book.volumeInfo.description}</p>
            <button
              className="btn btn-success"
              onClick={() => handleSaveBook(book)}
            >
              Save Book
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchBooks;

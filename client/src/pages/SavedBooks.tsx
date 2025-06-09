// src/pages/SavedBooks.tsx
import { useQuery, useMutation } from '@apollo/client';
import { GET_ME, REMOVE_BOOK } from '../utils/graphql';
import Auth from '../utils/auth';

interface Book {
  bookId: string;
  title: string;
  authors?: string[];
  description?: string;
  image?: string;
  link?: string;
}

interface UserData {
  _id: string;
  username: string;
  email: string;
  savedBooks: Book[];
}

const SavedBooks = () => {
  const { loading, data, refetch } = useQuery<{ me: UserData }>(GET_ME);
  const [removeBook] = useMutation(REMOVE_BOOK);

  const userData = data?.me;

  const handleDeleteBook = async (bookId: string) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await removeBook({
        variables: { bookId },
      });
      refetch();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (!userData) {
    return <h2>No user data found</h2>;
  }

  return (
    <div className="container mt-4">
      <h2>Your Saved Books</h2>
      {userData.savedBooks.length === 0 ? (
        <p>You have no saved books.</p>
      ) : (
        userData.savedBooks.map((book) => (
          <div key={book.bookId} className="card mb-3">
            <div className="card-body">
              <h4 className="card-title">{book.title}</h4>
              <p className="card-text">{book.description}</p>
              <button className="btn btn-danger" onClick={() => handleDeleteBook(book.bookId)}>
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default SavedBooks;

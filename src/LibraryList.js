import React, { useState, useEffect } from 'react';
import BorrowerForm from './BorrowerForm';
import Counters from './Counters';
import './LibraryList.css';

function LibraryList() {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchTitle, setSearchTitle] = useState('');
  const [searchAuthor, setSearchAuthor] = useState('');
  const [searchSubject, setSearchSubject] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(10);
  const [totalBooksCount, setTotalBooksCount] = useState(0);
  const [showBorrowerForm, setShowBorrowerForm] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    let filtered = books.filter(book =>
      book.title.toLowerCase().includes(searchTitle.toLowerCase()) &&
      book.author.toLowerCase().includes(searchAuthor.toLowerCase()) &&
      book.subject.toLowerCase().includes(searchSubject.toLowerCase())
    );

    switch (sortBy) {
      case 'title':
        filtered = filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'author':
        filtered = filtered.sort((a, b) => a.author.localeCompare(b.author));
        break;
      case 'subject':
        filtered = filtered.sort((a, b) => a.subject.localeCompare(b.subject));
        break;
      default:
        break;
    }

    setFilteredBooks(filtered);
  }, [books, searchTitle, searchAuthor, searchSubject, sortBy]);

  const fetchBooks = () => {
    fetch(`https://4b69-16-170-208-144.ngrok-free.app/books`,{
    headers:{
      'ngrok-skip-browser-warning': 'true'
    }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch books');
        }
        return response.json();
      })
      .then(data => {
        setBooks(data);
        setFilteredBooks(data);
      })
      .catch(error => console.error('Error fetching books:', error));

    fetch(`https://4b69-16-170-208-144.ngrok-free.app/books/count`,{
      headers:{
        'ngrok-skip-browser-warning': 'true'
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch total books count');
        }
        return response.json();
      })
      .then(data => setTotalBooksCount(data.count))
      .catch(error => console.error('Error fetching total books count:', error));
  };

  const handleClearFilters = () => {
    setSearchTitle('');
    setSearchAuthor('');
    setSearchSubject('');
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const handleSelectBook = (book) => {
    setSelectedBook(book);
    setShowBorrowerForm(true);
  };

  const handleCloseForm = () => {
    setShowBorrowerForm(false);
    setSelectedBook(null);
  };

  const handleBorrow = (bookId, borrowerData) => {
    fetch(`https://4b69-16-170-208-144.ngrok-free.app/books/${bookId}/borrow`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      },
      body: JSON.stringify(borrowerData),
    })
    .then(response => {
      if (response.ok) {
        const updatedBooks = books.map(book => {
          if (book.id === bookId && book.count > 0) {
            return { ...book, count: book.count - 1 };
          }
          return book;
        });
        setBooks(updatedBooks);
        setFilteredBooks(updatedBooks);
        alert(`Book with ID ${bookId} borrowed successfully!`);
      } else {
        throw new Error('Failed to borrow book');
      }
    })
    .catch(error => {
      console.error('Error borrowing book:', error.message);
      alert('Failed to borrow book. Please try again later.');
    });
  };

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);

  const paginate = pageNumber => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(totalBooksCount / booksPerPage);

  return (
    <div className="library-container">
      <div className="filters-container">
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTitle}
          onChange={event => setSearchTitle(event.target.value)}
          className="search-input"
        />
        <input
          type="text"
          placeholder="Search by author..."
          value={searchAuthor}
          onChange={event => setSearchAuthor(event.target.value)}
          className="search-input"
        />
        <input
          type="text"
          placeholder="Search by subject..."
          value={searchSubject}
          onChange={event => setSearchSubject(event.target.value)}
          className="search-input"
        />
        <button onClick={handleClearFilters} className="filter-button">Clear</button>
        <select value={sortBy} onChange={handleSortChange} className="sort-select">
          <option value="title">Sort by Title</option>
          <option value="author">Sort by Author</option>
          <option value="subject">Sort by Subject</option>
        </select>
      </div>
      <p>Total Books: {totalBooksCount}</p>
      <table className="library-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Subject</th>
            <th>Count</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentBooks.map(book => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.subject}</td>
              <td>{book.count}</td>
              <td>
                <button onClick={() => handleSelectBook(book)} className="get-button">Get</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Counters books={filteredBooks} />
      <ul className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
            <button onClick={() => paginate(i + 1)} className="page-link">
              {i + 1}
            </button>
          </li>
        ))}
      </ul>
      {showBorrowerForm && (
        <BorrowerForm
          book={selectedBook}
          onClose={handleCloseForm}
          onBorrow={handleBorrow}
        />
      )}
    </div>
  );
}

export default LibraryList;

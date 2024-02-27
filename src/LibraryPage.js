import React, { useState, useEffect } from 'react';
import LibraryList from './LibraryList';
import './LibraryPage.css';


function LibraryPage() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetchBooks();
  }, []);

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
      })
      .catch(error => console.error('Error fetching books:', error));
  };

  return (
    <div className="container">
      <h1>Library Management System</h1>
      <LibraryList books={books} />
      
    </div>
  );
}

export default LibraryPage;

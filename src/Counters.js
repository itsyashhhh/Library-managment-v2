import React from 'react';
import './counters.css';

function Counters({ books }) {
  let authorCount = {};
  let subjectCount = {};
  if (!Array.isArray(books)) {
    return null; 
  }

  books.forEach(book => {
    authorCount[book.author] = (authorCount[book.author] || 0) + 1;

    subjectCount[book.subject] = (subjectCount[book.subject] || 0) + 1;
  });

  const totalBooks = books.reduce((total, book) => total + (book.count || 0), 0);

  return (
    <div className="counter-container">
      <h2>Book Statistics</h2>
      <div className="counters-wrapper">
        <div className="counter-box">
          <h3>Total Books</h3>
          <div className="counter-value">{totalBooks}</div>
        </div>
        <div className="counter-box">
          <h3>Total Authors</h3>
          <div className="counter-value">{Object.keys(authorCount).length}</div>
        </div>
        <div className="counter-box">
          <h3>Total Subjects</h3>
          <div className="counter-value">{Object.keys(subjectCount).length}</div>
        </div>
      </div>
    </div>
  );
}

export default Counters;

import React, { useState, useEffect } from 'react';
import './BorrowersList.css';
import Lib from './assesst/lib1.jpg';

function BorrowersList() {
  const [borrowers, setBorrowers] = useState([]);
  const [borrowersCount, setBorrowersCount] = useState([]);

  useEffect(() => {
    fetchBorrowers();
  }, []);

  const fetchBorrowers = async () => {
    try {
      const response = await fetch('https://4b69-16-170-208-144.ngrok-free.app/borrowers',{
        headers: {
          'ngrok-skip-browser-warning': 'true'

        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch borrowers data');
      }
      const data = await response.json();
      const uniqueBorrowers = Array.from(new Set(data.map(borrower => borrower.name)))
        .map(name => data.find(borrower => borrower.name === name));
      setBorrowers(uniqueBorrowers);
      const borrowersWithCount = uniqueBorrowers.map(borrower => ({
        ...borrower,
        booksBorrowed: data.filter(item => item.name === borrower.name).length
      }));
      setBorrowersCount(borrowersWithCount);
    } catch (error) {
      console.error('Error fetching borrowers:', error);
    }
  };

  return (
    <div className="borrowers-list-container">
      <h2>Borrowers List<img src={Lib} alt="libaryimg" className='borrower-list-image'/></h2>
      <table className="borrowers-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone Number</th>
          </tr>
        </thead>
        <tbody>
          {borrowers.map((borrower, index) => (
            <tr key={index}>
              <td>{borrower.name}</td>
              <td>{borrower.email}</td>
              <td>{borrower.phoneNumber}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <h2>Borrowers Book Count</h2>
      <table className="borrowers-count-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Books Borrowed</th>
          </tr>
        </thead>
        <tbody>
          {borrowersCount.map((borrower, index) => (
            <tr key={index}>
              <td>{borrower.name}</td>
              <td>{borrower.booksBorrowed}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BorrowersList;

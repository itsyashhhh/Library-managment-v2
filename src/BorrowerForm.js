import React, { useState } from 'react';
import './BorrowerForm.css'; 
import EmailImage from './assesst/email.jpg';

function BorrowerForm({ book, onBorrow }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    address: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://4b69-16-170-208-144.ngrok-free.app/borrowers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({
          bookId: book.id,
          borrowerData: formData,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to store borrower data');
      }
      const emailResponse = await fetch('https://4b69-16-170-208-144.ngrok-free.app/borrowers/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'

        },
        body: JSON.stringify({
          email: formData.email,
          bookTitle: book.title,
        }),
      });

      if (!emailResponse.ok) {
        throw new Error('Failed to send email notification');
      }

      
      onBorrow(book.id, formData);
      window.location.reload();

      
      handleClear();
    } catch (error) {
      console.error('Error handling form submission:', error);
      
    }
  };

  const handleClear = () => {
    setFormData({
      name: '',
      email: '',
      phoneNumber: '',
      address: ''
    });
  };

  return (
    <div className="borrower-form-container">
      <img src={EmailImage} alt="Form Image" className="borrower-form-image" /> 
      <h2>Borrow Book: {book.title}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="form-control" />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="form-control" />
        </div>
        <div className="form-group">
          <label htmlFor="phoneNumber">Phone Number:</label>
          <input type="tel" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required className="form-control" />
        </div>
        <div className="form-group">
          <label htmlFor="address">Address:</label>
          <textarea id="address" name="address" value={formData.address} onChange={handleChange} required className="form-control" />
        </div>
        <button type="submit" className="submit-btn">Submit</button>
      </form>
    </div>
  );
}

export default BorrowerForm;

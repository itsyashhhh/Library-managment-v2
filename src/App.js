
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from './Home';
import LoginPage from './Login';
import UserPage from './User';
import Library from './LibraryPage';
import BookListPage from './BookList';
import LibraryList from './LibraryList';
import BorrowersList from './BorrowersList'; 

function App() {
  return (
    <Routes>
      <Route path="/" exact element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/user" element={<UserPage />} />
      <Route path="/library" element={<Library />}/> 
      <Route path="/books" element={<BookListPage />} />
      <Route path="/library-list" element={<LibraryList />} /> 
      <Route path="/borrowers" element={< BorrowersList/>} />
    </Routes>
  );
}

export default App;

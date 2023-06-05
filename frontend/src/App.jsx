import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './components/Signup';
import TodoPage from './components/todoPage';
import LoginNew from './components/loginNew';



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginNew />} />
        <Route path="/signup" element={<Signup />} />
      
        <Route path="/todoPage" element={<TodoPage/>}/>
        <Route path="/loginNew" element={<LoginNew/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App

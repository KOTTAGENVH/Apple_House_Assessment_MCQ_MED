import './CSS/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter, Route, Routes} from "react-router-dom"
import Navigation from './components/Navigation';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { useDispatch, useSelector } from 'react-redux';
import Feedbacks from "./pages/Feedbacks";
import FeedbackDetail from "./pages/FeedbackDetail";
import AddFeedback from "./pages/AddFeedback";
import React, { useEffect } from "react";
import ScrollToTop from './components/ScrollToTop';

function App() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();


  return (
    <div className="App">
       <BrowserRouter>
       <ScrollToTop/>
       <Navigation/>
       <Routes>

        {!user && (
                 <>
                      
                      <Route path="/signup" element={<Signup />} />
                      <Route path="/" element={<Login />} />
                 </>
                    )}
 
       
          <Route path = "/feedbacks" element={<Feedbacks/>}/>
        <Route path = "/myFeedbacks/:id" element={<FeedbackDetail/>}/>
        <Route path = "/feedbacks/add" element={<AddFeedback/>}/>
        {""}

       </Routes>

       </BrowserRouter>
    </div>
  );
}

export default App;

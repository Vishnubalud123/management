import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import Construction from './pages/Construction/Construction';
import PaymentHistory from './pages/PaymentHistory/PaymentHistory';

import Expenses from './pages/Expenses/Expenses';
import Clients from './pages/Clients/Clients';
import NotFound from './pages/NotFound/NotFound';
import { ConstructionProvider } from './context/ConstructionContext';
import './styles/App.css';

function App() {
  return (
    <ConstructionProvider>
      <Router>
        <div className="App">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/construction" element={<Construction />} />
              <Route path="/payment-history" element={<PaymentHistory />} />    
              <Route path="/expenses" element={<Expenses />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ConstructionProvider>
  );
}

export default App;
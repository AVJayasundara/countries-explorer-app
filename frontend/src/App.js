import {BrowserRouter, Route, Routes} from 'react-router-dom';
import CountryDetailsPage from './pages/CountryDetailsPage';
import HomePage from './pages/HomePage';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
            <Route path="/country/:countryCode" element={<CountryDetailsPage />} />
            <Route path="/" element={<HomePage />} />
            
        </Routes>
      </BrowserRouter>
      
    </div>
  );
}

export default App;

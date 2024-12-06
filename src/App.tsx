import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Home } from './pages/Home';
import { CityAQI } from './pages/CityAQI';
import { cityRoutes } from './routes/cities';

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-100 p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            {cityRoutes.map(route => (
              <Route 
                key={route.path}
                path={route.path}
                element={
                  <CityAQI 
                    metaTitle={route.metaTitle}
                    metaDescription={route.metaDescription}
                  />
                }
              />
            ))}
          </Routes>
        </div>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
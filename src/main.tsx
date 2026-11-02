import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import { ShowroomProvider } from './context/ShowroomContext';
import './index.css';

const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <BrowserRouter>
        <ShowroomProvider>
          <App />
        </ShowroomProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
}

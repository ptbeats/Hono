import React from 'react';
import { Dashboard } from './ui/pages/Dashboard/Dashboard';
// @ts-ignore: CSS module declarations not available in this project setup
import './ui/styles/global.css';

function App() {
  return (
    <div className="App">
      <Dashboard />
    </div>
  );
}

export default App;
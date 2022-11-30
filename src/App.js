import React from 'react';
//import { Plot } from './Plot';
//import { data } from './data';
//import { LineChart } from './LineChart';
import { MultiLineChart } from './MultiLineChart';
import { data } from './data';
import './App.css';


function App() {
  return (
    <div className="App">
      <header className="App-header">
        D3 x React Experimentation
      </header>
      <MultiLineChart plotData={ data } />
    </div>
  );
}

export default App;

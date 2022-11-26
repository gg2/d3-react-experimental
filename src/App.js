import React from 'react';
//import { Plot } from './Plot';
//import { data } from './data';
import { LineChart } from './LineChart';
import { plotData } from './data';
import './App.css';


function App() {
  return (
    <div className="App">
      <header className="App-header">
        D3 x React Experimentation
      </header>
      <LineChart plotData={ plotData } />
    </div>
  );
}
//<Plot plotData={ data } />

export default App;

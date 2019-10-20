import React from 'react';
import { Provider } from 'react-redux';
import configureStore from './store'
import './App.css';

const store = configureStore();

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <h1>Chat</h1>
      </div>
    </Provider>
  );
}

export default App;

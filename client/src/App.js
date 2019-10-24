import React from 'react';
import { Provider } from 'react-redux';
import configureStore from './store'
import './App.css';

import chatInit from './services/twilio-service';

const store = configureStore();
store.dispatch({ type: 'startup', payload: 10 });

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

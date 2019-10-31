import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import configureStore from './store'
import './App.css';
import { types as chatTypes, actions } from './store/redux/chatRedux';
import Chat from './components/chat';
import Public from './public';
import Admin from './admin';


const store = configureStore();

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <Router>
          <Switch>

            <Route path="/Admin">
              <Admin />
            </Route>


            <Route path="/">
              <Public />
            </Route>

          </Switch>
        </Router>
      </div>
    </Provider>
  );
}

export default App;

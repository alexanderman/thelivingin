import React from 'react';
import { Provider } from 'react-redux';
import configureStore from './store'
import './App.css';
import { types as chatTypes } from './store/redux/chatRedux';


function getUrlParams() {
  const pathSplit = window.location.pathname.split('/');
  const query = window.location.search.substring(1);

  const urlData = query.split('&').reduce((acc, keyVal) => {
    const key = keyVal.split('=')[0];
    const val = decodeURIComponent(keyVal.split('=')[1]);
    acc[key] = val;
    return acc;
  }, {});

  urlData.chatId = pathSplit[pathSplit.length - 1];
  return urlData;
}
const urlParams = getUrlParams();


const store = configureStore();
store.dispatch({ type: chatTypes.FETCH_CHAT, payload: {
  chatId: urlParams.chatId,
  userId: urlParams.userId,
  requestId: urlParams.requestId,
  sig: urlParams.sig
} });

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

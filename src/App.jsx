import React from 'react';
import ReactDOM from 'react-dom';
import Content from './content';
import { BrowserRouter } from 'react-router-dom';

import './index.css';

const App = () => (
  <BrowserRouter>
    <React.Suspense fallback="Loading...">
      <Content />
    </React.Suspense>
  </BrowserRouter>
);
ReactDOM.render(<App />, document.getElementById('app'));

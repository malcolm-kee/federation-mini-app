import React from 'react';
import ReactDOM from 'react-dom';
import Content from './content';

import './index.css';

const App = () => (
  <React.Suspense fallback="Loading...">
    <Content />
  </React.Suspense>
);
ReactDOM.render(<App />, document.getElementById('app'));

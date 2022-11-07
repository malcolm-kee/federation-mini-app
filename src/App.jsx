import React from 'react';
import ReactDOM from 'react-dom';
import Content from './exposes/content';
import '@mkeeorg/federation-ui/dist/index.css';

const App = () => <Content />;

ReactDOM.render(<App />, document.getElementById('app'));

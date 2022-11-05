import * as React from 'react';
import styles from './content.module.css';

export default function Content() {
  const [show, toggle] = React.useReducer((val) => !val, false);

  return (
    <div className={styles.root}>
      <h1>Mini App</h1>
      <div>
        <button onClick={toggle} type="button">
          {show ? 'Hide' : 'Show'} Details
        </button>
      </div>
      <p className={styles.content} data-show={show}>
        This is an important content in Mini App.
      </p>
    </div>
  );
}

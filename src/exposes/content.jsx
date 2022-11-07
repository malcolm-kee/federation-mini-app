import { Button, Container } from '@mkeeorg/federation-ui';
import * as React from 'react';
import styles from './content.module.css';

export default function Content() {
  const [show, toggle] = React.useReducer((val) => !val, false);

  return (
    <Container>
      <h1 className={styles.title}>Mini App</h1>
      <div>
        <Button onClick={toggle} size="small">
          {show ? 'Hide' : 'Show'} Details
        </Button>
      </div>
      <p className={styles.content} data-show={show}>
        This is some updated message! Test first before rollout!
      </p>
    </Container>
  );
}

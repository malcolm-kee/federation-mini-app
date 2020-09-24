import * as React from 'react';
import _ from 'lodash';

export default function Content() {
  const [randomString] = React.useState(() =>
    _.times(20, () => _.random(35).toString(36)).join('')
  );

  return (
    <div>
      <h1>Mini App v3</h1>
      <p>Bleeding edge feature</p>
      <p>{randomString}</p>
    </div>
  );
}

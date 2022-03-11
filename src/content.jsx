import _ from 'lodash';
import * as React from 'react';

const getRandomString = () =>
  _.times(20, () => _.random(35).toString(36)).join('');

export default function Content() {
  const [randomString] = React.useState(getRandomString);

  return (
    <div>
      <h1>Mini App v3</h1>
      <p>Bleeding edge feature</p>
      <p>Random String: {randomString}</p>
    </div>
  );
}

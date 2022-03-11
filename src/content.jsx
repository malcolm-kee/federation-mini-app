import _ from 'lodash';
import * as React from 'react';
import { Link } from 'react-router-dom';

const Container = React.lazy(() => import('host/container'));
const getRoutes = () => import('host/routes');
const getRandomString = () =>
  _.times(20, () => _.random(35).toString(36)).join('');

export default function Content() {
  const [randomString] = React.useState(getRandomString);

  const [routes, setRoutes] = React.useState(undefined);

  React.useEffect(() => {
    getRoutes().then(setRoutes);
  }, []);

  return (
    <Container>
      <h1>Mini App v3</h1>
      <p>Bleeding edge feature</p>
      <p>{randomString}</p>
      {routes && <Link to={routes.homeUrl}>Home</Link>}
    </Container>
  );
}

import React from 'react';
import { Switch, Route } from 'react-router';
import App from './components/App';
import NewUserRequest from './components/NewUserRequest/index';
import Admin from './components/Admin/index';
import Thoughts from './components/Thoughts/Thoughts';
import Err404 from './components/Err404/Err404';

export const routes = [{
  path: '/',
  exact: true,
  component: NewUserRequest
}, {
  path: '/admin',
  exact: true,
  component: Admin
},  {
  path: '/thoughts',
  exact: true,
  component: Thoughts
}, {
  component: Err404
}];

export default function Router() {
  return (
    <App>
      <Switch>
        {routes.map(route => (
          <Route key={route.path || 'notfound'} {...route} />
        ))}
      </Switch>
    </App>
  );
}

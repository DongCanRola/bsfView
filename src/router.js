import React from 'react';
import { Router, Route, Redirect, browserHistory, IndexRedirect} from 'dva/router';

//import Login from './components/sign/login';
import Login from './routes/login';

import NotFoundPage from "./components/util/NotFoundPage";

function loginCheck(nextState, replaceState) {
  console.log("登录的路由检测。");
  let token=window.sessionStorage.getItem("user-token");
  if(!token){
    replaceState('/login');
  }
}

const Dashboard = React.createClass({
  render() {
    return <div>Welcome to the app!</div>
  }
})

function RouterConfig({ history }) {
  return (
    <Router history={browserHistory}>
      <Route path="/" component={Login} />
      <Route path="login" component={Login}/>

      <Route path='/404' component={NotFoundPage} />
      <Redirect from='*' to='/404' />

    </Router>

  );
}

export default RouterConfig;

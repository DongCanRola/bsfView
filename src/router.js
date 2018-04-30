import React from 'react';
import { Router, Route, Redirect, browserHistory, IndexRedirect} from 'dva/router';

//import Login from './components/sign/login';
import Login from './routes/Login';

import Admin from './routes/Admin';
import Salesman from './routes/Salesman';
import Buyer from './routes/Buyer';
import WarehouseKeeper from './routes/WarehouseKeeper';
import Producer from './routes/Producer';
import Accountant from './routes/Accountant';

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

      <Route path="/admin" component={Admin} >
      </Route>

      <Route path="/salesman" component={Salesman}>

      </Route>

      <Route path="/buyer" component={Buyer}>

      </Route>

      <Route path="/warehouseKeeper" component={WarehouseKeeper}>

      </Route>

      <Route path="/producer" component={Producer}>

      </Route>

      <Route path="/accountant" component={Accountant}>

      </Route>

      <Route path='/404' component={NotFoundPage} />
      <Redirect from='*' to='/404' />

    </Router>

  );
}

export default RouterConfig;

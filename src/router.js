import React from 'react';
import { Router, Route, Redirect, browserHistory, IndexRedirect} from 'dva/router';

//import Login from './components/sign/login';
import Login from './routes/Login';

import Admin from './routes/Admin';
import UserManagement from './components/admin/UserManagement';

import Salesman from './routes/Salesman';
import SaleCustomerManagement from './components/sale/SaleCustomerManagement';
import PlanOrderManagement from './components/sale/PlanOrderManagement';
import SampleOrderManagement from './components/sale/SampleOrderManagement';
import ProduceOrderManagement from './components/sale/ProduceOrderManagement';
import StoreOrderManagement from './components/sale/StoreOrderManagement';
import CancelOrderManagement from './components/sale/CancelOrderManagement';

import Buyer from './routes/Buyer';
import BuyCustomerManagement from './components/buy/BuyCustomerManagement';
import BuyRoughOrderManagement from './components/buy/RoughOrderManagement';
import BuyUnreachOrderManagement from './components/buy/UnreachOrderManagement';
import BuyReachedOrderManagement from './components/buy/ReachedOrderManagement';
import BuySavedOrderManagement from './components/buy/SavedOrderManagement';
import BuyCancelledOrderManagement from './components/buy/CancelledOrderManagement';
import BuyPartedreOrderManagement from './components/buy/PartedreOrderManagement';
import BuyAllreOrderManagement from './components/buy/AllreOrderManagement';

import MaterialManagement from './components/goods/MaterialManagement';
import ProductManagement from './components/goods/ProductManagement';

import WarehouseKeeper from './routes/WarehouseKeeper';
import WarehouseManagement from './components/warehouse/WarehouseManagement';

import Producer from './routes/Producer';

import Accountant from './routes/Accountant';
import PurchasePayManagement from './components/account/PurchasePayManagement';
import PurchasePayDetail from './components/account/PurchasePayDetail';
import PurchaseReturnManagement from './components/account/PurchaseReturnManagement';
import PurchaseReturnDetail from './components/account/PurchaseReturnDetail';
import SaleGatherManagement from './components/account/SaleGatherManagement';
import SaleGatherDetail from './components/account/SaleGatherDetail';
import SaleReturnManagement from './components/account/SaleReturnManagement';
import SaleReturnDetail from './components/account/SaleReturnDetail';

import SavingsManagement from './components/account/SavingsManagement';

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
        <Route path="/userManagement" component={UserManagement}/>
      </Route>

      <Route path="/salesman" component={Salesman}>
        <Route path="/saleCustomerManagement" component={SaleCustomerManagement}/>
        <Route path="/planOrderManagement" component={PlanOrderManagement}/>
        <Route path="/sampleOrderManagement" component={SampleOrderManagement}/>
        <Route path="/produceOrderManagement" component={ProduceOrderManagement}/>
        <Route path="/storeOrderManagement" component={StoreOrderManagement}/>
        <Route path="/cancelOrderManagement" component={CancelOrderManagement}/>
      </Route>

      <Route path="/buyer" component={Buyer}>
        <Route path="/buyCustomerManagement" component={BuyCustomerManagement}/>
        <Route path="/roughOrderManagement" component={BuyRoughOrderManagement}/>
        <Route path="/unreachOrderManagement" component={BuyUnreachOrderManagement}/>
        <Route path="/reachedOrderManagement" component={BuyReachedOrderManagement}/>
        <Route path="/savedOrderManagement" component={BuySavedOrderManagement}/>
        <Route path="/cancelledOrderManagement" component={BuyCancelledOrderManagement}/>
        <Route path="/partedreOrderManagement" component={BuyPartedreOrderManagement}/>
        <Route path="/allreOrderManagement" component={BuyAllreOrderManagement}/>
        <Route path="/materialChoose" component={MaterialManagement}/>
        <Route path="/customerChoose" component={BuyCustomerManagement}/>
      </Route>

      <Route path="/warehouseKeeper" component={WarehouseKeeper}>
        <Route path="/warehouseManagement" component={WarehouseManagement}/>
      </Route>

      <Route path="/producer" component={Producer}>
        <Route path="/materialManagement" component={MaterialManagement}/>
        <Route path="/productManagement" component={ProductManagement}/>
      </Route>

      <Route path="/accountant" component={Accountant}>
        <Route path="/savingsManagement" component={SavingsManagement}/>
        <Route path="/purchasePay" component={PurchasePayManagement}/>
        <Route path="/purchasePayDetail" component={PurchasePayDetail}/>
        <Route path="/purchaseReturn" component={PurchaseReturnManagement}/>
        <Route path="/purchaseReturnDetail" component={PurchaseReturnDetail}/>
        <Route path="/saleGather" component={SaleGatherManagement}/>
        <Route path="/saleGatherDetail" component={SaleGatherDetail}/>
        <Route path="/saleReturn" component={SaleReturnManagement}/>
        <Route path="/saleReturnDetail" component={SaleReturnDetail}/>
      </Route>

      <Route path='/404' component={NotFoundPage} />
      <Redirect from='*' to='/404' />

    </Router>

  );
}

export default RouterConfig;

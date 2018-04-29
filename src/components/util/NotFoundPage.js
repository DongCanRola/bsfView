/**
 * Created by zuce wei on 2017/5/30.
 */

import React from 'react';
import {Card,Select,Button,Table,InputNumber ,Input,message,Modal,Row,Col} from 'antd';
//import {cardColumns} from "../technicalChief/tableElement";
//import {getNormalStatusCard, addRollToCard} from "../../services/greyFabricOperatorApi";
import {objectToMap} from "../../utils/ObjectToMap";

const Search=Input.Search;

export  default  class NotFoundPage extends React.Component {

  constructor(props){
    super(props);
    this.state = {
    };
  }





  render() {
    return (
      <div>
        <div style={{width:500,height:500,float:'left',marginLeft:580,marginTop:200}}>
          <p>对不起，您访问的页面不存在!</p>
          <a href="/login">返回登录页面</a>
        </div>

      </div>
    )
  }
}

module.exports = NotFoundPage;



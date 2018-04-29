/**
 * Created by Administrator on 2017/12/16.
 */
import React from 'react';
import SourceItem from './SourceItem'
import { Input } from 'antd'
const Search = Input.Search
import { DropTarget } from 'react-dnd'
 class SourceList extends React.Component{

  state = {
    searchKey : undefined
  }

  handleSearch(key){
    this.setState({searchKey: key})
  }

  itemHasKey(item,key){
    for(let x in item){
      if(item[x].toString().indexOf(key) >= 0){
        return true
      }
    }
    return false
  }

    render(){
        let { dataSource,rowKey,render,style,title,connectDropTarget } = this.props
        let { searchKey } = this.state
        const itemHasKey = this.itemHasKey
        if(!dataSource)
            dataSource = []

        return connectDropTarget(
        <span style={{...style,display:"inline-block",}}>
            <div style={{padding:"7px 15px",borderLeft: "1px solid #d9d9d9",
              borderRight : "1px solid #d9d9d9" ,borderTop : "1px solid #d9d9d9",
              textAlign:"center",borderRadius:"4px 4px 0 0"}}>
                {title}</div>
          <Search
            placeholder="搜索"
            style={{ width:"100%" }}
            onSearch={value => this.handleSearch(value)}
          />
            <ul style={{width : "100%",height : "inherit",overflowY:"auto",fontSize: "12px",
                borderLeft: "1px solid #d9d9d9",borderBottom: "1px solid #d9d9d9", borderRight:  "1px solid #d9d9d9", borderRadius:"0 0 4px 4px"}}>
                { dataSource.map(function (item,index) {
                    if(searchKey){
                      if (itemHasKey(item,searchKey)){
                        return <SourceItem data={item} render={render} key={index} rowkey={rowKey} />
                      }
                    }else {
                      return <SourceItem data={item} render={render} key={index} rowkey={rowKey} />
                    }
                })}
            </ul>
        </span>

        );
    }
}

const spec = {
  drop(props,monitor){
    let item = monitor.getItem()
    item.onDrag(item.index)
    return {}
  }
}
function collect(connect,monitor) {
  return {
    connectDropTarget : connect.dropTarget()
  }
}
export default DropTarget('rightToLeft',spec,collect)(SourceList)

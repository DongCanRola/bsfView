/**
 * Created by Administrator on 2017/12/16.
 */
import React from 'react'
import { Checkbox } from 'antd'
import { DragSource,DropTarget } from 'react-dnd'

class SourceItem extends React.Component{
    state = {
        checked : false,
        data : undefined
    }
    render(){
        const { connectDragSource, connectDropTarget, disabled, index,render,data} = this.props;
        this.state = {...this.props}
        let listItem;
        listItem = (
            <li className="source-item"
                style={{padding:"7px 15px",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  borderBottom:"1px solid rgb(217, 217, 217)",
                  textOverflow: "ellipsis"}}>
                <span>{data ? render(data) : "default desc"}</span>
            </li>
        )

        return (connectDropTarget(connectDragSource(listItem)))
    }
}

const spec = {
    beginDrag(props,monitor,component) {
      const { data } = props
        return data
    }
}

function collect(connect,monitor) {
    return{
        connectDragSource : connect.dragSource()
    }
}

const targetSpec = {
    drop(){
        return {}
    }
}

function targetCollect(connect,monitor) {
    return {
        connectDropTarget : connect.dropTarget()
    }
}

export default (DropTarget('rightToRight',targetSpec,targetCollect)(DragSource('leftToRight',spec,collect)(SourceItem)))




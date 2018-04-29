/**
 * Created by Administrator on 2017/12/16.
 */
import React from 'react'
import {Checkbox} from 'antd'
import {DragSource, DropTarget} from 'react-dnd'

class TargetItem extends React.Component {
  state = {
    checked: false
  }

  render() {
    const {connectDragSource, connectDropTarget, disabled, render, data, isOver} = this.props;
    let listItem, isOverStyle = {};
    if (isOver) {
      isOverStyle = {
        // borderTop: "1px dashed blue",
        background:"#bae7ff"}
    }
    listItem = (
      <li className="target-item"
          style={{
            padding: "7px 15px",
            overflow: "hidden",
            whiteSpace: "nowrap",
            borderBottom:"1px solid rgb(217, 217, 217)",
            textOverflow: "ellipsis", ...isOverStyle
          }}
      >
        <span>{data ? render(data) : "default desc"}</span>
      </li>
    )

    return connectDropTarget(connectDragSource(listItem))
  }
}

const spec = {
  beginDrag(props){
    const {index,onDrag} = props
    return {index: index,onDrag : onDrag}
  },
}

function collect(connect, monitor) {
  return{
    connectDragSource: connect.dragSource()
  }
}

const targetSpec = {
  drop(props, monitor){
    if (monitor.getItemType() == 'rightToLeft') {
      props.onMove(monitor.getItem().index, props.index)
    }
    else
      props.onDrop(monitor.getItem(), props.index)
    return {}
  }
}

function targetCollect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
  }
}

export default DropTarget(['leftToRight', 'rightToLeft'], targetSpec, targetCollect)(DragSource('rightToLeft', spec, collect)(TargetItem))


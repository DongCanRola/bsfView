import { Table } from 'antd';
import { DragDropContext, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import React from 'react'

function dragDirection(
  dragIndex,
  hoverIndex,
  initialClientOffset,
  clientOffset,
  sourceClientOffset,
) {
  const hoverMiddleY = (initialClientOffset.y - sourceClientOffset.y) / 2;
  const hoverClientY = clientOffset.y - sourceClientOffset.y;
  if (dragIndex < hoverIndex && hoverClientY > hoverMiddleY) {
    return 'downward';
  }
  if (dragIndex > hoverIndex && hoverClientY < hoverMiddleY) {
    return 'upward';
  }
}

let BodyRow = (props) => {
  const {
    isOver,
    connectDragSource,
    connectDropTarget,
    moveRow,
    dragRow,
    clientOffset,
    sourceClientOffset,
    initialClientOffset,
    ...restProps
  } = props;
  const style = { cursor: 'move' };

  let className = restProps.className;
  if (isOver && initialClientOffset) {
    const direction = dragDirection(
      dragRow.index,
      restProps.index,
      initialClientOffset,
      clientOffset,
      sourceClientOffset
    );
    if (direction === 'downward') {
      className += ' drop-over-downward';
    }
    if (direction === 'upward') {
      className += ' drop-over-upward';
    }
  }

  return connectDragSource(
    connectDropTarget(
      <tr
        {...restProps}
        className={className}
        style={style}
      />
    )
  );
};

const rowSource = {
  beginDrag(props) {
    return {
      index: props.index,
    };
  },
};

const rowTarget = {
  drop(props, monitor) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Time to actually perform the action
    props.moveRow(dragIndex, hoverIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex;
  },
};

BodyRow = DropTarget('row', rowTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  sourceClientOffset: monitor.getSourceClientOffset(),
}))(
  DragSource('row', rowSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    dragRow: monitor.getItem(),
    clientOffset: monitor.getClientOffset(),
    initialClientOffset: monitor.getInitialClientOffset(),
  }))(BodyRow)
);

const columns =[
  {
    title: "设备编号",
    width: "25%",
    dataIndex: "equipmentId",
    sorter: (a, b) => a.equipmentId - b.equipmentId,
  },{
    title: "设备名称",
    dataIndex: "equipmentName",
    width: "25%",
  },{
    title: "设备类型",
    dataIndex: "equipmentType",
    width: "25%",
  },{
    title: "设备状态",
    render:(record)=>{
      let show="";
      if(record.status==0){
        show = "异常";
      }else if(record.status==1){
        show = "正常";
      }else if(record.status==2){
        show = "已废除";
      }
      return(<span>{show}</span>);
    },
    width: "25%"
  },
];

class DragSortingTable extends React.Component {
  state = {
    data: [
      {"equipmentId":33,"equipmentName":"1#溢流机","status":1,"equipmentType":"溢流机"},
      {"equipmentId":34,"equipmentName":"2#溢流机","status":1,"equipmentType":"溢流机"},
    ],
  }

  components = {
    body: {
      row: BodyRow,
    },
  }

  moveRow = (dragIndex, hoverIndex) => {
    const { data } = this.state;
    const dragRow = data[dragIndex];

    this.setState(
      update(this.state, {
        data: {
          $splice: [[dragIndex, 1], [hoverIndex, 0, dragRow]],
        },
      }),
    );
  }

  render() {
    const { data } = this.props
    this.state.data=data
    const element =( <Table
      columns={columns}
      dataSource={this.state.data}
      components={this.components}
      onRow={(record, index) => ({
        index,
        moveRow: this.moveRow,
      })}
    />)
    return element
  }
}
export default DragDropContext(HTML5Backend)(DragSortingTable)

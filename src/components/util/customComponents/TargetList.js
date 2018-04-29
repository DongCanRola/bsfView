/**
 * Created by Administrator on 2017/12/16.
 */
import React from 'react';
import TargetItem from './TargetItem'
import {DropTarget} from 'react-dnd'


class TargetList extends React.Component {
    state = {
        dataSource: [],
    }

    handleDrop = (item, index, isChangeOrder) => {
        if (index)
            this.state.dataSource.splice(index, 0, item)
        else {
            let i = this.state.dataSource.length
            this.state.dataSource.splice(i, 0, item)
        }
        this.forceUpdate()
    }

    handleMove = (fromindex, toindex) => {
        const {dataSource} = this.state
        let temp1 = dataSource[fromindex]
        // let temp2 = dataSource[toindex]
        dataSource.splice(fromindex,1)
        dataSource.splice(toindex,0,temp1)
        // dataSource[fromindex] = temp2
        // dataSource[toindex] = temp1
        this.forceUpdate()
    }

    handleDrag = (index) => {
        this.state.dataSource.splice(index, 1)
        this.forceUpdate()
    }

    componentDidUpdate() {
        const {rowKey, onChange} = this.props
        let selectKeys = []
        this.state.dataSource.forEach(item => {
          if(item != undefined)
            selectKeys.push(rowKey(item))
        })
        onChange(selectKeys)
    }

    render() {
        let {dataSource, connectDropTarget, rowKey, render, style, title} = this.props
        if (!dataSource)
            dataSource = []
        this.state.dataSource = dataSource
        const handleDrop = this.handleDrop
        const handleDrag = this.handleDrag
        const handleMove = this.handleMove
        return connectDropTarget(
            <span style={{...style, display: "inline-block",}}>
                <div style={{
                    padding: "7px 15px", borderLeft: "1px solid #d9d9d9",
                    borderRight: "1px solid #d9d9d9", borderTop: "1px solid #d9d9d9",
                    textAlign: "center", borderRadius: "4px 4px 0 0"
                }}>
                {title}</div>
                <ul style={{
                    width: "100%", height: "inherit", display: "inline-block", overflowY: "auto", fontSize: "12px",
                    border: "1px solid #d9d9d9", borderRadius: "0 0 4px 4px"
                }}>
                { dataSource.map(function (item, index) {
                    return <TargetItem data={item} render={render} key={index} index={index} rowkey={rowKey}
                                       onDrop={handleDrop} onDrag={handleDrag} onMove={handleMove}/>
                })}
            </ul>
            </span>
        );
    }
}

const spec = {
    drop(props, monitor, component){
        if (monitor.didDrop())
            return {}
        component.handleDrop(monitor.getItem())
        return {}
    }
}

function collect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget()
    }
}

export default DropTarget('leftToRight', spec, collect)(TargetList)

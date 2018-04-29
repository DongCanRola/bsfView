/**
 * Created by Administrator on 2017/12/16.
 */
import React from 'react'
import SourceList from './SourceList'
import TargetList from './TargetList'
import {Row} from 'antd'
import {DragDropContext} from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

class Transfer extends React.Component {
  state = {
    sourceData: [],
    targetData: []
  }

  render() {
    const {rowKey, dataSource, listStyle, targetKeys, render, titles, onChange} = this.props
    this.state.sourceData = dataSource;
    let dataTarget = []
    for (let i of targetKeys) {
      for(let j of dataSource){
        if(j.process_id == i){
          dataTarget.push(dataSource[i])
          break;
        }
      }
    }
    this.state.targetData = dataTarget
    const element = (<Row>
      <SourceList dataSource={this.state.sourceData} style={listStyle} rowKey={rowKey} render={render}
                  title={titles[0]}/>
      <TargetList dataSource={this.state.targetData} style={listStyle} rowKey={rowKey} render={render} title={titles[1]}
                  onChange={onChange}/>
    </Row>)
    return element
  }
}

export default DragDropContext(HTML5Backend)(Transfer)

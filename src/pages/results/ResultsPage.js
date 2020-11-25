import React, {Component} from 'react'
//import ResultsComponent from 'components/Results'
import WrapperComponent from 'components/Wrapper'
////import CSSModules from 'react-css-modules'
//import  './Results.scss'

//
export default class Results extends Component {


  //componentDidMount() {}
  //componentWillReceiveProps = (nextProps, nextState) => {};

  render(){
    return <div>
      <WrapperComponent
        use="results"
      />
    </div>
  }
}

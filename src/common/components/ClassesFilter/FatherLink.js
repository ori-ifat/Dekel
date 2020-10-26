import React from 'react'
import { translate } from 'react-polyglot'
import { observer } from 'mobx-react'
import {observable} from 'mobx'

import  './ClassesFilter.scss'

export default
@translate()
@observer
class FatherLink extends React.Component {
  /*constructor(props) {
    super(props)
    // create a ref to store the textInput DOM element
    this.checkBox = React.createRef()    
  }*/

  @observable checked = false
  
  componentDidMount() {
    //const {isChecked} = this.props
    //this.checked = isChecked  //initial state should remain false
  }

  componentDidUpdate(prevProps) {
    /*if (prevProps.isChecked !== this.props.isChecked) {
      this.checked = this.props.isChecked
    }*/ //seems unneeded ... 
  }

  /*clickCheckbox = () => {
    // Explicitly focus the text input using the raw DOM API
    // Note: we're accessing "current" to get the DOM node
    this.checkBox.current.click()
    this.checked = !this.checked
  }*/

  onCheck = () => {
    const {onChange, name, value} = this.props
    this.checked = !this.checked
    onChange(this.checked, name, value)
  }
  
  render() {
    // tell React that we want to associate the <input> ref
    // with the `textInput` that we created in the constructor
    const {/*isChecked, name, value, onChange,*/ t} = this.props
    const label = this.checked ? t('filter.unCheckChild') : t('filter.checkChild')
    return (
      <React.Fragment>
        <a onClick={this.onCheck} styleName="father-link">{label}</a>
        {/*<input type="checkbox"      
          checked={isChecked}
          name={name}
          value={value}
          onChange={(e) => onChange(e)}
          ref={this.checkBox}
          style={{display: 'none'}}
    />*/}
      </React.Fragment>
    );
  }
}
import React from 'react'
import { string, object } from 'prop-types'
import { inject, observer } from 'mobx-react'
import {observable, toJS} from 'mobx'
import { translate } from 'react-polyglot'
import Select from 'react-select'
import {doFilter} from 'common/utils/filter'
import map from 'lodash/map'
//import CSSModules from 'react-css-modules'
import  './ComboFilter.scss'

@translate()
@inject('searchStore')

export default @observer class ComboFilter extends React.Component {

  static propTypes = {
    type: string,
    items: object
  }

  @observable items = []
  @observable values;

  componentWillMount() {
    const {items, type, searchStore} = this.props
    this.type = type
    this.items = items
  }

  componentWillReceiveProps(nextProps) {
    const {items, type, searchStore} = nextProps
    this.type = type
    this.items = items
  }

  onChange = (values) => {
    //console.log('values', values)
    this.values = values
    this.doFilter()
  }

  onClose = () => {
    console.log('close')
  }

  doFilter = () => {
    const { searchStore } = this.props
    const field = this.type == 'publishers' ? 'publisher' : 'implement...'
    const selected = map(this.values, value => {
      return this.type == 'publishers' ? value.PublisherID : -1  //implement
    })
    doFilter(searchStore, field, selected)
  }

  render() {
    const {t} = this.props
    const values = toJS(this.values)
    const idParam = this.type == 'publishers' ? 'PublisherID' : 'ID'   //implement
    const nameParam = this.type == 'publishers' ? 'PublisherName' : 'Name'   //implement
    const placeHolder = this.type == 'publishers' ? t('filter.publishersTitle') : 'implement...'   //implement
    const options = toJS(this.items)

    return(
      <div>
        <Select
          className="search-select"
          name="filter"
          placeholder={placeHolder}
          noResultsText={t('filter.noData')}
          searchPromptText=""
          multi={true}
          clearable={true}
          closeOnSelect={false}
          openOnClick={false}
          menuContainerStyle={{maxHeight: '200px', overflowY: 'visible'}}
          options={options}
          onChange={this.onChange}
          onClose={this.onClose}
          value={values}
          labelKey={nameParam}
          valueKey={idParam}
        />
      </div>
    )
  }
}

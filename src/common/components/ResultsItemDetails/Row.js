import React, {Component, PropTypes} from 'react'
//import CSSModules from 'react-css-modules'
import  './ResultsItemDetails.scss'

const Row = ({label, bold, data, html, dir, align, table, fixedTable, resultsTable}) => {
  const itemStyle = dir ?
    align && align == 'left' ? 'item_key item_ltr item_left' :
      dir == 'ltr' ? 'item_key item_ltr' :
        'item_key' : 
    'item_key'
  const labelStyle = bold ? 'item_label bold' : 'item_label'
  return <div className="grid-x">
    <div className="medium-3 cell">
      <div styleName={labelStyle}>{label}</div>
    </div>
    <div className="medium-9 cell">
      <div styleName={itemStyle} dangerouslySetInnerHTML={html}>
        {data}
      </div>
      {table && table.length > 0 && <div><Table rows={table} maxCols={10} fixed={false} /></div>}      
      {fixedTable && fixedTable.length > 0 && <div><Table rows={fixedTable} maxCols={3} fixed={true} /></div>}
      {resultsTable && resultsTable.length > 0 && <div><ResultsData results={resultsTable} /></div>}
    </div>
  </div>
}

const Table = ({rows, maxCols, fixed}) => {
  //create header and data arrays to map later on return statement 
  const hasHeader = !fixed && rows[0].header
  const header = []
  if (hasHeader) {    
    for (let j = 1; j <= maxCols; j++) {
      //max 13 cols
      if (rows[0][`col${j}`].trim() != '')
        header.push(rows[0][`col${j}`])
    }
  }

  //try to find the real max col that has data (not space or emprt string)
  let maxReal = 0
  const index = rows.length >= 3 ? 2 : rows.length - 1  //get the 2nd row (1st may be a fake header)
  for (let j = 1; j <= maxCols; j++) {
    if (rows[index][`col${j}`].trim() != '') {
      maxReal++ //advance counter if there is data
    }    
  }
  //console.log('maxReal', maxReal)

  const data = []
  for (let i = 0; i < rows.length; i++) {
    //each data array cell will be an array of columns
    const col = []
    //for (let j = 1; j <= maxCols; j++) {
    for (let j = 1; j <= maxReal; j++) {
      if (rows[i][`col${j}`].trim() != '') {
        col.push(rows[i][`col${j}`])
      }
      else {  //** note this can only happen when using maxReal, otherwise a space will be pushed for each empty cell
        col.push('&nbsp;')
      }
    }
    data.push(col)
  }

  return (<table styleName="ft-tt">
    {header.length > 0 && 
      <thead>
        <tr>
          {/*header.map((col, index) => fixed ? <td key={index} dangerouslySetInnerHTML={{__html: col}}></td> : <td key={index}>{col}</td>)*/}
          {header.map((col, index) => <td key={index} dangerouslySetInnerHTML={{__html: col}}></td>)}
        </tr>
      </thead>
    }
    <tbody>
      {
        data.map((row, index) => {
          //const cols = row.map((col, i) => fixed ? <td key={i} dangerouslySetInnerHTML={{__html: col}}></td> : <td key={i}>{col}</td>)
          const cols = row.map((col, i) => <td key={i} dangerouslySetInnerHTML={{__html: col}}></td>)
          return <tr key={index}>
            {cols}
          </tr>})
      }
    </tbody>
  </table>
  )
}

const ResultsData = ({results}) => {
  return <table styleName="results-table">
    <tbody>
      {
        results.map((row, index) => {
          const cells = []
          Object.keys(row).forEach((key, i) => {
            //console.log('key', key);
            if (key !== 'an') {
              cells.push(<td key={i}>{row[key]}</td>)
            }
          })          
          //const cols = row.map((col, i) => <td key={i}>{col}</td>)
          return <tr key={index}>
            {cells}
          </tr>})
      }
    </tbody>
  </table>
}

export default Row
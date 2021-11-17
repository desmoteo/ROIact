import React, { useState } from 'react'
import _ from 'lodash'

export const withTableSorting = (Component, dftColumn, dftDirection) => props => {
  // sort
  const [column, setColumn] = useState(dftColumn)
  const [direction, setDirection] = useState(dftDirection)

  const handleSort = clickedColumn => () => {
    if (column !== clickedColumn) {
      setColumn(clickedColumn)
      setDirection('ascending')
      return
    }

    setDirection(direction === 'ascending' ? 'descending' : 'ascending')
  }

  const sortData = data => {
    let sortedData = _.sortBy(data, [o => o[column]])
    if (direction === 'descending') {
      sortedData = sortedData.reverse()
    }

    return sortedData
  }

  return Component({ handleSort, column, direction, sortData, ...props })
}

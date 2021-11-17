import React, { useState } from 'react'
import { Modal, Form, Select, Input, Button } from 'semantic-ui-react'
import PropTypes from 'prop-types'

const ShapeModal = props => {
  const typeOptions = [
    { key: 'inbound', value: 'inbound', text: 'inbound' },
    { key: 'outbound', value: 'outbound', text: 'outbound' }
  ]

  const [name, setName] = useState(props.shape.name)
  const [mode, setMode] = useState(props.shape.mode)
  const [threshold, setThreshold] = useState(props.shape.threshold)

  const floatparser = (r) => {
    var res = parseFloat(r)
    res = isNaN(res) ? 0 :res
    return res
  } 

  return (
    <Modal open size='tiny'>
      <Modal.Header>Edit ROI</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <Form>
            <Form.Field>
              <label>Name</label>
              <Input value={name} onChange={(e, { value }) => {console.log(e); setName(value)}} />
              <label>Threshold (% of ROI coverage triggering the alert)</label>
              <Input value={threshold} placeholder='0' type='number' label='%' labelPosition='right' onChange={(e, { value }) => setThreshold(floatparser(value))} />
            </Form.Field>

          </Form>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={props.onClose} negative>
          Cancel
        </Button>
        <Button
          onClick={() => {
            props.onSave(props.shape.id, name, mode, threshold)
            props.onClose()
          }}
          positive
          labelPosition='right'
          icon='checkmark'
          content='Save'
        />
      </Modal.Actions>
    </Modal>
  )
}

ShapeModal.propTypes = {
  shape: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired
}

export default ShapeModal

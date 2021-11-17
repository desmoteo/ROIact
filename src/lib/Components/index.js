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

  return (
    <Modal open size='tiny'>
      <Modal.Header>Edit ROI</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <Form>
            <Form.Field>
              <label>Name</label>
              <Input value={name} onChange={(e, { value }) => setName(value)} />
            </Form.Field>
          </Form>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={props.onClose} negative>
          Annulla
        </Button>
        <Button
          onClick={() => {
            props.onSave(props.shape.id, name, mode)
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

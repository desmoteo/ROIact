import React from 'react'
import { Modal, Button, Header } from 'semantic-ui-react'
import PropTypes from 'prop-types'

const DrawHelpModal = props => {
  return (
    <Modal open style={{ position: "static" }}>
      <Modal.Header>Drawing instructions</Modal.Header>
      <Modal.Content>
        {/*<Modal.Description>
          <Header as='h5'>Opacità sfondo</Header>
          <p>
            Muovi lo slider per cambiare il livello di opacità dell'area da
            disegno.
          </p>
          <Header as='h5'>Strumento Selezione</Header>
          <p>
            Lo strumento selezione ti permette di modificare le forme presenti
            sull'area di disegno. Potrai selezionare una o più forme, ed agire
            sui controlli che appariranno per modificare le dimensioni della
            forma oppure ruotarla. Premi il tasto{' '}
            <i>
              <b>CANC</b>
            </i>{' '}
            per cancellare la/le forme selezionate.
          </p>
          <Header as='h5'>Strumento Rettangolo</Header>
          <p>
            Utilizza questo strumento per disegnare dei rettangoli. Fai un primo
            click per disegnare il primo vertice, muovi il mouse per avere
            un'anteprima della forma finale e clicca nuovamente per ultimare il
            disegno. Premi il tasto{' '}
            <i>
              <b>CANC</b>
            </i>{' '}
            per annullare l'operazione.
          </p>
          <Header as='h5'>Strumento Poligono</Header>
          <p>
            Utilizza questo strumento per disegnare dei poligoni. Fai un primo
            click per disegnare il primo vertice, muovi il mouse nella posizione
            desiderata e clicca nuovamente per disegnare il vertice successivo.
            Premi{' '}
            <i>
              <b>ESC</b>
            </i>{' '}
            sulla tastiera per finire il disegno. Premi il tasto{' '}
            <i>
              <b>CANC</b>
            </i>{' '}
            per annullare l'operazione.
          </p>
          <Header as='h5'>Modalità</Header>
          <p>
            Puoi selezionare il tipo di modalità desiderata (inbound, outbound)
            prima di effettaure un disegno. Le due modalità hanno colori di
            disegno differenti, così come indicato dai colori delle rispettive
            icone.
          </p>
          <Header as='h5'>Forme</Header>
          <p>
            Nella sezione{' '}
            <i>
              <b>Forme</b>
            </i>{' '}
            vedrai un elenco di tutte le forme disegnate. Ciascuna forma sarà
            editabile (nome e modalità) oppure eliminabile. Cliccando sul nome
            di una forma potrai selezionarla nell'area di disegno, e viceversa,
            selezionando una forma sull'area di disegno la vedrai selezionata
            anche in questa lista.
          </p>
        </Modal.Description>*/}
        <Modal.Description>

          <Header as='h5'>Selection Tool</Header>
          <p>
            The Selection tool allows you to modify the shapes on the drawing area. You can select one or more shapes, and act on the controls that appear to change the size of the shape
            Press {' '}
            <i>
              <b>DEL/CANC</b>
            </i>{' '}
            to delete the selected shapes.
          </p>
          <Header as='h5'>Rectangle tool</Header>
          <p>
          Use this tool to draw rectangles. Make a first click to draw the first vertex, move the mouse to have a preview of the final shape and click again to finish the drawing.
          Press {' '}
            <i>
              <b>DEL/CANC</b>
            </i>{' '}
            to delete the rectangle.
          </p>
          <Header as='h5'>Polygon Tool</Header>
          <p>
          Use this tool to draw polygons. Make a first click to draw the first vertex, move the mouse to the desired position and click again to draw the next vertex, and so on.
            Press {' '}
            <i>
              <b>ESC</b>
            </i>{' '}
            on the keyboard to stop drawing.
            Press {' '}
            <i>
              <b>DEL/CANC</b>
            </i>{' '}
            to delete the polygon.
          </p>
          <Header as='h5'>Regions of Interest (ROIs)</Header>
          <p>
            In the section (below the drawing area) {' '}
            <i>
              <b>Regions of Interest (ROIs)</b>
            </i>{' '}
            you will see a list of all the drawn shapes. Each form will be editable (name/label and threshold). By clicking on the name of a shape you will be able to select it in the drawing area, and vice versa, by selecting a shape on the drawing area you will see it selected also in this list.
          </p>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={props.onClose} negative>
          Close
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

DrawHelpModal.propTypes = {
  onClose: PropTypes.func.isRequired
}

export default DrawHelpModal

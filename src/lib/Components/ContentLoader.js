import React from 'react'
import { Dimmer, Loader } from 'semantic-ui-react'


const ContentLoader = props => (
  <div style={{ minHeight: props.minHeight, position: 'relative', ...props.styles }}>
    <Dimmer active inverted>
      <Loader />
    </Dimmer>
  </div>
)

ContentLoader.defaultProps = {
  minHeight: '400px'
}

export default ContentLoader

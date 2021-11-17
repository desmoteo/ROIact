import React, { Component } from 'react';
import { Icon, Step} from 'semantic-ui-react'

class Stepper extends Component {



  render() {
    return (
          <Step.Group attached={this.props.attached}>
            <Step active={this.props.active === 'Manage'}
              onClick={this.props.handleChangeEvent}
              title='Manage'>
              <Icon name='video play outline' />
              <Step.Content>
                <Step.Title>Welcome</Step.Title>
                <Step.Description>Getting started</Step.Description>
              </Step.Content>
            </Step>

            <Step active={this.props.active === 'Configuration'}
              onClick={this.props.handleChangeEvent}
              title='Configuration'>
              <Icon name='settings' />
              <Step.Content>
                <Step.Title>Configuration</Step.Title>
                <Step.Description>Edit OpenVPN configuration File</Step.Description>
              </Step.Content>
            </Step>

            <Step active={this.props.active === 'Login'}
              onClick={this.props.handleChangeEvent}
              title='Login'>
              <Icon name='user' />
              <Step.Content>
                <Step.Title>Login</Step.Title>
                <Step.Description>Edit OpenVPN Login</Step.Description>
              </Step.Content>
            </Step>
          </Step.Group>
    );
  }
}


export default Stepper;

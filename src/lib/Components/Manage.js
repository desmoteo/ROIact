import React, { Component } from 'react';
import { Container, Dimmer, Loader, Checkbox, Header, Accordion, Icon, Segment, Message } from 'semantic-ui-react'
import { create } from 'apisauce'


//http://172.16.0.25/list.cgi

//Filters the given array to those which when passed into matcher return true
Array.prototype.where = function (matcher) {
    var result = [];
    for (var i = 0; i < this.length; i++) {
        if (matcher(this[i])) {
            result.push(this[i]);
        }
    }
    return result;
};

function GetElementsByAttribute(doc, tag, attr, attrValue) {
    //Get elements and convert to array
    var elems = Array.prototype.slice.call(doc.getElementsByTagName(tag), 0);

    //Matches an element by its attribute and attribute value
    var matcher = function (el) {
        return el.getAttribute(attr) === attrValue;
    };

    return elems.where(matcher);
}

// define the api
const api = create({
    baseURL: '../../axis-cgi/applications/',
    headers: { 'Access-Control-Allow-Origin': '*' }
})

// define the camera api
const cameraApi = create({
    baseURL: '../OpenVPNSetup/',
    headers: { 'Access-Control-Allow-Origin': '*' }
})
class Manage extends Component {

    state = { activeIndex: 0 }

    handleClick = (e, titleProps) => {
        const { index } = titleProps
        const { activeIndex } = this.state
        const newIndex = activeIndex === index ? -1 : index

        this.setState({ activeIndex: newIndex })
    }

    handleStartStop = () => {

        this.setState({ loading: true })
        /*setTimeout(function () { //Start the timer
            this.setState({ loading: false, ssError: true }) //After 1 second
            setTimeout(function () { //Start the timer
                this.setState({ ssError: false }) //After 1 second
            }.bind(this), 2000)
        }.bind(this), 1000)*/
        api.get('control.cgi', { action: this.state.running ? 'stop' : 'start', package: 'OpenVPNSetup' }).then((response) => {
            if (response.ok) {
                console.log('OK')
                //this.props.handleStartStop()
                this.checkRunning(true)

            }
            else {
                console.log('ERROR')
                this.setState({ loading: false, ssError: true })
            }

        })
    }

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            running: props.running,
            ip: 'None'
        };

    }

    checkRunning(update) {
        api.get('list.cgi').then((response) => {
            if (response.ok) {
                console.log('OK')

                var parser = new DOMParser();
                var xmlDoc = parser.parseFromString(response.data, "text/xml");
                var elem = GetElementsByAttribute(xmlDoc, 'application', 'Name', 'OpenVPNSetup')[0];
                this.setState({ loading: false, running: elem.getAttribute('Status') === 'Running' })
                elem.getAttribute('Status') === 'Running' ? this.props.handleStarted() : this.props.handleStopped();
                console.log(elem.getAttribute('Status'))
                if (update) {
                    this.setState({ loading: false, ssSuccess: true })
                }
            }
            else {
                console.log('ERROR')
                this.setState({ loading: false, apiError: true })
            }

        })
    }

    componentDidMount() {
        this.checkRunning(false)
        cameraApi.post('info.cgi', "ip").then((response) => {
            if (response.ok) {
                console.log('OK')

                this.setState({ loading: false, ip: response.data.ip, apiError: false })
            }
            else {
                console.log('ERROR')
                this.setState({ loading: false, apiError: true })
            }

        })
    }

    render() {
        const { activeIndex } = this.state


        return (
            <Dimmer.Dimmable as={Container} dimmed={this.state.loading}>
                <Dimmer active={this.state.loading} inverted>
                    <Loader size='massive'>Loading</Loader>
                </Dimmer>
                <Header as='h2' textAlign='center'> Welcome </Header>
                <div style={{ textAlign: 'center', margin: '5%' }}>
                    <Checkbox toggle label="Start/Stop Plugin" checked={this.state.running} onChange={this.handleStartStop} />
                    <Message
                        hidden={!this.state.loading && !(this.state.ip === 'None')}
                        icon='warning'
                        warning
                        header='Warning!'
                        content='Not Connected!'
                    />
                    <Message
                        hidden={!this.state.loading && (this.state.ip === 'None')}
                        icon='check'
                        success
                        header='Connected!'
                        content={'IP info:' + this.state.ip}
                    />
                </div>
                <Message
                    hidden={!this.state.ssSuccess}
                    icon='check'
                    success
                    header='OK!'
                    content={this.props.running ? 'Plugin successfully started!' : 'Plugin successfully stopped!'}
                />
                <Message
                    hidden={!this.state.ssError}
                    icon='warning'
                    error
                    header='Error!'
                    content={this.props.running ? 'Plugin NOT started!' : 'Plugin NOT stopped!'}
                />
                <Message
                    hidden={!this.state.apiError}
                    icon='warning'
                    error
                    header='Error!'
                    content={this.state.running ? 'Server Error! Please check Logs' : 'Server Error! Please start the Client Plugin'}
                />
                <Accordion styled fluid>
                    <Accordion.Title active={activeIndex === 0} index={0} onClick={this.handleClick}>
                        <Icon name='dropdown' />
                        Start/Stop Plugin
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 0}>
                        <p>
                            Start the plugin, then update the configuration and login information
                        </p>
                    </Accordion.Content>

                    <Accordion.Title active={activeIndex === 1} index={1} onClick={this.handleClick}>
                        <Icon name='dropdown' />
                        Client Configuration
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 1}>
                        <p>
                            A Client configuration file should provide all necessary information for the client to connect to the server. <br />
                            <br />
                            In case the OpenVPN server requires a client username/password authentication,
                            client configuration should include a "auth-user-pass /usr/local/packages/OpenVPNSetup/openvpn.pass" line
                            as shown below. Username and Password to be stored in /usr/local/packages/OpenVPNSetup/openvpn.pass should be provided in the following "Login" tab.  <br />
                            <Segment>
                                <pre> {`
client
remote vpn-server-ip port
dev tun
proto tcp
up-restart
nobind
persist-key
persist-tun
comp-lzo adaptive
keepalive 30 120
tls-client
pull
;auth-nocache
remote-cert-tls server
auth-user-pass /usr/local/packages/OpenVPNSetup/openvpn.pass 
script-security 2
<ca>
-----BEGIN CERTIFICATE-----
....
-----END CERTIFICATE-----
</ca>
key-direction 1
<tls-auth>

-----BEGIN OpenVPN Static key V1-----
....
-----END OpenVPN Static key V1-----
</tls-auth>`}
                                </pre>
                            </Segment>
                        </p>
                    </Accordion.Content>

                    <Accordion.Title active={activeIndex === 2} index={2} onClick={this.handleClick}>
                        <Icon name='dropdown' />
                        Login
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 2}>
                        <p>
                            Set client autentication user/password
                        </p>
                    </Accordion.Content>
                </Accordion>

            </Dimmer.Dimmable>
        );
    }
}


export default Manage;

import React, { Component } from 'react';
import FileSubmit from './FileSubmit'
import { create } from 'apisauce'

// define the api
const api = create({
    baseURL: '../OpenVPNSetup/',
    headers: { 'Access-Control-Allow-Origin': '*' }
})

class Login extends Component {

    handleSubmit = (value, setSuccess, setError) => {

        // start making calls
        api
            .post('pass.cgi', 'data=' + encodeURIComponent(value))
            .then((response) => {
                if (response.ok) {
                    setSuccess()
                }
                else {
                    setError()
                }
                return response.data

            })
            .then((response) => {

            }
            )


    }


    render() {
        return (
            <FileSubmit textRows={4} title='Client Login'
                label='Client Login' placeholder='OpenVPN Client login information goes here...'
                okMessage='Client Login was correctly saved to file!' errorMessage='Client Login was NOT correctly saved to file! (Is the plugin running?)'
                handleSubmit={this.handleSubmit}
            />
        );
    }
}


export default Login;

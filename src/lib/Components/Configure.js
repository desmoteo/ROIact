import React, { Component } from 'react';
import FileSubmit from './FileSubmit'
import { create } from 'apisauce'

// define the api
const api = create({
    baseURL: '../OpenVPNSetup/',
    headers: { 'Access-Control-Allow-Origin': '*' }
})


class Configure extends Component {

    handleSubmit = (value, setSuccess, setError, setErrorMessage) => {

        // start making calls
        if (value.length > 12000)
        {
            setErrorMessage("Configuration too long: " + value.length + " bytes (12000 bytes limit). Please reduce conf file size!")
        }
        else
        {
            api
            .post('conf.cgi', 'data=' + encodeURIComponent(value))
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



    }

    state = { success: false }

    render() {
        return (
            <FileSubmit textRows={20} title='Client Configuration'
                label='Client Configuration File' placeholder='OpenVPN Client configuration information goes here...'
                okMessage='Client Configuration was correctly saved to file!' errorMessage='Client Configuration NOT correctly saved to file!'
                handleSubmit={this.handleSubmit}
            />
        );
    }
}


export default Configure;

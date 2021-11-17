import React, { Component } from 'react';
import { Header, Form, Segment, Message } from 'semantic-ui-react'



class FileSubmit extends Component {

    state = { success: false }

    handleChange = (e, { value }) => this.setState({ value })
    handleSubmit = (e) => {


        this.setState({ submittedValue: this.state.value, loading: true})
        this.props.handleSubmit(this.state.value, this.setSuccess, this.setError, this.setErrorMessage)
        
    }

    setSuccess = () => {
        this.setState({ success: true, loading: false})
        setTimeout(function() { //Start the timer
            this.setState({ success: false}) //After 1 second
        }.bind(this), 2000)
    }

    setError = () => {
        this.setState({ error: true, loading: false, errorMessage: this.props.errorMessage})
        setTimeout(function() { //Start the timer
            this.setState({ error: false}) //After 1 second
        }.bind(this), 2000)
    }

    setErrorMessage = (text) => {
        this.setState({ error: true, loading: false, errorMessage: text})
                setTimeout(function() { //Start the timer
            this.setState({ error: false}) //After 1 second
        }.bind(this), 2000)
    }


    render() {
        return (
            <div >
                <Header as='h2' textAlign='center'> {this.props.title} </Header>
                <Segment>
                    <Form onSubmit={this.handleSubmit} success={this.state.success} error={this.state.error} loading={this.state.loading}>
                        <Form.TextArea rows={this.props.textRows} style={{ rows: 50 }} label={this.props.label} placeholder={this.props.placeholder} onChange={this.handleChange} />
                        <Message
                            icon='check'
                            success
                            header='OK!'
                            content={this.props.okMessage}
                        />
                        <Message
                            icon='warning'
                            error
                            header='Error!'
                            content={this.state.errorMessage}
                        />
                        <Form.Button>Submit</Form.Button>
                    </Form>
                </Segment>
            </div>
        );
    }
}


export default FileSubmit;

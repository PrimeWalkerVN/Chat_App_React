import React from 'react';
import { Grid, Form, Segment, Button, Header, Message, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import firebase from '../../firebase';
class Login extends React.Component {
    state = {
        email: "",
        password: "",
        errors: [],
        loading: false,
    };

    displayErrors = (errors) => errors.map((error, index) => <p key={index}>{error.message}</p>)

    handleInputError = (errors,inputName) =>{
        return errors.some(error=> error.message.toLowerCase().includes(inputName)) ? 'error' : '';
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }
    handleSubmit = (e) => {
        e.preventDefault();

        if (this.isFormValid(this.state)) {
            this.setState({errors: [], loading: true})
            firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
            .then(signedInUser =>{
                console.log(signedInUser);
            })
            .catch (err =>{
                console.log(err);
                this.setState({
                    errors: this.state.errors.concat(err),
                    loading: false
                })
            })
        }

    }
    isFormValid = ({ email, password}) => email && password;

    render() {
        const { email, password, errors, loading } = this.state;
        return (
            <Grid textAlign="center" verticalAlign="middle" className="app">
                <Grid.Column style={{ maxWidth: 450 }}>
                    <Header as="h1" icon color="teal" text-align="center">
                        <Icon name="wechat" color="teal" />
                        Login for chat app
                    </Header>
                    <Form onSubmit={this.handleSubmit} size="large">
                        <Segment raised>

                            <Form.Input fluid name="email" icon="mail" iconPosition="left" value={email}
                                placeholder="Email Address" type="email" onChange={this.handleChange}
                                className={this.handleInputError(errors,"email") }  />

                            <Form.Input fluid name="password" icon="lock" iconPosition="left" value={password}
                                placeholder="Password" type="password" onChange={this.handleChange} 
                                className={this.handleInputError(errors,"password") }/>


                            <Button disabled={loading} className={loading ? 'loading' : ''} color="teal" fluid size='huge'>Submit</Button>
                        </Segment>
                    </Form>
                    {errors.length > 0 && (
                        <Message error>
                            <h3>Error</h3>
                            {this.displayErrors(errors)}
                        </Message>
                    )}
                    <Message>Don't have account? <Link to="/register">Register</Link></Message>
                </Grid.Column>
            </Grid>
        );
    }
}

export default Login
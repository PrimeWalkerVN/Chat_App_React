import React from 'react';
import { Grid, Form, Segment, Button, Header, Message, Icon} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import firebase from '../../firebase';
import md5 from 'md5';
class Register extends React.Component {
    state = {
        username: "",
        email: "",
        password: "",
        passwordConfirmation: "",
        errors: [],
        loading: false,
        usersRef: firebase.database().ref('users')
    };

    isFormValid = () => {
        let errors = [];
        let error;

        if (this.isFormEmpty(this.state)) {
            error = { message: "Fill in all fields!" };
            this.setState({ errors: [...errors, error] });
            return false;

        } else if (!this.isPasswordValid(this.state)) {
            error = { message: "Password is invalid, must at least 6 characters and match Password Confirmation" };
            this.setState({ errors: [...errors, error] });
            return false;
        } else {
            //form valid
            return true;
        }
    }
    isFormEmpty = ({ username, email, password, passwordConfirmation }) => {
        return !username.length || !email.length || !password.length || !passwordConfirmation.length;
    }
    isPasswordValid = ({ password, passwordConfirmation }) => {
        if (password.length < 6) {
            return false;
        } else if (password !== passwordConfirmation) {
            return false;
        } else return true;
    }
    displayErrors = (errors) => errors.map((error, index) => <p key={index}>{error.message}</p>)

    handleInputError = (errors,inputName) =>{
        return errors.some(error=> error.message.toLowerCase().includes(inputName)) ? 'error' : '';
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }
    handleSubmit = (e) => {
        e.preventDefault();

        if (this.isFormValid()) {
            this.setState({errors: [], loading: true})
            firebase
                .auth()
                .createUserWithEmailAndPassword(this.state.email, this.state.password)
                .then(createdUser => {
                    console.log(createdUser);

                    createdUser.user.updateProfile({
                        displayName: this.state.username,
                        photoURL: `https://gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon`
                    }).then(() =>{
                        this.saveUser(createdUser).then(() => {console.log('user saved')})
                        this.setState({loading: false})
                    }).catch(err =>{
                        console.error(err);
                        this.setState({errors: this.state.errors.concat(err), loading: false});
                    })
                    
                    
                })
                .catch(err => {
                    console.error(err);
                    this.setState({errors: [...this.state.errors,err], loading: false});
                })
        }

    }

    saveUser = createdUser =>{
        return this.state.usersRef.child(createdUser.user.uid).set({
            name: createdUser.user.displayName,
            avatar: createdUser.user.photoURL
        })
    }
    render() {
        const { username, email, password, passwordConfirmation, errors, loading } = this.state;
        return (
            <Grid textAlign="center" verticalAlign="middle" className="app">
                <Grid.Column style={{ maxWidth: 450 }}>
                    <Header as="h1" icon color="blue" text-align="center">
                        <Icon name="comments outline" color="blue" />
                        Register for chat app
                    </Header>
                    <Form onSubmit={this.handleSubmit} size="large">
                        <Segment raised>
                            <Form.Input fluid name="username" icon="user" iconPosition="left" value={username}
                                placeholder="Username" type="text" onChange={this.handleChange} />

                            <Form.Input fluid name="email" icon="mail" iconPosition="left" value={email}
                                placeholder="Email Address" type="email" onChange={this.handleChange}
                                className={this.handleInputError(errors,"email") }  />

                            <Form.Input fluid name="password" icon="lock" iconPosition="left" value={password}
                                placeholder="Password" type="password" onChange={this.handleChange} 
                                className={this.handleInputError(errors,"password") }/>

                            <Form.Input fluid name="passwordConfirmation" icon="repeat" iconPosition="left" value={passwordConfirmation}
                                placeholder="Password Confirmation" type="password" onChange={this.handleChange} 
                                className={this.handleInputError(errors,"password") }/>

                            <Button disabled={loading} className={loading ? 'loading' : ''} color="blue" fluid size='huge'>Submit</Button>
                        </Segment>
                    </Form>
                    {errors.length > 0 && (
                        <Message error>
                            <h3>Error</h3>
                            {this.displayErrors(errors)}
                        </Message>
                    )}
                    <Message>Already a user? <Link to="/login">Login</Link></Message>
                </Grid.Column>
            </Grid>
        );
    }
}

export default Register
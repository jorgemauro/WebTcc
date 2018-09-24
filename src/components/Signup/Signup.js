import React, {Component, Fragment} from "react";
import {Button, TextField, Typography} from "material-ui";
import FirebaseService from "../../services/FirebaseService";
import {urls} from "../../utils/urlUtils";
import {withRouter} from "react-router-dom";

class Signup extends Component {

    state = {
        email: '',
        password: '',
        matricula:'',
        nome:'',
    };
    login = (event) => {
        event.preventDefault();
        const {email} = this.state;
        const {password} = this.state;
        const {matricula} = this.state;
        const {nome} = this.state;
        let objToSubmit = {
            email,
            matricula,
            nome,
            admin:0
        };
        FirebaseService.pushData('users',objToSubmit);
        FirebaseService.login(email, password)
            .then(() => {
                this.props.history.push(urls.home.path);
            })
            .catch(error => {
                alert(error.message);
            });
    };
    createUser = (event) => {
        event.preventDefault();
        const {email} = this.state;
        const {password} = this.state;
        const {matricula} = this.state;
        const {nome} = this.state;
        FirebaseService.createUser(email, password).then(
            (user) => {
                let objToSubmit = {
                    email,
                    matricula,
                    nome,
                    admin:0,
                    uid:user.uid
                };
                FirebaseService.pushNewUser('users',user.uid, objToSubmit);
                this.props.history.push(urls.home.path);
            }
        ).catch(
            (error) => {
                alert(error.message)
            }
        )
    };

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    render = () => {
        return (
            <Fragment>
                <Typography variant="headline" component="h2">Registro</Typography>
                <form onSubmit={this.login}>
                    <TextField className="input-field"
                               type="text"
                               value={this.state.nome}
                               label="Nome"
                               required
                               onChange={this.handleChange('nome')}/>
                    <TextField className="input-field"
                               type="text"
                               value={this.state.matricula}
                               label="Matricula"
                               required
                               onChange={this.handleChange('matricula')}/>
                    <TextField className="input-field"
                               type="email"
                               value={this.state.email}
                               label="email"
                               required
                               onChange={this.handleChange('email')}/>
                    <TextField className="input-field"
                               type="password"
                               value={this.state.password}
                               label="password"
                               required
                               onChange={this.handleChange('password')}/>
                    <Button onClick={this.createUser}
                            style={{marginTop: '20px', display: 'inline-block'}}>
                        Cadastrar
                    </Button>

                </form>
            </Fragment>)
    };
}


export default withRouter(Signup);
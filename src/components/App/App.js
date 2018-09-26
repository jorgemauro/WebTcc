import React, {Component} from 'react';
import './App.css';
import {MuiThemeProvider} from "material-ui/styles/index";
import {Card, CardContent} from "material-ui";
import {createMuiTheme} from 'material-ui/styles';
import red from 'material-ui/colors/red';
import {DataTable} from "../DataTable/DataTable";
import FirebaseService from "../../services/FirebaseService";
import {Route, withRouter} from "react-router-dom";
import {privateUrls, urls} from "../../utils/urlUtils";
import Add from "../Add/Add";
import {Welcome} from "../Welcome/Welcome";
import TopBar from "./TopBar";
import Login from "../Login/Login";
import {connect} from "react-redux";
import {login, logout} from "../../action/actionCreator";
import {compose} from "recompose";
import NavigationWrapper from '../NavigationWrapper/NavigationWrapper';
import NavigationLoggedWrapper from "../NavigationWrapper/NavigationLoggedWrapper";
import Signup from "../Signup/Signup";
import Turma from "../Turma/Turma";
import Perguntas from "../Perguntas/Perguntas";

const theme = createMuiTheme({
    palette: {
        primary: {
            light: '#ffe257',
            main: '#ffb01e',
            dark: '#c78100',
            contrastText: '#FFF',
        },
    },
});

class App extends Component {

    state = {
        turmas: [],
        tipoUser:undefined,
        user:undefined,
    };

    componentDidMount() {
        FirebaseService.onAuthChange(
            (authUser) => this.props.login(authUser),
            () => this.props.logout()
        );
        FirebaseService.getDataList('classes', (dataReceived) => this.setState({turmas: dataReceived}));
        FirebaseService.getUniqueDataBy('users',this.props.userId,(dataReceived) => this.setState({tipoUser: dataReceived.admin}));
    }
    render() {


        return (
            <MuiThemeProvider theme={theme}>

                <React.Fragment>

                    <TopBar/>

                            <Route exact path={urls.login.path}
                                   render={(props) =>
                                       <NavigationLoggedWrapper component={Login} getId={(resp)=>{this.setState({userId:resp})}} {...props}/>}
                            />

                            <Route exact path={urls.singup.path}
                                     render={(props) =>
                                         <NavigationLoggedWrapper component={Signup} {...props}/>}
                        />

                            <Route exact path={urls.home.path}
                                   render={(props) =>
                                       <NavigationWrapper component={Welcome}
                                                          {...props}
                                           uid={this.props.userId}
                                           delete={(node,id)=>{FirebaseService.remove(id,node)}}
                                           verify={this.state.tipoUser}
                                                          turmas={this.state.turmas}
                                       />}
                            />
                            <Route exact path={urls.data.path}
                                   render={(props) =>
                                       <NavigationWrapper component={DataTable}
                                                          {...props}
                                                          verify={this.state.tipoUser}
                                                          data={this.state.data}
                                       />}
                            />
                            <Route exact path={urls.add.path}
                                   render={(props) =>
                                       <NavigationWrapper component={Add}
                                                          verify={this.state.tipoUser}
                                                          {...props}/>}
                            />
                            <Route exact path={privateUrls.edit.path}
                                   render={(props) =>
                                       <NavigationWrapper component={Add}

                                                          verify={this.state.tipoUser}
                                                          {...props}/>}
                            />

                            <Route exact path={urls.turma.path}
                                   render={(props) =>
                                       <NavigationWrapper component={Turma}
                                                          verify={this.state.tipoUser}
                                                          {...props}/>}
                            />
                            <Route exact path={privateUrls.turmaEdit.path}
                                   render={(props) =>
                                       <NavigationWrapper component={Turma}
                                                          verify={this.state.tipoUser}
                                                          {...props}/>}
                            />

                            <Route exact path={privateUrls.perguntas.path}
                                   render={(props) =>
                                       <NavigationWrapper component={Perguntas}
                                                          userId={this.props.userId}
                                                          {...props}/>}
                            />
                </React.Fragment>
            </MuiThemeProvider>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        login: authUser => dispatch(login(authUser)),
        logout: () => dispatch(logout()),
    }
};
const mapStateToProps = state => {
    return {userId: state.userAuth?state.userAuth.uid:undefined}
};

export default compose(
    withRouter,
    connect(mapStateToProps, mapDispatchToProps)
)(App);

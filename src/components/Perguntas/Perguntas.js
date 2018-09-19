import {
    Button,
    TextField,
    Typography,
    Card,
    CardHeader,
    Dialog,
    DialogContent,
    DialogTitle,
    CardContent,
    List,
    ListItem,
    ListItemText
} from "material-ui";
import React, {Component} from "react";
import FirebaseService from "../../services/FirebaseService";
import {urls} from "../../utils/urlUtils";
import {withRouter} from "react-router-dom";


class Perguntas extends Component {
    state = {id: null, idTurma: '', perguntas: [], aluno: '', forum: '', perguntaTemp: '', openDialog: false, resp: []};
    componentWillMount = () => {
        const {id} = this.props.match.params;
        this.setState({idTurma:id})
        if(id){
            FirebaseService.getUniqueDataBy('classes', id, (data) => this.setState({perguntas: data.perguntas}))
        }
        let resp = [];
        this.state.perguntas.forEach((p) => {
            resp.push('')
        });
        this.setState({resp: resp});
        FirebaseService.getUniqueDataBy('forum', this.state.idTurma, (data) => this.setState({...data}));
    };

    submit = (event) => {
        event.preventDefault();

        const {idTurma} = this.state;
        const {perguntas} = this.state;
        const {aluno} = this.state;
        const {forum} = this.state;

        let objToSubmit = {
            idTurma,
            perguntas,
            aluno,
            forum
        };

        if (this.props.match.params.id === undefined) {
            FirebaseService.pushData('classes', objToSubmit);
        } else {
            FirebaseService.updateData(this.props.match.params.id, 'classes', objToSubmit)
        }
    };

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };
    addQuestion = () => {
        let perguntas = this.state.perguntas;
        perguntas.push(this.state.perguntaTemp);
        this.setState({perguntas: perguntas, perguntaTemp: ''});
    };
    handleCloseDialog = () => {
        this.setState({openDialog: false})
    };
    handleChangeResp=index=>event=>{
        let resp=this.state.resp;
        resp[index]=event.target.value;
        this.setState({resp:resp});
    };
    render = () => {
        return (<React.Fragment>
            <Card style={{padding:'2% 5%'}}>
                <Typography variant="headline" component="h2">Questões</Typography>
                <form onSubmit={this.submit}>
                    {this.state.perguntas.map((p, index) =>{
                        console.log(p);
                        return<Card>
                        <CardHeader title={p.pergunta}/>
                        {/*<TextField key={index}*/}
                                                                       {/*className="input-field"*/}
                                                                       {/*type="text"*/}
                                                                       {/*value={this.state.resp[index]}*/}
                                                                       {/*label={p}*/}
                                                                       {/*required*/}
                                                                       {/*onChange={this.handleChangeResp(index)}/>*/}
                    </Card>
                    })
                    }
                    <Button type="submit"
                            style={{marginTop: '20px', display: 'inline-block'}}>
                        Responder
                    </Button>
                </form>
            </Card>
            <Card  style={{padding:'2% 5%', marginTop:'1%', backgroundColor:'#ffb01e', height:'20vh'}}>
                <Typography variant="headline" component="h2">Forum da turma</Typography>
                <Card style={{backgroundColor:'#c78100', height:'15vh', padding:'2% 5%'}}>
                    <div><b>Usuario1:</b>Mensagem</div>
                </Card>
            </Card>
        </React.Fragment>)
    }
}

export default withRouter(Perguntas);
import {
    Button,
    Typography,
    Card,
    CardHeader,
    CardContent,
} from "material-ui";
import {
    List,
    ListItem,} from '@material-ui/core'
import React, {Component} from "react";
import FirebaseService from "../../services/FirebaseService";
import {withRouter} from "react-router-dom";


class Perguntas extends Component {
    state = {id: null, idTurma: '', perguntas: [], aluno: '', forum: '', perguntaTemp: '', openDialog: false, resp: [], selectAns:[]};
    componentWillMount = () => {
        const {id} = this.props.match.params;
        this.setState({idTurma: id});
        if (id) {
            FirebaseService.getUniqueDataBy('classes', id, (data) => {
                let perguntasDefinitivas = data.perguntas;
                perguntasDefinitivas.forEach((p, index) => {
                    let arrayObject=[];
                    let arrayResp = [];
                    p.respostas.forEach((x,i)=>{
                        if(i===p.rAns.split('/')[0]){
                            arrayResp.push({i:i,q:x});
                        }else {
                            arrayObject.push({i: i, q: x});
                        }
                    });
                    let countRespView = p.vAns;
                    arrayObject=this.shuffle(arrayObject);
                    for(let i=0;i<countRespView;i++){
                        arrayResp.push(arrayObject[i]);
                    }
                    arrayResp=this.shuffle(arrayResp);
                    perguntasDefinitivas[index]={...p,respostasView:arrayResp}
                });
                return this.setState({perguntas: perguntasDefinitivas})
            });
            FirebaseService.getUniqueDataBy('respostas/'+id,this.props.userId,(data)=>this.setState({resp:data}))
        }
        FirebaseService.getUniqueDataBy('forum', this.state.idTurma, (data) =>{ this.setState({...data})});
    };
    registraResp=(idx, resp,i)=>{
        let resp1=this.state.resp;
        let selectAns=this.state.selectAns;
        selectAns[idx]=i;
        resp1[idx]=resp+'/'+idx;
        this.setState({selectAns:selectAns});
    };
    shuffle = (o) => {
        for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
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
    handleChangeResp = index => event => {
        let resp = this.state.resp;
        resp[index] = event.target.value;
        this.setState({resp: resp});
    };
    saveAns = ()=>{
        let keyUser=this.props.userId;
        FirebaseService.pushNewResp('respostas',this.state.idTurma,{[keyUser]:this.state.resp});
    };
    render = () => {
        return (<React.Fragment>
            <Card style={{padding: '2% 5%'}}>
                <Typography variant="headline" component="h2">Questões</Typography>
                <form onSubmit={this.submit}>
                    {this.state.perguntas.map((p, index) => {
                        return <Card key={index}>
                            <CardHeader title={p.pergunta}/>
                            <CardContent>
                                <List>
                                    {p.respostasView.map((resp,idx)=>{
                                        return <ListItem selected={this.state.selectAns[index]===idx} key={index+"r"+idx} button onClick={()=>this.registraResp(index,resp.i,idx)}>
                                            {resp.q}
                                        </ListItem>})
                                    }
                                </List>
                            </CardContent>
                        </Card>
                    })
                    }
                    <Button type="submit"
                            style={{marginTop: '20px', display: 'inline-block'}} onClick={()=>this.saveAns()}>
                        Responder
                    </Button>
                </form>
            </Card>
            <Card style={{padding: '2% 5%', marginTop: '1%', backgroundColor: '#ffb01e', height: '20vh'}}>
                <Typography variant="headline" component="h2">Forum da turma</Typography>
                <Card style={{backgroundColor: '#c78100', height: '15vh', padding: '2% 5%'}}>
                    <div><b>Usuario1:</b>Mensagem</div>
                </Card>
            </Card>
        </React.Fragment>)
    }
}

export default withRouter(Perguntas);
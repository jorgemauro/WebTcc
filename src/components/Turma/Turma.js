import {
    Button,
    TextField,
    Typography,
    Card,
    Dialog,
    DialogContent,
    DialogTitle,
    CardContent,
    ExpansionPanel,
    ExpansionPanelActions,
    ExpansionPanelDetails,
    ExpansionPanelSummary,
    List,
    ListItemText
} from "material-ui";
import React, {Component} from "react";
import FirebaseService from "../../services/FirebaseService";
import {urls} from "../../utils/urlUtils";
import {withRouter} from "react-router-dom";
import DeleteIcon from '@material-ui/icons/Delete';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Edit from '@material-ui/icons/Edit';
import Messages from '../Messages/Messages';

class Turma extends Component {

    state = {
        id: null,
        nomeCurso: '',
        perguntas: [],
        professor: '',
        tipo: '',
        selectUpdateQuestion:undefined,
        perguntaTemp:'',
        openDialog:false,
        respViewTemp:'',
        respQuantTemp:'',
        respTemp:['','','',''],
        respCorrect:-1,
        propsOpenSnack:false,
    };

    componentWillMount = () => {
        const {id} = this.props.match.params;
        if (!(id === undefined || !id)) {
            this.setState({id});
            FirebaseService.getUniqueDataBy('classes', id, (data) => this.setState({...data}));
        }

    };

    submit = (event) => {
        event.preventDefault();

        const {nomeCurso} = this.state;
        const {perguntas} = this.state;
        const {professor} = this.state;
        const {tipo} = this.state;

        let objToSubmit = {
            nomeCurso,
            perguntas,
            professor,
            tipo
        };

        if (this.props.match.params.id === undefined) {
            FirebaseService.pushData('classes', objToSubmit).then(()=>this.setState({propsOpenSnack:true}));
        } else {
            FirebaseService.updateData(this.props.match.params.id, 'classes', objToSubmit).then(()=>this.setState({propsOpenSnack:true}));
        }
    };

    handleChange = name => event => {
        if(name!=='')
            this.setState({
                [name]: event.target.value,
            });
    };
    addQuestion=()=>{
        let perguntas=this.state.perguntas;
        if(!this.state.selectUpdateQuestion){
            let ans=[];
            for(let i=0; i<this.state.respViewTemp; i++)
            ans.push('');
            let q={pergunta:this.state.perguntaTemp,respostas:ans,rAns:-1,vAns:this.state.respViewTemp,qAns:this.state.respViewTemp}
            perguntas.push(q);
      }else{
            perguntas[this.state.selectUpdateQuestion].pergunta=this.state.perguntaTemp;
        }
      this.setState({perguntas:perguntas, perguntaTemp:'', propsOpenSnack:true});
    };
    handleCloseDialog=()=>{ this.setState({openDialog:false,selectUpdateQuestion:undefined})};
    removeQuestion=(i)=>{
      let q =this.state.perguntas.splice(1,i);
      this.setState({perguntas:q});
    };
    selectQuestion=(i)=>{
        let pergunta=this.state.perguntas[i];
        this.setState({perguntaTemp:pergunta,selectUpdateQuestion:i});
    };
    handleChangeAns=(x,i)=>(event)=>{
        let questions=this.state.perguntas;
    questions[x].respostas[i]=event.target.value;
    this.setState({perguntas:questions});
    };
    openMessage=()=>{this.setState({propsOpenSnack:false})};
    render = () => {
        return (<React.Fragment>

            <Typography variant="headline" component="h2">Turma</Typography>
            <form onSubmit={this.submit}>
                <TextField className="input-field"
                           type="text"
                           value={this.state.nomeCurso}
                           label="Nome do curso"
                           required
                           onChange={this.handleChange('nomeCurso')}/>

                <TextField className="input-field"
                           type="text"
                           label="Professor"
                           value={this.state.professor}
                           required
                           onChange={this.handleChange('professor')}/>

                <TextField className="input-field"
                           type="text"
                           label="tipo"
                           value={this.state.tipo}
                           required
                           onChange={this.handleChange('tipo')}/>
                <Button type="submit"
                        style={{marginTop: '20px', display: 'inline-block'}}>
                    salvar
                </Button>
                <Card>
                    <div style={{width:'98%',display: 'flex', justifyContent:'flex-end', paddingTop:'5px'}}>
                    <Button variant="raised" size="small" color="primary" onClick={()=>this.setState({openDialog:true})}>
                        Adicionar pergunta
                    </Button>
                    </div>
                    {this.state.perguntas.map((p,i)=>
                        <ExpansionPanel  key={i}>
                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                <div>
                                    <Typography>{i+" - "+p.pergunta}</Typography>
                                </div>
                                <Button onClick={()=>this.removeQuestion(i)} aria-label="Delete" >
                                    <DeleteIcon/>
                                </Button>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                <List>
                                    {p.respostas&&p.respostas.map((x, index)=>{
                                        let c=i;
                                        return<TextField key={"resposta"+index+i} className="input-field"
                                                   type="text"
                                                   fullWidth
                                                   value={p.respostas[index]}
                                                   onChange={this.handleChangeAns(i,index)}
                                        />})}
                                </List>
                            </ExpansionPanelDetails>
                        </ExpansionPanel>)}
                </Card>
            </form>
            <Dialog onClose={this.handleCloseDialog} open={this.state.openDialog} style={{padding:'2% 5%'}}>
                <DialogTitle >Pergunta </DialogTitle>
                <DialogContent style={{maxWidth:'600px'}}>
                    <TextField className="input-field"
                               type="text"
                               label="Coloque sua pergunta"
                               value={this.state.perguntaTemp}
                               onChange={this.handleChange("perguntaTemp")}
                    />
                    <TextField className="input-field"
                               type="text"
                               label="Quantas perguntas devem ser vistas?"
                               value={this.state.respViewTemp}
                               onChange={this.handleChange("respViewTemp")}
                    />
                </DialogContent>
                <Button onClick={()=>{this.addQuestion(); this.handleCloseDialog();}}>Adicionar</Button>
            </Dialog>
            <Messages message="testando" variant="success" handleClose={this.openMessage} open={this.state.propsOpenSnack}/>
        </React.Fragment>)
    }
}

export default withRouter(Turma);
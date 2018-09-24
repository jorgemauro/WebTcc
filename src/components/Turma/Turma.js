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
    ListItemText,
    Switch,
    FormControl,
    FormControlLabel,
    Checkbox,
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
        tipo: false,
        selectUpdateQuestion:undefined,
        perguntaTemp:'',
        openDialog:false,
        respViewTemp:'',
        respQuantTemp:'',
        respCorrect:-1,
        propsOpenSnack:false,
        msg:'salvo',
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
            let idprov=FirebaseService.pushData('classes', objToSubmit);
            if(idprov){
                this.setState({propsOpenSnack:true, id:idprov});
            }
        } else {
            FirebaseService.updateData(this.props.match.params.id, 'classes', objToSubmit);
            this.setState({propsOpenSnack:true});
        }
    };

    handleChange = name => event => {
            this.setState({
                [name]: event.target.value,
            });
    };
    handleChangeChk = name => event => {
        console.log(event.target.checked);
        this.setState({ [name]: event.target.checked });
    };
    addQuestion=()=>{
        let perguntas=this.state.perguntas;
        if(!this.state.selectUpdateQuestion){
            let ans=[];
            for(let i=0; i<this.state.respQuantTemp; i++)
            ans.push('');
            let q={pergunta:this.state.perguntaTemp,respostas:ans,rAns:-1,vAns:this.state.respViewTemp,qAns:this.state.respQuantTemp}
            perguntas.push(q);
      }else{
            perguntas[this.state.selectUpdateQuestion].pergunta=this.state.perguntaTemp;
        }
      this.setState({perguntas:perguntas, perguntaTemp:'', respQuantTemp:'',respViewTemp:'', propsOpenSnack:true});
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
    handleChangeRAns=(i,x)=>{
        let questions=this.state.perguntas;
        questions[x].rAns=i+"/"+x;
        this.setState({perguntas:questions});};
    verifyRAns=(index,i)=>{
        return(this.state.perguntas[index].rAns===i+'/'+index);
    };
    openMessage=()=>{this.setState({propsOpenSnack:false})};
    render = () => {
        console.log(this.props);
        return (this.props.verify?<React.Fragment>

            <Typography variant="headline" component="h2">Turma</Typography>
            <FormControl style={{width:'100%', display:'flex', flexFlow:'column'}}>
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


                <FormControlLabel
                    control={
                <Switch
                           label="tipo"
                           value={this.state.tipo}
                           onChange={this.handleChangeChk('tipo')}
                           color="Primary"
                />}
                    label="Ativo"
                    />
                <Button type="submit"
                        variant="raised"
                        onClick={this.submit}
                        style={{marginTop: '20px', display: 'inline-block', width:'50px', backgroundColor:'#c78100', color:'#ffffff'}}>
                    salvar
                </Button>
                <Card style={{marginTop:'10px'}}>
                    <div style={{width:'98%',display: 'flex', justifyContent:'flex-end', paddingTop:'5px'}}>
                    <Button variant="raised" size="small" color="primary" onClick={()=>this.setState({openDialog:true})}>
                        Adicionar pergunta
                    </Button>
                    </div>
                    {this.state.perguntas.map((p,i)=>
                        <ExpansionPanel  key={i}>
                            <ExpansionPanelSummary style={{display:'flex', justifyContent:'space-between'}} expandIcon={<ExpandMoreIcon />}>
                                <div style={{width:'50%'}}>
                                    <Typography>{i+" - "+p.pergunta}</Typography>
                                </div>
                                <Button onClick={()=>this.removeQuestion(i)} aria-label="Delete" >
                                    <DeleteIcon/>
                                </Button>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                <List style={{width:'100%'}}>
                                    {p.respostas&&p.respostas.map((x, index)=>{
                                        return<div style={{width:'100%', display:'flex'}}><TextField key={"resposta"+index+i} className="input-field"
                                                   type="text"
                                                   fullWidth
                                                   value={p.respostas[index]}
                                                   onChange={this.handleChangeAns(i,index)}
                                        />
                                            <Checkbox
                                                checked={this.verifyRAns(i,index)}
                                                onChange={()=>this.handleChangeRAns(index,i)}
                                                value="checkedA"
                                            />
                                        </div>})}
                                </List>
                            </ExpansionPanelDetails>
                        </ExpansionPanel>)}
                </Card>
            </FormControl>
            <Dialog onClose={this.handleCloseDialog} open={this.state.openDialog} style={{padding:'2% 5%'}}>
                <DialogTitle >Pergunta </DialogTitle>
                <DialogContent style={{minWidth:'500px'}}>
                    <TextField className="input-field"
                               type="text"
                               label="Coloque sua pergunta"
                               value={this.state.perguntaTemp}
                               onChange={this.handleChange("perguntaTemp")}
                    />
                    <TextField className="input-field"
                               type="text"
                               label="Quantas respostas devem ser vistas?"
                               value={this.state.respViewTemp}
                               onChange={this.handleChange("respViewTemp")}
                    />
                    <TextField className="input-field"
                               type="text"
                               label="Quantas vão ser cadastradas?"
                               value={this.state.respQuantTemp}
                               onChange={this.handleChange("respQuantTemp")}
                    />
                </DialogContent>
                <Button onClick={()=>{this.addQuestion(); this.handleCloseDialog();}}>Adicionar</Button>
            </Dialog>
            <Messages message={this.state.msg} variant="success" handleClose={this.openMessage} open={this.state.propsOpenSnack}/>
        </React.Fragment>:<div>Você não tem permissão para isso</div>)
    }
}

export default withRouter(Turma);
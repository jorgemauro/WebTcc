import {urlsMenu} from "../../utils/urlUtils";
import DeleteIcon from '@material-ui/icons/Delete'
import {Card, List,ListItem,ListItemText, ListItemSecondaryAction, Typography,Button,CircularProgress} from "material-ui";
import React from "react";
import {Link} from "react-router-dom";
import FirebaseService from "../../services/FirebaseService";

export const Welcome = (props) => {
    return (
        <React.Fragment>
            <Typography variant="headline" component="h2">Bem vindo!</Typography>
            {
                Object.values(urlsMenu).map((url, index) => {

                    return <Button  key={index} component={props => <Link to={url.path} {...props}/>}>
                        {url.name}
                    </Button>
                })
            }
            {props.turmas&&props.verify===1&&<div style={{width:'100%', display:'flex', justifyContent:'space-around'}}>
            <Card style={{width:'45%', padding:'2% 5%'}}>
                <Typography variant="headline" component="h2">Turmas</Typography>
                {props.turmas &&
                <List>
                    {props.turmas.map((turma) => <ListItem button onClick={()=>{props.history.push("/turma/"+turma.key)}} key={turma.key}>
                        <ListItemText primary={turma.nomeCurso}/>
                        <ListItemSecondaryAction>
                            <Button onClick={()=>props.delete('classes',turma.key)} aria-label="Delete" >
                            <DeleteIcon/>
                            </Button>
                        </ListItemSecondaryAction>
                    </ListItem>)}
                </List>
                }

                <Button variant="flat" color="primary" onClick={()=>props.history.push("/turma")}>Adicionar</Button>
            </Card>
            </div>}
            {props.turmas&&props.verify===0&&<div style={{width:'100%', display:'flex', justifyContent:'space-around'}}>
                <Card style={{width:'100%', padding:'2% 5%'}}>
                    <Typography variant="headline" component="h2">Turmas em inscrição</Typography>
                    {props.turmas &&
                    <List>
                        {props.turmas.map((turma) => turma.tipo?<ListItem button onClick={()=>{props.history.push('/perguntas/'+turma.key)}} key={turma.key}>
                            <ListItemText primary={turma.nomeCurso}/>
                        </ListItem>:'')}
                    </List>
                    }
                </Card>
            </div>}
            {!props.turmas&&<div style={{height:'100vh', width:'100vw',display:'flex',alignItems:'center', justifyContent:'center',backgroundColor:'rgba(0,0,0,0.5)', position:'fixed',zIndex:'99999', top:0,left:0}}>
                <CircularProgress size={100} />
            </div>}
            {}
        </React.Fragment>
    )
};
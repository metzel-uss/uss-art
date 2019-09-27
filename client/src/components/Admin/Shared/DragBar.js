import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import DragIndicator from '@material-ui/icons/DragIndicator';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles(theme => ({
    barWrapper: {
        width: '100%',
        height: '60px',
        backgroundColor: '#f5f5f5',
        border: '1px solid #dbdbdb',
        borderRadius: '4px',
        display: 'flex'
    },
    indicator: {
        color: '#bbb',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: '25px',
        margin: 'auto',
    },
    content: {
        width: '100%',
        height: '49px',
        margin: '5px 50px 5px 33px',
        backgroundColor: '#f5f5f5',
        border: '1px solid #dbdbdb',
        borderRadius: '4px',
        display: 'inline-block',
        flexGrow: '100',
        backgroundImage: 'linear-gradient(#eaeaea, #d4d4d4)',
    },
    barTitle: {
        display: 'inline-block',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: '70px',
        margin: 'auto',
        minWidth: '65px',
        height: '18px',
        textAlign: 'left'
    },
    button: {
        backgroundImage: 'linear-gradient(#fff, #e4e4e4)',
        borderRadius: '5px',
        border: '1px solid #cccccc',
        width:'28px',
        height: '28px',
        display: 'inline-block',
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: '45px',
        margin: 'auto',
    },
    editButton: {
        right: '100px'
    },
    buttonIcon: {
        fontSize: '.85rem',
        marginTop: '-7px',
    },
}));

export const DragBar = props => {
    const {
        itemName,
        setSelect,
        idx
    } = props;

    const classes = useStyles();
    const [isInputText, setInputText] = useState(false);
    const [sectionName, setSectionName] = useState('');

    const swapText = () => {
        setInputText(!isInputText);
        if(sectionName) {
            setSelect(idx, sectionName);
        }
    };

    const handleChange = (e) => {
        setSectionName(e.target.value);
    };

    return (
        <div className={classes.barWrapper}>
            <DragIndicator className={classes.indicator} />
            <div className={classes.content}>
                <div className={classes.barTitle}>
                    {isInputText ?
                            <TextField
                                name="sectionName"
                                id="sectionName"
                                margin="normal"
                                variant="outlined"

                                value={sectionName}
                                onChange={handleChange}
                                onBlur={swapText}
                            />
                        : <Typography variant="caption" onClick={swapText} display="block">{itemName}</Typography>}
                </div>
                <IconButton aria-label="delete" className={`${classes.button} ${classes.editButton}`}>
                    <EditIcon className={classes.buttonIcon} />
                </IconButton>
                <IconButton aria-label="delete" className={classes.button}>
                    <DeleteIcon className={classes.buttonIcon} />
                </IconButton>
            </div>
        </div>
    );
}

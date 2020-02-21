import React from 'react';
import './Templates.css';
// import { ELEMENT_SUB_TYPE } from '../../ElementsPicker';
import { Typography, Button } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { makeStyles } from "@material-ui/core/styles";
import  SearchInput from "../../../../shared/SearchInput";

const useStyles = makeStyles(theme => ({
    mainHeading: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: "space-between",
      alignItems: "center"
    },
    headerContent: {
        padding: 5
    },
    searcstock:{
        padding:"10px",
        boxSizing:"border-box",
        "&:focus": {
          outline:"none",
          boxshadow:"none"
        }
      },
}));

function Templates(props) {
    const classes = useStyles();
    const url = `${process.env.PUBLIC_URL}/static/media/`;
    let images = ["2.jpg", "4.jpg"];

    // let images = [image1, image2, image3];
    images = images.map(img => {
        return (<div key={img}>
            <img src={(url + img)}
                onDragStart={(e) => {
                    e.preventDefault();
                    return false;
                }}
                onMouseDown={props.mouseDownOnElement}
                alt={img}>
            </img>
        </div>)
    });
    
    const handleChange = () => {

    }

    return (
        <React.Fragment>
            <SearchInput 
                handleChange={handleChange}
                placeholder="Search Templates"
            />
            <Typography component="div" className={classes.mainHeading}>
                <Typography className={classes.headerContent} variant="subtitle2">Real Estate</Typography>
                <Button className={classes.headerContent}>All<FontAwesomeIcon className={classes.headerContent} icon={faAngleRight}></FontAwesomeIcon></Button>
            </Typography>
            <div className="template-tray">
                {images}
            </div>
        </React.Fragment>
    );
}

export default Templates;
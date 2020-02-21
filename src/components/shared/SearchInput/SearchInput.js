import React from 'react';
import { TextField,  InputAdornment} from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { makeStyles } from "@material-ui/core/styles";

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
      }
}));

function SearchInput({iconRight, handleChange, customTextFieldProps, customInputProps, placeholder, value, onKeyPress }) {
    const classes = useStyles();
    return (
            <TextField
                  onKeyPress={onKeyPress}
                  className={classes.searcstock}
                  inputProps={{
                    ...customInputProps,
                    style: {
                    padding: 5
                  }}}
                  fullWidth
                  variant="outlined"
                  InputProps={!iconRight ? {
                  startAdornment: (
                      <InputAdornment>
                          <FontAwesomeIcon icon={faSearch} size="sm" />
                      </InputAdornment>
                  )
                  }: 
                  {
                    endAdornment: (
                        <InputAdornment>
                            <FontAwesomeIcon icon={faSearch} size="sm" />
                        </InputAdornment>
                    )
                    }}
                  onChange={handleChange}
                  placeholder={placeholder}
                  {...customTextFieldProps}
                  value={value}
              />
    );
}

export default SearchInput;
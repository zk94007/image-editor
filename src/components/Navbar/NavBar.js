import React from 'react';
import { fade, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Logo from '../../assets/img/logo.png';
import { Avatar, Button, Paper, MenuList } from "@material-ui/core";
import Avtar from '../../assets/img/avtar.png';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { COLORS } from "../../utilities/theme";
import Popper from '@material-ui/core/Popper';
import Grow from '@material-ui/core/Grow';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { VIDEO_EDITOR_URI, DASHBOARD_URI, HOST } from '../../utilities/Utils';
import {
    faQuestionCircle,
    faEdit,
    faAlignLeft,
    faArrowUp,
    faAngleDown,
  } from "@fortawesome/free-solid-svg-icons";

const useStyles = makeStyles(theme => ({
    root: {
        boxShadow: 'none',
        borderBottom: COLORS.border.main
    },
  grow: {
    flexGrow: 1,
  },
  menuButtonIcon: {
    // marginRight: theme.spacing(2),
    fontSize: 14,

  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing(7),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 200,
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  menuButtonText: {
    fontSize: 14,
    textTransform: 'capitalize'
  },
  navButtons:{
    color: 'rgba(0, 0, 0, 0.65)',
    marginRight: 20,
    paddingLeft: 20,
    paddingTop: 21,
    paddingBottom: 20,
    borderRadius: 0,
    '&:hover': {
        color: '#40a9ff'
      }
  },
  email:{
    color: 'rgba(0, 0, 0, 0.65)',
    paddingLeft: 20
  },
  emailContainer: {
      display: "flex",
      alignItems: "center"
  },
  slashStyle: {
    fontSize: 25,
    fontWeight: 100,
  }
}));

export default function PrimarySearchAppBar() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const anchorRef = React.useRef(null);
    const [open, setOpen] = React.useState(false);

  const handleToggle = () => {
    setOpen(true);
  };

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setOpen(false);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = event => {
    setMobileMoreAnchorEl(event.currentTarget);
  };
  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    }
  }
  const handleClose = event => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  const redirectToImageExplore = () => {
    window.location.assign(`${HOST}design-dashboard/explore/banner-template`)
  }

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const getFontAwsome  = (name, rotate) => {
    if(rotate)
    return <FontAwesomeIcon transform={{ rotate }} className={classes.menuButtonIcon} style={{fontSize: 14}} size="sm"  icon={name}
    />
    return <FontAwesomeIcon className={classes.menuButtonIcon} style={{fontSize: 14}} size="sm"  icon={name}
    />
  }
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <Button
            className={classes.navButtons}
            startIcon={getFontAwsome(faQuestionCircle)}
            >
            <Typography variant="caption" className={classes.menuButtonText}>Help</Typography>
        </Button>
      </MenuItem>
    </Menu>
  );

  const SmbText = ({children, type}) => {
    const classes = useStyles();
    return (
      <Typography variant="caption" className={classes[type]}>{children}</Typography>   
      );
  }

  
  return (
    <div className={classes.grow}>
      <AppBar position="relative" color="inherit" className={classes.root}>
        <Toolbar style={{minHeight: 60}}>
            <img alt="logo" src={Logo} width="25" height="25" />
            <Button
                className={classes.navButtons}
                startIcon={getFontAwsome(faArrowUp, 45)}
                onClick={() => {
                  window.location.assign(DASHBOARD_URI)
                }
                }
                >
                <Typography variant="caption" className={classes.menuButtonText}>Publish</Typography>
            </Button>
            <Button
                className={classes.navButtons}
                ref={anchorRef}
                aria-controls={open ? 'menu-list-grow' : undefined}
                aria-haspopup="true"
                onMouseOver={handleToggle}
                onMouseOut={handleMenuClose}
                startIcon={getFontAwsome(faEdit)}
                onClick={()=> window.location.assign(`${HOST}design-dashboard`)}
                endIcon={getFontAwsome(faAngleDown)
            }><Typography variant="caption" className={classes.menuButtonText}>Design</Typography></Button>
                <Popper  onMouseOver={handleToggle} onMouseOut={handleMenuClose} open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
                    {({ TransitionProps, placement }) => (
                    <Grow
                    {...TransitionProps}
                    style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                    >
                    <Paper>
                        <ClickAwayListener onClickAway={handleClose}>
                            <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                                <MenuItem disabled><SmbText>Image Editor</SmbText></MenuItem>
                                <MenuItem onClick={()=>{ window.location.assign(VIDEO_EDITOR_URI)}}><SmbText>Video Editor</SmbText></MenuItem>
                            </MenuList>
                        </ClickAwayListener>
                    </Paper>
                    </Grow>
                )}
                </Popper>
            <Button
                className={classes.navButtons}
                startIcon={getFontAwsome(faAlignLeft, 180)}
                onClick={()=> window.location.assign(`${HOST}dashboard/analytics`)}
            >
            <Typography variant="caption" className={classes.menuButtonText}>Analyze</Typography>
            </Button>
          <div className={classes.grow} />
            <div className={classes.sectionDesktop}>
                <Button
                    className={classes.navButtons}
                    startIcon={getFontAwsome(faQuestionCircle)}
                    >
                    <Typography variant="caption" 
                    className={classes.menuButtonText}
                    >Help</Typography>
                </Button>
                <Typography className={classes.emailContainer} component="div">
                    <Typography className={classes.slashStyle} >|</Typography> 
                    <Typography variant="caption" className={classes.email}>test.user@gmail.com</Typography> 
                </Typography>
                <IconButton
                    edge="end"
                    aria-label="account of current user"
                    aria-controls={menuId}
                    aria-haspopup="true"
                    color="inherit"
                >
                    <Avatar alt="Remy Sharp" src={Avtar} className={classes.avatar} />
                </IconButton>
            </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <Avatar alt="Remy Sharp" src={Avtar} className={classes.avatar} />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </div>
  );
}

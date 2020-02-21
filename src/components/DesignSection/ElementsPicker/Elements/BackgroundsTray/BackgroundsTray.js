import React from 'react';
import './BackgroundsTray.css';
import { ELEMENT_SUB_TYPE } from '../../ElementsPicker';
import { Typography, Button } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faAngleLeft, faPalette } from '@fortawesome/free-solid-svg-icons';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import { ELEMENT_TRAY_TYPE } from '../../../ElementsPicker/ElementsPicker';

const styles = {
    mainHeading: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: "space-between",
      alignItems: "center"
    },
    searcstock: {
        padding:"10px",
        boxSizing:"border-box",
        "&:focus": {
          outline:"none",
          boxshadow:"none"
        }
      },
    textLeft: {
        textAlign: 'left'
    },
    container: {
        padding: 10
    }
}

let imags = ["2.jpg", "4.jpg", "6.jpg", "8.jpg", "10.jpg", "11.jpg", "12.jpg", "13.jpg", "14.jpg", "1.jpg", "5.jpg", "15.jpg"];
const url = "/static/media/";
class BackgroundsTray extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            currentIndex: 0,
            itemsInSlide: 1,
            responsive: {
                400: { items: 6 },
                600: { items: 6 },
                1024: {
                    items: 6
                } },
            categoryItems: this.categoryItems(),
            images: [],
            query: ''
        }
    }

    colors = ['palette', '#d8d8d8', '#000000', '#D14628', '#DB2727', '#32DB27', '#117A0A', '#0C0A7A', '#7A720A', '#7A0A4A', '#7A0A29', '#6EA456'];

    slidePrevPage = () => {
        const { currentIndex, itemsInSlide } = this.state;
        const newcurrentIndex = currentIndex - itemsInSlide;
        this.setState({
            currentIndex: newcurrentIndex,
        })
    }

    categoryItems = () => this.colors.map(color => {
        if (color === 'palette') {
            return (<div key={color} onClick={() => this.props.handleElementClick(ELEMENT_TRAY_TYPE.BACKGROUND_COLOR_PICKER)} style={{
                width: '80%', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                border: 'solid #000 1px',
                borderRadius: 5,
                height: 30,
                color: '#000',
                backgroundColor: '#fff'
                }}>
                    <FontAwesomeIcon icon={faPalette} size={"1x"} />
            </div>)
        }  else if (color === 'currentColor') {
            return (<div key={color} onClick={() => this.setBackgroundColor(this.props.backgroundColor)} style={{
                width: '80%', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                borderRadius: 5,
                height: 30, 
                backgroundColor: this.props.backgroundColor}}>
            </div>)
        }  else {
            return (<div key={color} onClick={() => this.setBackgroundColor(color)} style={{
                width: '80%', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                borderRadius: 5,
                height: 30, 
                backgroundColor: color}}>
            </div>)
        }
    });

    handleOnSlideChange = (event) => {
        const { itemsInSlide, item } = event
        this.setState({ itemsInSlide, currentIndex: item })
    }

    slideNextPage = () => {
        const { currentIndex, itemsInSlide, categoryItems: { length } } = this.state;
        let currentIndexn = currentIndex + itemsInSlide
        if (currentIndexn > length)
            currentIndexn = length;
        this.setState({ currentIndex: currentIndexn });
    }

    setBackgroundColor = (color) => {
        // let layer = [...this.props.layer];
        // if (layer[0].type === 'Image') {
        //     layer.splice(0, 1);
        //     this.props.setLayer(layer);
        // }
        // this.props.setBackgroundColor(color);
    }

    render(){
        const { currentIndex, responsive } = this.state;

        let images = imags.map(img => {
            return (<div key={img} onClick={() => this.props.handleAddElement({
                type: "Image",
                subType: ELEMENT_SUB_TYPE.BACKGROUND_IMAGE,
                value: (url + img)
            })}>
                <img src={(url + img)} 
                    onDragStart={(e) => {
                        e.preventDefault();
                        return false;
                    }}
                    alt={img} 
                />
            </div>)
        });
        return(
            <React.Fragment>
                <Typography component="div" style={styles.container}>
                    <div className="category-tray">
                        {this.state.currentIndex !== 0 &&
                        <Button style={{minWidth: 15}} aria-label="add" onClick={this.slidePrevPage} >
                            <FontAwesomeIcon icon={faAngleLeft} />
                        </Button>}
                        <AliceCarousel
                            items={this.state.categoryItems}
                            responsive={responsive}
                            slideToIndex={currentIndex}
                            onInitialized={this.handleOnSlideChange}
                            onSlideChanged={this.handleOnSlideChange}
                            onResized={this.handleOnSlideChange}
                            disableAutoPlayOnAction
                            buttonsDisabled
                            dotsDisabled
                            swipeDisabled
                        />
                        {this.state.currentIndex + this.state.itemsInSlide < this.colors.length &&
                        <Button style={{minWidth: 15}} onClick={this.slideNextPage}>
                            <FontAwesomeIcon icon={faAngleRight} />
                        </Button>}
                    </div>
                </Typography>
                <div className="photos-tray">
                    {images}
                </div>
            </React.Fragment>
        )
    }
}

export default BackgroundsTray;
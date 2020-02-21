import React from 'react';
import './PhotosTray.css';
import { ELEMENT_SUB_TYPE } from '../../ElementsPicker';
import SearchInput from "../../../../shared/SearchInput";
import { Typography, Button, Fab } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import { searchPexelImages, searchPixabayImages, searchUnsplashImages }  from '../../../../../utilities/services/api';

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

let imags = ["2.jpg", "4.jpg", "6.jpg", "8.jpg", "10.jpg", "11.jpg", "12.jpg", "13.jpg", "14.jpg", "1.jpg", "5.jpg"];
const url = `${process.env.PUBLIC_URL}/static/media/`;
class PhotosTray extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            currentIndex: 0,
            itemsInSlide: 1,
            responsive: {
                500: { items: 1 },
                600: { items: 2 },
                1024: {
                    items: 3
                } },
            categoryItems: this.categoryItems(),
            images: [],
            query: ''
        }
    }

    slidePrevPage = () => {
        const { currentIndex, itemsInSlide } = this.state;
        const newcurrentIndex = currentIndex - itemsInSlide;
        this.setState({
            currentIndex: newcurrentIndex,
        })
    }

    categoryItems = () => imags.map(img => {
        return (<div key={img} style={{width: '90%', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: 5, height: 40, backgroundImage: `url(${(url + img )}` }}>
                <span style={{color: '#fff'}}>Category</span>
        </div>)
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

    handleChangeInput = (e, val) => {
       this.setState({
           query: e.target.value,
       })
    }

    onKeyPress = (e) => {
        if (e.key === 'Enter') {
            searchPexelImages(this.state.query).then(data => {
                let pixelImages = data.map(val => {
                    return {
                        id: val.id,
                        previewURL: val.src.small,
                        largeImageURL: val.src.large
                    }                                  
                });
                this.setState({ images: pixelImages},
                () => {
                    searchPixabayImages(this.state.query).then(pixaData => {
                        this.setState({ images: [...this.state.images, ...pixaData]},
                            () => {
                                searchUnsplashImages(this.state.query).then(UnsplashData => {
                                    console.log(UnsplashData, 'jkhjkhjk')
                                    let finalUnsplash = UnsplashData.map(val => {
                                        return {
                                            previewURL: val.urls.thumb,
                                            largeImageURL: val.urls.full
                                        }                                  
                                    });
                                    this.setState({ images: [...this.state.images, ...finalUnsplash]});
                                });
                            })
                    // })
                });
            });
        })
    }
    }

    renderQueryImages = (img, index) => 
    {
    return (<div key={img.id || img.largeImageURL} onClick={() => this.props.handleAddElement({
        type: "Image",
        subType: ELEMENT_SUB_TYPE.IMAGE,
        value: img.largeImageURL
    })}>
        <img src={img.previewURL}
            onDragStart={(e) => {
                e.preventDefault();
                return false;
            }}
            onMouseDown={this.props.mouseDownOnElement}
            alt={img.user}>
        </img>
    </div>);
    }

    render(){
        const { currentIndex, responsive } = this.state;
       
       
        return(
            <React.Fragment>
                <SearchInput
                    onKeyPress={this.onKeyPress}
                    handleChange={this.handleChangeInput}
                    placeholder="Search Photos"
                />
                <Typography component="div" style={styles.container}>
                    <Typography component="div" style={styles.mainHeading}>
                        <Typography variant="subtitle2">Categories</Typography>
                        <Button >All<FontAwesomeIcon icon={faAngleRight}></FontAwesomeIcon></Button>
                    </Typography>
                    <div className="category-tray">
                        <Button style={{minWidth: 15}} aria-label="add" onClick={this.slidePrevPage} >
                            <FontAwesomeIcon onClick={this.slidePrevPage} icon={faAngleLeft} />
                        </Button>
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
                        <Button style={{minWidth: 15}} onClick={this.slideNextPage}>
                            <FontAwesomeIcon icon={faAngleRight} />
                        </Button>
                    </div>
                    <Typography component="div" style={styles.textLeft}>
                        <Typography variant="subtitle2">Trending</Typography>
                    </Typography>
                </Typography>
        
                <div className="photos-tray">
                {this.state.images.map(img => this.renderQueryImages(img))}
                </div>
            </React.Fragment>
        )
    }
}

export default PhotosTray;
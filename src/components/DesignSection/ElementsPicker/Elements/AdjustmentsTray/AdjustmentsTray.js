import React from 'react';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Konva from 'konva';
import './AdjustmentTray.scss';

function ValueLabelComponent(props) {
    const { children, open, value } = props;

    const popperRef = React.useRef(null);
    React.useEffect(() => {
        if (popperRef.current) {
            popperRef.current.update();
        }
    });

    return (
        <Tooltip
            PopperProps={{
                popperRef,
            }}
            open={open}
            enterTouchDelay={0}
            placement="top"
            title={value}
        >
            {children}
        </Tooltip>
    );
}

function SettingsTray(props) {
    const { shapeRef, stageRef, setLayer, layer } = props;
    const attrs = shapeRef.current.attrs;

    const [brightness, setBrightness] = React.useState(attrs.brightness ? attrs.brightness : 50);
    const [contrast, setContrast] = React.useState(attrs.contrast ? attrs.contrast : 50);
    const [saturation, setSaturation] = React.useState(attrs.saturation ? attrs.saturation : 50);
    const [tint, setTint] = React.useState(attrs.tint ? attrs.tint : 50);
    const [blur, setBlur] = React.useState(attrs.blur ? attrs.blur : 0);
    const [xprocess, setXprogress] = React.useState(attrs.xprocess ? attrs.xprocess : 50);
    // const [vignette, setVignette] = React.useState(attrs.vignette ? attrs.vignette : 0);

    const resetEffect = () => {
        setBrightness(50);
        setContrast(50);
        setSaturation(50);
        setTint(50);
        setBlur(0);
        setXprogress(50);
        // setVignette(0);
        shapeRef.current.clearCache();
        shapeRef.current.draw();
        stageRef.current.draw();
    }

    const renderImage = (key, value) => {
        if (!shapeRef || !shapeRef.current || shapeRef.current.attrs.subType !== 'IMAGE' || shapeRef.current.attrs.locked) {
            return;
        }

        const layerIndex = layer.findIndex(l => l.id === shapeRef.current.attrs.id);
        let copyLayers = [...layer];
        let copyLayer = { ...copyLayers[layerIndex] };

        shapeRef.current.clearCache();
        const filter = Konva.Filters;
        let filters = [filter.Brighten, filter.Contrast, filter.HSL, customXprogressFilter(xprocess * 0.01 - 0.5)];
        if (key === 'bl' && value > 1 || blur > 1) {
            filters.push(filter.Blur);
        }
        shapeRef.current.filters(filters);
        shapeRef.current.cache();
        if (key === 'br') {
            shapeRef.current.brightness(value * 0.016 - 0.8);
            setBrightness(value);
            copyLayer.brightness = value;
        }
        if (key === 'co') {
            shapeRef.current.contrast(value * 2 - 100);
            setContrast(value);
            copyLayer.contrast = value;
        }
        if (key === 'sa') {
            shapeRef.current.saturation(value * 0.02 - 1);
            setSaturation(value);
            copyLayer.saturation = value;
        }
        if (key === 'ti') {
            shapeRef.current.hue(value * 3.6 - 180);
            setTint(value);
            copyLayer.tint = value;
        }
        if (key === 'bl') {
            shapeRef.current.blurRadius(value * 0.1); 
            setBlur(value);
            copyLayer.blur = value;
        }
        if (key === 'xp') {
            customXprogressFilter(value * 0.01 - 0.5);
            setXprogress(value);
            copyLayer.xprocess = value;
        }
        // if (key === 'vi') {
        //     createVignette();
        //     setVignette(value);
        //     copyLayer.vignette = value;
        // }
        shapeRef.current.draw();
        stageRef.current.draw();

        copyLayers[layerIndex] = copyLayer;
        // setLayer(copyLayers);
    }    

    const customXprogressFilter = (val) => {
        return (image) => {
            let data = image.data,
                nPixels = data.length,
                i, r, g, b;

            for (i = 0; i < nPixels; i += 4) {
                r = data[i + 0];
                g = data[i + 1];
                b = data[i + 2];

                data[i + 0] = Math.min(255, r * (0.393 + 0.607 * (1 - val)) + g * 0.769 * val + b * 0.189 * val);
                data[i + 1] = Math.min(255, r * 0.349 * val + g * (0.686 + 0.314 * (1 - val)) + b * 0.168 * val);
                data[i + 2] = Math.min(255, r * 0.272 * val + g * 0.534 * val + b * (0.131 + 0.869 * (1 - val)));
            }
        };
    }

    // const createVignette = () => {
    //     shapeRef.current.fillRadialGradientStartPoint({ x: 0, y: 0 });
    //     shapeRef.current.fillRadialGradientStartRadius(50);
    //     shapeRef.current.fillRadialGradientEndRadius(500);
    //     shapeRef.current.fillRadialGradientColorStops([0, 'red', 0.5, 'yellow', 1, 'blue']);
    // }

    return (
        <React.Fragment>
            <Typography component="div" className="adjustment-header">
                <Typography variant="subtitle2"> Adjustments </Typography>
                <Button color="primary" onClick={resetEffect}> Reset </Button>
            </Typography>
            <Divider />
            <div className="adjustment-container">
                <Grid container spacing={2} >
                    <Grid item sm={4}>
                        <Typography variant="subtitle2"> Brightness </Typography>
                    </Grid>
                    <Grid item sm={6}>
                        <div className="adjustment-slider">
                            <Slider
                                ValueLabelComponent={ValueLabelComponent}
                                aria-label="custom thumb label"
                                defaultValue={brightness}
                                className="range"
                                onChange={(e, value) => { renderImage('br', value) }}
                                value={brightness}
                            />
                        </div>
                    </Grid>
                    <Grid item sm={2}>
                        <Typography variant="subtitle2"> {brightness} </Typography>
                    </Grid>
                </Grid>
                <Grid container spacing={2} >
                    <Grid item sm={4}>
                        <Typography variant="subtitle2"> Contrast </Typography>
                    </Grid>
                    <Grid item sm={6}>
                        <div className="adjustment-slider">
                            <Slider
                                ValueLabelComponent={ValueLabelComponent}
                                aria-label="custom thumb label"
                                defaultValue={contrast}
                                className="range"
                                onChange={(e, value) => { renderImage('co', value) }}
                                value={contrast}
                            />
                        </div>
                    </Grid>
                    <Grid item sm={2}>
                        <Typography variant="subtitle2"> {contrast} </Typography>
                    </Grid>
                </Grid>
                <Grid container spacing={2} >
                    <Grid item sm={4}>
                        <Typography variant="subtitle2"> Saturation </Typography>
                    </Grid>
                    <Grid item sm={6}>
                        <div className="adjustment-slider">
                            <Slider
                                ValueLabelComponent={ValueLabelComponent}
                                aria-label="custom thumb label"
                                defaultValue={saturation}
                                className="range"
                                onChange={(e, value) => { renderImage('sa', value) }}
                                value={saturation}
                            />
                        </div>
                    </Grid>
                    <Grid item sm={2}>
                        <Typography variant="subtitle2"> {saturation} </Typography>
                    </Grid>
                </Grid>
                <Grid container spacing={2} >
                    <Grid item sm={4}>
                        <Typography variant="subtitle2"> Tint </Typography>
                    </Grid>
                    <Grid item sm={6} className="hue-slider-pro">
                        <div className="adjustment-slider hue-slider">
                            <Slider
                                ValueLabelComponent={ValueLabelComponent}
                                aria-label="custom thumb label"
                                defaultValue={tint}
                                className="range"
                                onChange={(e, value) => { renderImage('ti', value) }}
                                value={tint}
                            />
                        </div>
                    </Grid>
                    <Grid item sm={2}>
                        <Typography variant="subtitle2"> {tint} </Typography>
                    </Grid>
                </Grid>
                <Grid container spacing={2} >
                    <Grid item sm={4}>
                        <Typography variant="subtitle2"> Blur </Typography>
                    </Grid>
                    <Grid item sm={6}>
                        <div className="adjustment-slider">
                            <Slider
                                ValueLabelComponent={ValueLabelComponent}
                                aria-label="custom thumb label"
                                defaultValue={blur}
                                className="range"
                                onChange={(e, value) => { renderImage('bl', value) }}
                                value={blur}
                            />
                        </div>
                    </Grid>
                    <Grid item sm={2}>
                        <Typography variant="subtitle2"> {blur} </Typography>
                    </Grid>
                </Grid>
                <Grid container spacing={2} >
                    <Grid item sm={4}>
                        <Typography variant="subtitle2"> X-Process </Typography>
                    </Grid>
                    <Grid item sm={6}>
                        <div className="adjustment-slider">
                            <Slider
                                ValueLabelComponent={ValueLabelComponent}
                                aria-label="custom thumb label"
                                defaultValue={xprocess}
                                className="range"
                                onChange={(e, value) => { renderImage('xp', value) }}
                                value={xprocess}
                            />
                        </div>
                    </Grid>
                    <Grid item sm={2}>
                        <Typography variant="subtitle2"> {xprocess} </Typography>
                    </Grid>
                </Grid>
                {/* <Grid container spacing={2} >
                    <Grid item sm={4}>
                        <Typography variant="subtitle2"> Vignette </Typography>
                    </Grid>
                    <Grid item sm={6}>
                        <div className="adjustment-slider">
                            <Slider
                                ValueLabelComponent={ValueLabelComponent}
                                aria-label="custom thumb label"
                                defaultValue={vignette}
                                className="range"
                                onChange={(e, value) => { renderImage('vi', value) }}
                                value={vignette}
                            />
                        </div>
                    </Grid>
                    <Grid item sm={2}>
                        <Typography variant="subtitle2"> {vignette} </Typography>
                    </Grid>
                </Grid> */}
            </div>
        </React.Fragment>
    );
}

export default SettingsTray;
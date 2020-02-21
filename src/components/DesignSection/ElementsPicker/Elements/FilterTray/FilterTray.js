import React from 'react'
import Typography from '@material-ui/core/Typography';
import './FilterTray.scss';
import Konva from 'konva';

const defaultEffects = [
  'None', 'Grayscale', 'Whimsical', 'Peony', 'Summer', 'Retro', 'Blue', 'Selfie'
];

export default function FilterTray(props) {
  console.log(props);
  const { shapeRef, stageRef } = props;

  const handleEffect = (effect) => {
    if (!shapeRef || !shapeRef.current || shapeRef.current.attrs.subType !== 'IMAGE' || shapeRef.current.attrs.locked) {
      return;
    }
    shapeRef.current.clearCache();
    switch (effect) {
      case 'None':
        shapeRef.current.filters([]);
        break;
      case 'Grayscale':
        shapeRef.current.filters([Konva.Filters.Grayscale]);
        break;
      case 'Whimsical':
        shapeRef.current.filters([Konva.Filters.RGBA]);
        shapeRef.current.red(233);
        shapeRef.current.green(140);
        shapeRef.current.blue(58);
        shapeRef.current.alpha(0.3);
      break;
      case 'Peony':
        shapeRef.current.filters([Konva.Filters.RGBA]);
        shapeRef.current.red(106);
        shapeRef.current.green(13);
        shapeRef.current.blue(173);
        shapeRef.current.alpha(0.3);
      break;
      case 'Summer':
        shapeRef.current.filters([Konva.Filters.RGBA]);
        shapeRef.current.red(51);
        shapeRef.current.green(204);
        shapeRef.current.blue(255);
        shapeRef.current.alpha(0.3);
      break;
      case 'Retro':
        shapeRef.current.filters([Konva.Filters.RGBA]);
        shapeRef.current.red(0);
        shapeRef.current.green(255);
        shapeRef.current.blue(255);
        shapeRef.current.alpha(0.3);
      break;
      case 'Blue':
        shapeRef.current.filters([Konva.Filters.RGBA]);
        shapeRef.current.red(0);
        shapeRef.current.green(35);
        shapeRef.current.blue(102);
        shapeRef.current.alpha(0.3);
      break;
      case 'Selfie':
        shapeRef.current.filters([Konva.Filters.RGBA]);
        shapeRef.current.red(226);
        shapeRef.current.green(205);
        shapeRef.current.blue(109);
        shapeRef.current.alpha(0.3);
      break;
      default:
        break;
    }

    shapeRef.current.cache();
    shapeRef.current.draw();
    stageRef.current.draw();
  }
  
  return (
    <div>
      <Typography variant="subtitle1" style={{textAlign: 'left', paddingLeft: 10, paddingTop: 20, paddingRight: 10, paddingBottom: 20}}>Filters</Typography>
      {
        defaultEffects.map((effect, index) => {
          return <div key={index} style={{width: 69, display: 'block', float: 'left'}}>
                    <button key={index} className="colorButton" onClick={() => handleEffect(effect)} style={{marginTop: 20}}>
                      <img src={`/static/media/balloon${effect}.png`} style={{width: 60, height: 60, position: 'relative', left: -6}}/>
                    </button>
                    <Typography variant="subtitle2" style={{fontSize: '0.7em'}}>{effect}</Typography>
                 </div>
        })
      }
    </div>
  );
}

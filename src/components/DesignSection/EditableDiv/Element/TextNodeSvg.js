import { select } from 'd3';

export function getTextSVG(html, width, height) {
  const svg = createSvgPlaceHolder(width, height);
  let style = svg.append('style')
    .attr('type', 'text/css');
  style.text(getStyle());

  var fo = svg.append('foreignObject');
  fo.attr('width', '100%');
  fo.attr('height', '100%');
  // fo.style('white-space', 'pre-wrap');
  fo.html(prepareHtmlForSVG(html));

  var DOMURL = window.URL || window.webkitURL || window;

  var generatedSVG = new Blob([svg.node().parentNode.innerHTML], {
    type: 'image/svg+xml;charset=utf-8'
  });

  removeD3Svg(svg);

  var url = DOMURL.createObjectURL(generatedSVG);
  return url;
}

const removeD3Svg = (svg) => {
  svg.node().parentNode.remove();
}

export const prepareHtmlForSvg = (html) => {
  if (!html) {
    return '';
  }
  return html.replace(/&nbsp;\\*/g, "<span style='visibility: hidden'>-</span>").replace(/<br>\\*/g, "<span style='visibility: hidden'>-</span>");
}


const getStyle = () => {
  return `
    div.ql-editor p {
            padding: 0px; 
            margin: 0px;
            white-space: pre-wrap;
        }
        div.ql-editor ul, div.ql-editor ol {
          padding-top: 0px; 
          margin-top: 0px;
          margin-left: 0px;
          margin-bottom: 0px;
          padding-left: 0.5em;
        }
        div.ql-editor ul li, div.ql-editor ol li {
          padding-left: 0px;
          margin-left: 1em;
        }
        div.ql-editor ul li:before, div.ql-editor ol li:before {
          padding-left: 0px;
          margin-right: 0;
        }
        div.ql-editor ol {
          counter-reset: item;
          list-style-type: none;
        }

        div.ql-editor ol li {
          display: block;
        }

        div.ql-editor ol li:before {
          content: counter(item) ".";
          counter-increment: item;
          letter-spacing: 0.2em;
          position: absolute;
          left: 0;
        }

        div.ql-editor .ql-align-right {
          text-align: right;
        }
        div.ql-editor .ql-align-center {
          text-align: center;
        }
        div.ql-editor .ql-align-justify {
          text-align: justify;
          white-space: normal;
        }
    `
}

const createSvgPlaceHolder = (width, height) => {
  const svg = select('body')
    .append('div')
    .append('svg')
    .attr("width", width)
    .attr("height", height)
    .attr("xmlns", "http://www.w3.org/2000/svg");

  return svg;
}

const prepareHtmlForSVG = (html) => {
  return html.replace(/<br>\\*/g, "<span style='visibility: hidden'>-</span>");
}
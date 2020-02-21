import { Component } from 'react';
import ReactDom from 'react-dom';

const portalRoot = document.getElementById('portal');

class Portal extends Component {
  constructor() {
    super();
    this.el = document.createElement('div');
  }

  componentDidMount() {
    portalRoot.appendChild(this.el);
  }

  componentWillUnmount() {
    portalRoot.removeChild(this.el);
  }

  render() {
    return (
      ReactDom.createPortal(this.props.children, this.el)
    );
  }
}

export default Portal;

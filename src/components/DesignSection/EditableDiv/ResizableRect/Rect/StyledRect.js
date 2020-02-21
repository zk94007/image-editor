import styled from 'styled-components'

export default styled.div`
  position: absolute;

  .square {
    position: absolute;
    width: 10px;
    height: 10px;
    background: white;
    border: 1px solid #14a7fd;
    border-radius: 5px;
    z-index: 2;
  }

  .resizable-handler {
    position: absolute;
    width: 14px;
    height: 14px;
    cursor: pointer;
    z-index: 3;

    &.tl,
    &.t,
    &.tr {
      top: -7px;
    }

    &.tl,
    &.l,
    &.bl {
      left: -7px;
    }

    &.bl,
    &.b,
    &.br {
      bottom: -7px;
    }

    &.br,
    &.r,
    &.tr {
      right: -7px;
    }

    &.l,
    &.r {
      margin-top: -7px;
    }

    &.t,
    &.b {
      margin-left: -7px;
    }
  }

  .rotate {
    position: absolute;
    left: 50%;
    top: -26px;
    width: 18px;
    height: 18px;
    margin-left: -9px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }

  .t,
  .tl,
  .tr {
    top: -5px;
  }

  .b,
  .bl,
  .br {
    bottom: -5px;
  }

  .r,
  .tr,
  .br {
    right: -5px;
  }

  .tl,
  .l,
  .bl {
    left: -5px;
  }

  .l,
  .r {
    top: 50%;
    margin-top: -5px;
  }

  .t,
  .b {
    left: 50%;
    margin-left: -5px;
  }
`

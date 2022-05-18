import React from "react";
import styled from "styled-components";

const Button = (props) => {
  const {
    text,
    _onClick,
    is_float,
    is_delete,
    is_close,
    children,
    margin,
    width,
    padding,
    border,
    right,
    bold,
    bg,
    border_right,
  } = props;

  const styles = {
    margin: margin,
    width: width,
    padding: padding,
    border: border,
    bold: bold,
    right: right,
    bg: bg,
    border_right: border_right,
  };
  if (is_float) {
    return (
      <React.Fragment>
        <FloatButton onClick={_onClick}>{text ? text : children}</FloatButton>
      </React.Fragment>
    );
  }
  if (is_delete) {
    return (
      <React.Fragment>
        <DeleteButton {...styles} onClick={_onClick}>
          {text ? text : children}
        </DeleteButton>
      </React.Fragment>
    );
  }

  if (is_close) {
    return (
      <React.Fragment>
        <CloseButton {...styles} onClick={_onClick}>
          {text ? text : children}
        </CloseButton>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <ElButton {...styles} onClick={_onClick}>
        {text ? text : children}
      </ElButton>
    </React.Fragment>
  );
};

Button.defaultProps = {
  text: false,
  children: null,
  _onClick: () => {},
  is_float: false,
  margin: false,
  width: "100%",
  padding: "12px 0px",
  border: false,
  bg: false,
};

const ElButton = styled.button`
  width: 342px;
  height: 54px;
  background: #5796f7;
  background: ${(props) => props.bg};
  color: white;
  font-weight: bold;
  padding: ${(props) => props.padding};
  box-sizing: border-box;
  border: none;
  border-radius: 5px;
  ${(props) => (props.margin ? `margin: ${props.margin};` : "")}
  ${(props) => (props.right ? `float: right` : "")} /* &:hover {
    box-shadow: 0px 0px 5px 0px gray;
  }
  font-family: "Cafe24Ohsquareair"; */
`;

const FloatButton = styled.button`
  width: 50px;
  height: 50px;
  background-color: #5796f7;
  color: #525e75;
  box-sizing: border-box;
  font-size: 36px;
  font-weight: 800;
  position: fixed;
  bottom: 100px;
  right: 25px;
  text-align: center;
  vertical-align: middle;
  border: none;
  border-radius: 50px;
  z-index: 1000;
`;

const DeleteButton = styled.button`
  width: 57px;
  height: 32px;
  background-color: #fff;
  box-sizing: border-box;
  font-size: 16px;
  font-weight: 800;
  position: fixed;
  top: 25px;
  left: 320px;
  text-align: center;
  border: none;
`;

const CloseButton = styled.button`
  width: auto;
  height: 22px;
  background-color: #fff;
  box-sizing: border-box;
  font-size: 16px;
  text-align: center;
  border: none;
  ${(props) => (props.margin ? `margin: ${props.margin};` : "")}
  border-right: ${(props) => props.border_right}
`;

export default Button;

import React from "react";
import styled from "styled-components";
import { KAKAO_AUTH_URL, GOOGLE_AUTH_URL } from "../../shared/OAuth";
import { Grid, Button, Image, Text } from "../../elements/Index";

const Login = (props) => {
  return (
    <Grid height="100vh" bg="#00D282">
      <Grid column>
        {/* <Grid height="auto" column margin="250px 0px 50px 0px"> */}
        <Grid column width="200px" height="200px" margin="auto">
          <img src="./img/login.png" style={{ margin: "150px 0px" }} />
        </Grid>
        <div style={{ margin: "250px 0px 20px 0px" }}>
          <A
            href={KAKAO_AUTH_URL}
            onClick={() => {
              window.location.href = "/main";
            }}
          >
            <img src="./img/kakao_login_medium_wide.png" alt="카카오로그인" />
          </A>
        </div>
        <GoogleBtn
          style={{ display: "flex", justifyContent: "initial" }}
          onClick={() => {
            window.location.href = "/main";
          }}
        >
          <img src="./img/btn_google_light_normal_ios.svg" alt="구글로그인" />
          <Agoogle href={GOOGLE_AUTH_URL}>구글 로그인</Agoogle>
        </GoogleBtn>
        {/* </Grid> */}
      </Grid>
    </Grid>
  );
};

export default Login;

const A = styled.a`
  text-decoration-line: none;
  display: block;
  /* padding-top: 0px; */
  font-weight: bold;
  font-size: 14px;
`;

const Agoogle = styled.a`
  margin-left: 78px;
  margin-top: 13px;
  text-decoration-line: none;
  display: block;
  /* padding-top: 0px; */
  font-weight: bold;
  font-size: 14px;
`;

const GoogleBtn = styled.button`
  display: inline-block;
  width: 300px;
  height: 44px;
  background: white;
  border: none;
  border-radius: 5px;
  margin-bottom: 50px;
  padding-left: 0px;
`;

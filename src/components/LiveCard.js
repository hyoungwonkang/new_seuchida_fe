import React from "react";
import styled from "styled-components";
import { Image } from "../elements/Index";
import { history } from "../redux/configStore";
const LiveCard = (props) => {
  const Livepost = props
  function getDistance(lat1, lon1, lat2, lon2, unit) {
    if (lat1 === lat2 && lon1 === lon2) {
      return 0;
    } else {
      var radlat1 = (Math.PI * lat1) / 180;
      var radlat2 = (Math.PI * lat2) / 180;
      var theta = lon1 - lon2;
      var radtheta = (Math.PI * theta) / 180;
      var dist =
        Math.sin(radlat1) * Math.sin(radlat2) +
        Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = (dist * 180) / Math.PI;
      dist = dist * 60 * 1.1515;
      if (unit === "K") {
        dist = dist * 1.609344;
      }
      if (unit === "N") {
        dist = dist * 0.8684;
      }
      return dist;
    }
  }
  
  let distance = getDistance(props.center.lat, props.center.lng, props.latitude, props.longitude, "K").toFixed(1)

  return (
    <>
      <Container onClick={()=>history.push(`/postdetail/${Livepost._id}`)} >
        <Box>
          <Profile>
            <Image
              shape="circle"
              src={Livepost?.userImg}
              size={60}
              margin="0px 0px 0px 60px"
            />
          </Profile>

          {/* 카드 속 내용 */}
          <Location>
            <Title style={{marginRight :"8px"}}>· {Livepost?.status===true? '모집중': '모집완료'}</Title>
            <Title>제목 받아야됨</Title>
          </Location>

          <Desc>{Livepost?.postDesc}</Desc>

          <LocaTime>
            <Location>
              <SmallFont style={{marginRight:"3px"}}>마크</SmallFont>
              <SmallFont>{distance} km</SmallFont>
            </Location>

            <SmallFont>1분전</SmallFont>
          </LocaTime>
        </Box>
      </Container>
    </>
  );
};

export default LiveCard;

const Container = styled.section`
  
  max-width: 250px;
  width: 224px;
  /* border: 1px solid rgba(208, 208, 208, 1); */
  height: 168px;
  margin: 15px;
  margin-top: 30px;
  font-size: 14px;
  border-radius: 12px;
  background-color: white;
  /* justify-content: center; */
  align-items: center;
  display: flex;
`;

const Profile = styled.div`
  position: absolute;
  /* width: 65px; */
  /* height: 65px; */
  /* border-radius: 65px; */
  z-index: 99;
  /* background-color: white; */
  /* margin-left: 60px; */
  top: 0px;
  /* background-image: url(${(props) => props.src}); */
  /* background-size: cover; */
  /* background-repeat: no-repeat; */
  /* background-position: center; */
`;

const LocaTime = styled.div`
  justify-content: space-between;
  display: flex;
  margin-top: 20px;
`;

const Location = styled.div`
  display: flex;
  flex-direction: row;
`;

const Box = styled.div`
  /* border: 1px solid black; */
  margin-top:20px;
  padding: 20px;
  width: 100%;
 
`;

const SmallFont = styled.div`
  color: #787878;
  font-size: 12px;
`;

const Title = styled.div`
  font-size: 16px;
  font-weight: 800;
  padding: 8px 0px;
`;

const Desc = styled.div`
  font-size: 14px;
  min-width: 50px;
  min-height: 40px;
`;

const Line = styled.div`
  border-top: 1px solid gray;
  margin: 15px 0px;
`;

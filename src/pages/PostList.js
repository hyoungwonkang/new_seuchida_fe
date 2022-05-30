import React, { useState } from "react";
import { Card } from "../components/index";
import styled from "styled-components";
import FooterMenu from "../shared/FooterMenu";
import GoBack from "../elements/GoBack";
import { useHistory } from "react-router-dom";
import { Grid, Text } from "../elements/Index";
import axios from "axios";

const PostList = ({ list, params }) => {
  const history = useHistory();

  // 포스트 목록

  const [postList, setPostList] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const pageEnd = React.useRef(null);

  const [state, setState] = useState({
    center: {
      lat: 33.450701,
      lng: 126.570667,
    },
    errMsg: null,
    isLoading: true,
  });

  React.useEffect(() => {
    if (navigator.geolocation) {
      // GeoLocation을 이용해서 접속 위치를 얻어옵니다
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setState((prev) => ({
            ...prev,
            center: {
              lat: position.coords.latitude, // 위도
              lng: position.coords.longitude, // 경도
            },
            isLoading: false,
          }));
        },
        (err) => {
          setState((prev) => ({
            ...prev,
            errMsg: err.message,
            isLoading: false,
          }));
        }
      );
    } else {
      // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정합니다
      setState((prev) => ({
        ...prev,
        errMsg: "geolocation을 사용할수 없어요..",
        isLoading: false,
      }));
    }
  }, []);

  const ShowTown = () => {
    React.useEffect(() => {
      setIsLoading(true);
      axios({
        method: "get",
        url: `https://seuchidabackend.shop/api/nearPostList/${pageNumber}`,
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => {
          setIsLoading(false);
          setPostList((items) => [...items, ...res.data.nearPosts]);
        })
        .catch((err) => {
          console.log(err);
        });
    }, [pageNumber]);
  };

  const ShowWhole = () => {
    React.useEffect(() => {
      setIsLoading(true);
      axios({
        method: "get",
        url: `https://seuchidabackend.shop/api/wholePostList/`,
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => {
          setIsLoading(false);
          setPostList((items) => [...items, ...res.data.wholePosts]);
        })
        .catch((err) => {
          console.log(err);
        });
    }, []);
  };

  //무한 스크롤
  const onIntersect = (entries) => {
    entries.forEach((element) => {
      if (element.isIntersecting) {
        setPageNumber((prev) => prev + 1);
      }
    });
  };

  //바닥 감지
  React.useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.25,
    };
    const observer = new IntersectionObserver(onIntersect, options);
    observer.observe(pageEnd.current);
    return () => observer.disconnect();
  }, [pageEnd]);

  return (
    <>
      <Header>
        <Gback>
          <GoBack
            gback
            _onClick={() => {
              history.push(`/main`);
            }}
          />
        </Gback>
        <HeadContents>
          <div> 여기여기 붙어라 </div>
        </HeadContents>
      </Header>
      <ListBox>
        <Grid padding="10px 24px 10px 10px" isFlex_end>
          <RadioInput
            type="radio"
            name="region"
            value="town"
            onClick={ShowTown}
          />
          <Text margin="10px 0px 0px 0px">동네보기</Text>
          <RadioInput
            type="radio"
            name="region"
            value="whole"
            onClick={ShowWhole}
          />
          <Text margin="10px 0px 0px 0px">전체보기</Text>
        </Grid>
        {postList?.map((p, i) => {
          return (
            <Card
              {...p}
              key={p.id}
              center={state.center}
              _onClick={() => {
                history.push(`/postdetail/${p._id}`);
              }}
            />
          );
        })}
        <div ref={pageEnd} className="pageEnd">
          {isLoading && (
            <Pos>
              {/* <Seuchin alt="loading" src="./img/loading.gif" width={130} /> */}
            </Pos>
          )}
        </div>
      </ListBox>
      <FooterMenu />
    </>
  );
};

export default PostList;

const Header = styled.div`
  top: 0;
  position: fixed;
  background-color: white;
  width: 100%;
  height: 40px;
  padding: 24px 0px 0px 24px;
  border-bottom: 1px solid #e9e9e9;
  display: flex;
  flex-direction: row;
`;

const Gback = styled.div``;
const HeadContents = styled.div`
  font-size: 20px;
  font-weight: bold;
  margin: 2px 0px 0px 20px;
`;

const ListBox = styled.div`
  margin: 64px 0px 80px 0px;
`;

const Pos = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Seuchin = styled.img`
  width: 100px;
`;

const RadioInput = styled.input`
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;

  border-radius: 50%;
  width: 20px;
  height: 20px;

  border: 2px solid #999;
  margin-right: 5px;

  position: relative;
  top: 4px;

  cursor: pointer;

  :checked {
    border: 5px solid #5796f7;
  }
`;

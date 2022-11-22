import { FC } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

interface FlyerProps {
  flyerList: any[];
}

const Td = styled.td`
row-span = 10;
col-span = 20;
font-size: 25;
 color: '#555;
  background: #fff;
`;

const Flyer: FC<FlyerProps> = ({ flyerList = [] }) => {
  return (
    <tr>
      <Td>
        <div style={{ display: "flex", padding: "30px", flexWrap: "wrap" }}>
          {flyerList &&
            flyerList.map((flyer: any, index) => {
              return (
                <Item key={index} flyer={flyer} />
              );
            })}
        </div>
      </Td>
    </tr>
  );
};

export default Flyer;

const Item: FC<{ flyer: any }> = ({ flyer }) => {

  const navigation = useNavigate();
  console.log('flyer', flyer)
  return (
    <div style={{ padding: "20px", maxWidth: "18%" }} onClick={() => navigation(`/detail/${flyer.storeId}`)}>
      <img src={`https://lookthis.s3.ap-northeast-2.amazonaws.com/flyer/image${flyer.path}`} alt="" style={{width:'100%'}} />
      <p style={{ fontSize: "20px" }}>{flyer.storeName}</p>
    </div>
  );
};

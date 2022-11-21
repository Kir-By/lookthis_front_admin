import { FC } from "react";
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
                <Item key={index} url={flyer.path} title={flyer.storeName} />
              );
            })}
        </div>
      </Td>
    </tr>
  );
};

export default Flyer;

const Item: FC<{ url: string; title: string }> = ({ url, title }) => {
  return (
    <div style={{ padding: "20px", width: "18%" }}>
      <img src={url} alt="" />
      <p style={{ fontSize: "20px" }}>{title}</p>
    </div>
  );
};

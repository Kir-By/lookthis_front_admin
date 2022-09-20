/* eslint-disable react/react-in-jsx-scope */
import React, {FC, useState} from 'react';
import styled, {css} from 'styled-components';

const Hover = css`
  &:hover {
    background-color: #fcecec;
    color: #c04b37;
    font-weight: 800;
    & h3 {
      background-color: #fcecec;
      color: #c04b37;
      font-weight: 800;
    }
  }
`;

const SidebarWrapper = styled.div`
  flex: 0.3;
  max-width: 300px;
  padding-right: 20px;
`;
const SidebarOption = styled.div`
  display: flex;
  align-items: center;
  height: 40px;
  padding: 0 10px;
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
  cursor: pointer;
  color: #818181;
  ${Hover}
  ${(props: {active: boolean}) =>
    `${
      props.active
        ? `background-color: #fcecec;
  color: #c04b37;
  font-weight: 800;`
        : `${Hover}`
    }`}

  & h3 {
    flex: 1;
    margin-left: 10px;
    font-size: 14px;
    font-weight: 400;
    ${(props: {active: boolean}) =>
      `${
        props.active
          ? `background-color: #fcecec;
  color: #c04b37;
  font-weight: 800;`
          : `${Hover}`
      }`}
  }
  & span {
    padding: 5px;
  }
`;

const Sidebar: FC = () => {
  const [active, setActive] = useState(0);
  const optionList = ['내 광고', '내 광고2'];
  return (
    <SidebarWrapper>
      {optionList.map((v, i) => (
        <SidebarOption key={i} active={active === i ? true : false} onClick={() => setActive(i)}>
          <h3>{v}</h3>
        </SidebarOption>
      ))}
    </SidebarWrapper>
  );
};

export default Sidebar;

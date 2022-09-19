/* eslint-disable react/react-in-jsx-scope */
import {FC} from 'react';
import styled from 'styled-components';
import Header from '../header/Header';

const StyledButton = styled.button`
  background-color: #228be6;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  padding: 12px 24px;
  margin: 0;
`;

const Layout: FC = () => {
  return (
    <>
      <Header></Header>
      {/* <StyledButton>button</StyledButton> */}
    </>
  );
};

export default Layout;

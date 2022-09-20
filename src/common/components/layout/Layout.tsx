/* eslint-disable react/react-in-jsx-scope */
import React, {FC} from 'react';
import styled from 'styled-components';
import Header from '../header/Header';
import Sidebar from '../sidebar/Sidebar';

const StyledBody = styled.div``;

const Layout: FC<{children: React.ReactNode | null}> = ({children = <></>}) => {
  return (
    <>
      <Header></Header>
      <Sidebar></Sidebar>
      <StyledBody>{children}</StyledBody>
    </>
  );
};

export default Layout;

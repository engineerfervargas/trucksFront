import React from 'react';
import { Flex, Box, Spacer } from '@chakra-ui/react'
import styled from "styled-components";

/**
 * 
 */

const Nav = styled(Box)`
  .container{
    display: flex;
    flex-flow: row-reverse wrap;
  }
  `;

const NavTrucks = ({ children }) => {
  return (
    <Flex minWidth='max-content' gap='2' p='3'>
      <Spacer />
      <Nav>
        {children}
      </Nav>
    </Flex>
  );
}

export default NavTrucks;
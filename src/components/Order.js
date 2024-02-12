import { Box, Grid, GridItem, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import React from 'react';

const Order = ({ columns, data, exist, all }) => {

  const subtotal = data.reduce((acc, current) => {
    return acc + current.price * current.quantitySelect;
  }, 0.0);

  const total = data.reduce((acc, current) => {
    return acc + current.price * current.quantitySelect * (1 - current.discount);
  }, 0.0);

  function Old({ item }) {
    return (
      <Tr key={item.hawa} >
        <Td>{item.hawa}</Td>
        <Td>{item.description}</Td>
        <Td>{item.price}</Td>
        <Td>{item.discount}</Td>
        <Td>{item.quantity}</Td>
        <Td>{item.subtotal}</Td>
        <Td>{item.total}</Td>
      </Tr >
    );
  }

  function New({ item }) {
    return (
      <Tr key={item.hawa} >
        <Td>{item.hawa}</Td>
        <Td>{item.description}</Td>
        <Td>{item.price}</Td>
        <Td>{item.discount}</Td>
        <Td>{item.quantitySelect}</Td>
        <Td>{item.quantitySelect * item.price}</Td>
        <Td>{item.quantitySelect * item.price * (1 - item.discount)}</Td>
      </Tr >
    );
  }

  return (
    <>
      {(all) && (
        <Grid templateColumns='repeat(4, 1fr)' gap={6}>
          <GridItem w='100%' h='10' >{`Store: ${all.store}`}</GridItem>
          <GridItem w='100%' h='10' >{`Seller: ${all.user}`}</GridItem>
          <GridItem w='100%' h='10' >{`Client: ${all.client}`}</GridItem>
          <GridItem w='100%' h='10' >{`Date: ${all.date}`}</GridItem>
        </Grid>
      )}
      <TableContainer>
        {data && (
          <Table variant='striped' colorScheme='teal'>
            <Thead>
              <Tr>
                {columns.map(el => {
                  return <Th key={el}>{el}</Th>
                })}
              </Tr>
            </Thead>
            <Tbody>
              {data.map(el => {
                return (
                  !exist ? <New key={el.hawa} item={el} /> : <Old key={el.hawa} item={el} />
                )
              })}
            </Tbody>
          </Table>
        )}
      </TableContainer>
      <br />
      <Grid templateColumns='repeat(5, 1fr)' gap={4}>
        <GridItem colStart={6} colEnd={8} h='5'>
          <Box bg='teal' w='100%' p={1} color='white'>
            {`Subtotal: ${!exist ? subtotal : all.subtotal}`}
          </Box>
          <Box bg='teal' w='100%' p={1} color='white'>
            {`Total: ${!exist ? total : all.total}`}
          </Box>
        </GridItem>
      </Grid>
    </>


  );
}

export default Order;
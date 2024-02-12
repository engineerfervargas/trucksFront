import React, { useEffect, useState } from 'react';
import { ViewIcon } from '@chakra-ui/icons';
import { Button, Grid, GridItem, IconButton, Modal, ModalBody, ModalContent, ModalFooter, ModalOverlay, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import { Link as ReactRouterLink } from 'react-router-dom'
import { Link as ChakraLink } from '@chakra-ui/react'

import Order from '../components/Order';
import { genericGet, genericPatch } from '../service/genericService';

const Orders = () => {

  const columns = ['STORE', 'USER', 'CLIENT', 'SUBTOTAL', 'TOTAL', 'DATE', 'STATUS'];

  const columnsDetails = [
    'HAWA',
    'DESCRIPTION',
    'PRICE',
    'DISCOUNT',
    'QUANTITY',
    'SUBTOTAL',
    'TOTAL',
  ];

  const [isOpenDetails, setIsOpenDetails] = useState(false);
  const [isEnableCancel, setIsEnableCancel] = useState(true);
  const [rowSelected, setRowSelected] = useState({});

  const [data, setData] = useState(undefined);

  function handleOpenDetail(e) {
    setIsOpenDetails(true);
    setRowSelected(e);
    setIsEnableCancel((Date.parse(new Date()) - Date.parse(e.date)) / 1000 / 60 < 10);
    console.log(e);
  }

  async function handleCancel() {
    await genericPatch(`orders/update/${rowSelected.uuid}?status=2`);
    setIsOpenDetails(false);
  }

  useEffect(() => {
    genericGet("orders/all").then(response => {
      setData(response.data);
    }).catch(error => console.log(error));
  }, [])

  return (
    <div>
      <br />
      <Grid>
        <GridItem>
          <ChakraLink as={ReactRouterLink} to='/inventory'>
            <Text fontSize='30px' color='black'>
              Inventory
            </Text>
          </ChakraLink>
        </GridItem>
      </Grid>
      <br />
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
                  <Tr key={el.hawa}
                    value={el} onClick={() => handleOpenDetail(el)}>
                    <Td>{el.store}</Td>
                    <Td>{el.user}</Td>
                    <Td>{el.client}</Td>
                    <Td>{el.subtotal}</Td>
                    <Td>{el.total}</Td>
                    <Td>{el.date}</Td>
                    <Td>{el.status}</Td>
                    <Td>
                      <IconButton
                        value={el}
                        onClick={() => handleOpenDetail(el)}
                        isDisabled={el.quantity <= 0}
                        colorScheme='teal'
                        aria-label='Call Segun'
                        icon={<ViewIcon />}
                      />
                    </Td>
                  </Tr>
                )
              })}
            </Tbody>
          </Table>
        )}
      </TableContainer>

      <Modal size='full' blockScrollOnMount={false} isOpen={isOpenDetails}>
        <ModalOverlay />
        <ModalContent>
          <ModalBody>
            <Order columns={columnsDetails} data={rowSelected.trucks} all={rowSelected} exist={true} />
          </ModalBody>

          <ModalFooter>
            <Grid templateColumns='repeat(2, 1fr)' gap={6}>
              <GridItem w='100%' h='10' >
                <Button isDisabled={!isEnableCancel} onClick={handleCancel} colorScheme='red'>Cancel</Button>
              </GridItem>
              <GridItem w='100%' h='10' >
                <Button colorScheme='blue' mr={3} onClick={() => { setIsOpenDetails(false) }}>
                  Close
                </Button></GridItem>
            </Grid>

          </ModalFooter>
        </ModalContent>
      </Modal>

    </div>
  );
}

export default Orders;
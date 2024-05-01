import React, { useEffect, useReducer, useState } from 'react';
import { AddIcon } from '@chakra-ui/icons'
import { Link as ReactRouterLink } from 'react-router-dom'
import { Link as ChakraLink } from '@chakra-ui/react'

import { useQuery } from '../hooks/useAxios';
import { Button, Grid, GridItem, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr, useDisclosure } from '@chakra-ui/react';
import cartReducer, { CART_TYPES } from '../reducers/cartReducer';
import Order from '../components/Order';
import { genericGet, genericPost } from '../service/genericService';
import { ip } from '../utils/ip';
import NavTrucks from '../components/NavTrucks';

const Inventory = () => {

  const [isOpenPreview, setIsOpenPreview] = useState(false);
  const [isOpenResult, setIsOpenResult] = useState(false);

  const [data, setData] = useState(undefined);//onloading } = useQuery("truck/all");
  const [search, setSearch] = useState('');
  const [filterValues, setFilterValues] = useState([]);

  const [cart, dispatch] = useReducer(cartReducer, []);

  const [clients, setClients] = useState([]);
  const [stores, setStores] = useState([]);
  const [storeSelect, setStoreSelect] = useState('');
  const [clientSelect, setClientSelect] = useState('');

  const [orderDo, setOrderDo] = useState({});

  const columns = [
    'HAWA',
    'DESCRIPTION',
    'PRICE',
    'DISCOUNT',
    'QUANTITY',
    '',
  ];

  useEffect(() => {
    genericGet('clients').then(res => {
      setClients(res.data);
    }).catch(err => { });
    genericGet('stores').then(res => {
      setStores(res.data);
    }).catch(err => { });
    genericGet('truck/all').then((response) => {
      setData(response.data);
    });
  }, []);

  useEffect(() => {
    if (data){
      if (search)
        setFilterValues(data.filter(el => el.hawa.includes(search.toUpperCase())));
      else 
        setFilterValues(data);
    }
  }, [data]);


  async function handleOrder() {
    const ipstr = await ip.getIp();
    let hawas = [];
    cart.forEach(el => {
      var obj = {}
      obj[el.hawa] = el.quantitySelect;
      hawas.push(
        obj
      )
    });
    const request = {
      ip: ipstr,
      client: clientSelect,
      store: storeSelect,
      hawas: hawas
    }
    await genericPost("orders/make", request).then(response => {
      setOrderDo(response.data);
      setIsOpenPreview(false);
      setIsOpenResult(true);
      dispatch({ type: CART_TYPES.RESET });
    })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
      });
    genericGet('truck/all').then((response) => {
      setData(response.data);
    });
  }

  useEffect(() => {
    if (data) {
      const update = data.reduce((acc, current) => {
        const el = cart.find(it => it.hawa == current.hawa);
        if (el) {
          return [
            ...acc,
            {
              ...current,
              quantity: current.quantity - el.quantitySelect
            }
          ];
        }
        else {
          return [
            ...acc,
            {
              ...current
            }
          ]
        }
      }, []);
      if (search)
        setFilterValues(update.filter(el => el.hawa.includes(search.toUpperCase())));
      else 
        setFilterValues(update);
    }
  }, [cart]);

  useEffect(() => {
    if (search)
      setFilterValues(data.filter(el => el.hawa.includes(search.toUpperCase())));
    else
      setFilterValues(data);
  }, [search])

  return (
    <div>
      <br />
      <NavTrucks >
        <ChakraLink as={ReactRouterLink} to='/orders'>
          Orders
        </ChakraLink>
        {' / Inventory'}
      </NavTrucks>
      <br />
      <Grid p={1}>
        <Input onChange={(e) => setSearch(e.target.value)} placeholder='HAWA' value={search} />
      </Grid>
      <TableContainer>
        {filterValues && (
          <Table variant='striped' colorScheme='teal'>
            <Thead>
              <Tr>
                {columns.map(el => {
                  return <Th key={el}>{el}</Th>
                })}
              </Tr>
            </Thead>
            <Tbody>
              {filterValues.map(el => {
                return (
                  <Tr key={el.hawa}>
                    <Td>{el.hawa}</Td>
                    <Td>{el.description}</Td>
                    <Td>{el.price}</Td>
                    <Td>{el.discount}</Td>
                    <Td>{el.quantity}</Td>
                    <Td>
                      <IconButton
                        onClick={() => dispatch({ type: CART_TYPES.ADD, payload: el })}
                        isDisabled={el.quantity <= 0}
                        colorScheme='teal'
                        aria-label='Call Segun'
                        icon={<AddIcon />}
                      />
                    </Td>
                  </Tr>
                )
              })}
            </Tbody>
          </Table>
        )}
      </TableContainer>
      <br />
      <Grid p={3} templateColumns='repeat(5, 1fr)' gap={4}>
        <GridItem colStart={6} colEnd={8} h='5'>
          <Button colorScheme='teal' onClick={() => { setIsOpenPreview(true) }}>Check Order</Button>
        </GridItem>
      </Grid>

      <Modal size='full' blockScrollOnMount={false} isOpen={isOpenPreview}>
        <ModalOverlay />
        <ModalContent>
          <ModalBody>
            <Select p={1} placeholder='Store' onChange={(e) => { setStoreSelect(e.target.value) }}>
              {stores.map(el => <option key={el.storeUuid} value={el.storeUuid}>{el.name}</option>)}
            </Select>
            <Select p={1} placeholder='Client' onChange={(e) => { setClientSelect(e.target.value) }}>
              {clients.map(el => <option key={el.clientUuid} value={el.clientUuid}>{`${el.firstName} ${el.lastName}`}</option>)}
            </Select>
            <Order columns={[...columns, 'SUBTOTAL', 'TOTAL'].filter(el => el != '')} data={cart} exist={false} />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={() => { setIsOpenPreview(false) }}>
              Close
            </Button>
            <Button onClick={handleOrder} colorScheme='teal'>Order</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal size='full' blockScrollOnMount={false} isOpen={isOpenResult}>
        <ModalOverlay />
        <ModalContent>
          <ModalBody>
            <Order columns={[...columns, 'SUBTOTAL', 'TOTAL'].filter(el => el != '')} data={orderDo.trucks} all={orderDo} exist={true} />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={() => { setIsOpenResult(false) }}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </div>
  );
}

export default Inventory;
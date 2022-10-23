import { Box, Flex, Heading, Input, Switch, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { NFTHttpService } from '../api/nft'

// Socket.io
import { io } from "socket.io-client";

export const socket = io("http://localhost:3003/");

export const Home = () => {
  let currentNFTCount = 0;
  const nftHttpService = new NFTHttpService();
  const [nfts, setNfts] = useState<any[]>([])
  const [indexingBlock, setIndexingBlock] = useState<number>(0)
  const [currentBlock, setCurrentBlock] = useState<number>(0)
  const [totalNFTs, setTotalNFTs] = useState<number>(0)
  const [socketConnection, setSocketConnection] = useState<boolean>(true);

  async function fetchNft() {
    const resolved = await nftHttpService.fetchNFTs();
    // if (resolved.data !== null);
    // setNfts(resolved.data['paginatedResults']);
  }

  async function getTotalNfts() {
    const response = await fetch("http://localhost:3003/api/nft");
    const formattedResponse = await response.json();
    currentNFTCount = formattedResponse[0].totalCount[0].count;
    setTotalNFTs(currentNFTCount);
  };

  function handleSocketConnection() {
    if (socketConnection) {
      socket.disconnect();
    } else {
      socket.connect()
    }
    setSocketConnection(s => !s);

  }

  useEffect(() => {
    fetchNft()
    getTotalNfts();
    socket.on("disconnect", () => {
      console.log("Socket Disconnected"); // undefined
    });

    socket.on("new-nft", (nft) => {
      setNfts(arr => [nft, ...arr.slice(0, 30)])
    });

    socket.on("new-block", (block) => {
      setCurrentBlock(block)
    });

    socket.on("save-nft", (count) => {
      setTotalNFTs(count + currentNFTCount)
    });

    socket.on("indexing-block", (block) => {
      setIndexingBlock(block)
    });
    return () => { }
  }, [])

console.log(nfts);

  return (
    <Box width="100%">
      <Flex align="center" justify="center" direction="column">
        <Heading as='h3' size='2xl'>
          Shardeum Explorer🔱
        </Heading>
        <Box m={2} mt={"10"} />
        <Flex align="center" justify="center">
          <Box mr={"10"} textAlign='center'>
            <Heading as='h4' size='sm'>
              Current Block
            </Heading>
            <Heading as='h5' size='lg'>
              {currentBlock}
            </Heading>
          </Box>
          <Box mr={"10"} textAlign='center'>
            <Heading as='h4' size='sm'>
              Indexing Block
            </Heading>
            <Heading as='h5' size='lg'>
              {indexingBlock}
            </Heading>
          </Box>
          <Box mr={"10"} textAlign='center'>
            <Heading as='h4' size='sm'>
              Total NFTs
            </Heading>
            <Heading as='h5' size='lg'>
              {totalNFTs}
            </Heading>
          </Box>
        </Flex>
        <Box m={2} mt={"3"} />
        <Flex align="center" justify="center" direction="column">
          <Heading as='h4' size='s'>
            {socketConnection ? "Connected" : "Paused"}
          </Heading>
          <Switch onChange={handleSocketConnection} id='socket-switch' isChecked={socketConnection} />
        </Flex>
        <Box m={2} mt={"50"} />
        <Input placeholder='Search...' width='40vw' />
        <Box m={2} mt={"30"} />

        {/* Result */}
        <TableContainer>
          <Table variant='striped'>
            <Thead>
              <Tr>
                <Th>#ID</Th>
                <Th>Name</Th>
                <Th>Collection</Th>
                <Th>Owner</Th>
                <Th>Image</Th>
                <Th>Time</Th>
                <Th>Hash</Th>
              </Tr>
            </Thead>
            <Tbody>
              {
                nfts.slice(0, 30).map((n, i) => {
                  return (
                    <Tr key={i}>
                      <Td>{n['token_id']}</Td>
                      <Td>{n['name']}</Td>
                      <Td>{n['contract_address'].slice(-6)}</Td>
                      <Td>{n['owner'].slice(-6)}</Td>
                      <Td>
                        <a href={n['image']} rel="noreferrer" target="_blank">{n['image']?.slice(0, 15)}</a>
                      </Td>
                      <Td>{new Date(n["createdAt"]).toLocaleTimeString()}</Td>
                      <Td>0x123...slk</Td>
                    </Tr>
                  )
                })
              }
            </Tbody>
          </Table>
        </TableContainer>
      </Flex>
    </Box>
  )
}

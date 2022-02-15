import type { NextPage } from 'next'
import { Container, Box, Text } from '@chakra-ui/react';
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  return (
    <Container>
      <Box m={'6'}>
        <Text fontSize="xl">dShop</Text>
      </Box>
    </Container>
  )
}

export default Home

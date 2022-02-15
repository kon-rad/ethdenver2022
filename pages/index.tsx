import type { NextPage } from "next";
import { Container, Flex, Box, Text } from "@chakra-ui/react";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Hero from "../components/hero";

const Home: NextPage = () => {
  return (
    <div>
      <Hero />
      <Flex align="center">
        <Box p={"6"}></Box>
      </Flex>
    </div>
  );
};

export default Home;

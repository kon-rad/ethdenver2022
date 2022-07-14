import { Text, Box, Input, Flex, Button, Image } from '@chakra-ui/react';

const Hero = () => {
    return (
        <div className="hero">
            <Box p="6">
                <Flex align="center" direction="column">
                    <div className="hero-text-container">
                        <Text fontSize="6xl" mb="6" color="black" className="title text-highlight"> dcom </Text>
                        <Text mb="6" fontSize="2xl" textAlign="center" fontWeight="bold" width="400px" color="black" className="hero-text">
                            welcome to a new era of decentralized commerce
                        </Text>
                    </div>
                    {/* <Text mt="6">Built on </Text>
                    <Image src="/images/polygon-logo.svg" /> */}
                </Flex>
            </Box>
        </div>
    )
}

export default Hero;
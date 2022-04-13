import { Text, Box, Input, Flex, Button, Image } from '@chakra-ui/react';
import { Search2Icon } from '@chakra-ui/icons';

const Hero = () => {
    return (
        <div className="hero">
            <Box p="6">
                <Flex align="center" direction="column">
                    <Text fontSize="6xl" mb="6" color="whiteAlpha.900"> dCom </Text>
                    <Text mb="6" fontSize="2xl" textAlign="center" fontWeight="bold" width="400px" color="whiteAlpha.900">
                        Easily create an online store 
                        and take payments instantly
                    </Text>
                    <Flex justify="center" align="center">
                        <Input color="white" borderColor="white" width="300px" mr="4" placeholder="search for merchants" />
                        <Button backgroundColor="brand.400" color="black"><Search2Icon /></Button>
                    </Flex>
                    <Text mt="6">Built on </Text>
                    <Image src="/images/polygon-logo.svg" />
                </Flex>
            </Box>
        </div>
    )
}

export default Hero;
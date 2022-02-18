import { Text, Box, Input, Flex, Button } from '@chakra-ui/react';
import { Search2Icon } from '@chakra-ui/icons';

const Hero = () => {
    return (
        <div className="hero">
            <Box p="6">
                <Flex align="center" direction="column">
                    <Text fontSize="6xl" mb="6" > deCom </Text>
                    <Text mb="6" fontSize="2xl" textAlign="center" fontWeight="bold" width="400px">
                        Easily create an online store 
                        and take payments instantly
                    </Text>
                    <Flex justify="center" align="center">
                        <Input color="white" borderColor="white" width="300px" mr="4" placeholder="search for merchants" />
                        <Button backgroundColor="brand.400" color="black"><Search2Icon /></Button>
                    </Flex>
                </Flex>
            </Box>
        </div>
    )
}

export default Hero;
import { Text, Box, Input, Flex, Button } from '@chakra-ui/react';

const Hero = () => {
    return (
        <div className="hero">
            <Box p="6">
                <Flex align="center" direction="column">
                    <Text fontSize="xl"> dCom </Text>
                    <Text fontSize="lg">disrupting the world of centralized commerce by providing free and easy to use payment system all in your smart phone browser</Text>

                </Flex>
            </Box>
        </div>
    )
}

export default Hero;
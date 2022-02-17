import { Box, Text } from '@chakra-ui/react';

interface Props {
    data: any;
}

const CatalogItem = (props: Props) => {
    return (
        <Box>
            <Text>
                Catalog Item: {props.data}
            </Text>
        </Box>
    )
}

export default CatalogItem
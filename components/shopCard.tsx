import { Box } from '@chakra-ui/react';

interface Props {
    data: any;
}
const ShopCard = (props: Props) => {
    return (
        <Box>
            {props.data}
        </Box>
    )
}

export default ShopCard;
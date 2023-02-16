import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Flex,
  Avatar,
  Box,
  Heading,
  IconButton,
  Button,
} from '@chakra-ui/react'
import { Text, Image } from '@chakra-ui/react'
import './card.css'

function CreateCard() {
  return (
    <Card maxW="md" className="card" margin="3%">
      <CardHeader>
        <Flex spacing="10">
          <Flex flex="1" gap="10" alignItems="flex-start" flexWrap="nowrap">
            <Avatar
              boxSize="20"
              name="Segun Adebayo"
              src="https://static.vecteezy.com/system/resources/previews/008/603/786/original/safety-child-product-stamp-safe-for-children-green-label-non-toxic-material-for-kid-sticker-child-care-symbol-baby-food-sign-in-restaurant-menu-kid-friendly-logo-isolated-illustration-vector.jpg"
            />
            <Box>
              <Heading size="lg">Children Welfare Global Charity</Heading>
            </Box>
          </Flex>
          <IconButton variant="ghost" colorScheme="gray" aria-label="See menu" />
        </Flex>
      </CardHeader>
      <CardBody>
        <Text>Children.org, UNICEF, Child Mind Institute, Out Little roses, cry.org, etc. </Text>
      </CardBody>
      <Image
        objectFit="cover"
        src="https://www.ourlittleroses.org/wp-content/uploads/2021/11/larm-rmah-AEaTUnvneik-unsplash-1024x683.jpg"
        alt="Chakra UI"
      />
      <CardFooter>
        <Button variant="solid" className="donateButton">
          Start donation stream
        </Button>
      </CardFooter>
    </Card>
  )
}

export default CreateCard

import {
  VStack,
  Heading,
  useColorModeValue,
  SimpleGrid,
  GridItem,
  FormControl,
  FormLabel,
  Input,
  Button,
  Divider,
  useBreakpointValue,
} from "@chakra-ui/react";
import CompleteChallenge from "../components/CompleteChallenge";
import StartChallenge from "../components/StartChallenge";
import ReadIsStarted from "../components/ReadIsStarted";

const LocationProvider = () => {
  const bgColor = useColorModeValue("green.400", "gray.600");
  const colSpan = useBreakpointValue({ base: 2, md: 1 });

  return (
    <VStack
      w="full"
      h="full"
      padding={5}
      spacing={5}
      alignItems="flex-start"
      bg={bgColor}
    >
      =======
      <Heading as="h2" size="xl">
        Location provider
      </Heading>
      <SimpleGrid columns={2} columnGap={3} rowGap={3} w="full">
        <GridItem colSpan={2}>
          <StartChallenge />
        </GridItem>

        <GridItem colSpan={2}>
          <Divider />
        </GridItem>

        <GridItem colSpan={2}>
          <CompleteChallenge />
        </GridItem>
      </SimpleGrid>
    </VStack>
  );
};

export default LocationProvider;

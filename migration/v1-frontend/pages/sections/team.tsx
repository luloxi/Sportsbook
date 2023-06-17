import {
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  SimpleGrid,
  GridItem,
  Checkbox,
  Button,
  Divider,
  useColorModeValue,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useState } from "react";
import { useAccount } from "wagmi";
import CreateChallenge from "../components/CreateChallenge";
import AcceptDecline from "../components/AcceptDecline";
import CancelChallenge from "../components/CancelChallenge";
import UpdateChallenge from "../components/UpdateChallenge";
import UpdateLocationProvider from "../components/UpdateLocationProvider";
import abi from "../constants/abi.json";

const Team = () => {
  const bgColor = useColorModeValue("yellow.400", "gray.700");
  const colSpan = useBreakpointValue({ base: 2, md: 1 });

  const { address } = useAccount();

  const [challengeId, setChallengeId] = useState("");
  const onChangeChallengeId = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChallengeId(event.target.value);
  };

  return (
    <VStack
      w="full"
      h="full"
      padding={5}
      spacing={5}
      alignItems="flex-start"
      bg={bgColor}
    >
      <Heading as="h2" size="xl">
        Team
      </Heading>

      <SimpleGrid columns={2} columnGap={3} rowGap={3} w="full">
        <GridItem colSpan={colSpan}>
          <CreateChallenge />
        </GridItem>

        <GridItem colSpan={colSpan}>
          <AcceptDecline />
        </GridItem>

        <GridItem colSpan={2}>
          <Divider />
        </GridItem>

        <GridItem colSpan={colSpan}>
          <UpdateLocationProvider />
        </GridItem>

        <GridItem colSpan={colSpan}>
          <UpdateChallenge />
        </GridItem>
        {/* Update challenge section */}

        <GridItem colSpan={2}>
          <Divider />
        </GridItem>

        {/* Cancel challenge section */}
        <GridItem colSpan={2}>
          <CancelChallenge />
        </GridItem>
      </SimpleGrid>
    </VStack>
  );
};

export default Team;

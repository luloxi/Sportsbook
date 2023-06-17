import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import {
  Container,
  Heading,
  Button,
  Flex,
  HStack,
  Text,
  Switch,
  FormControl,
  FormLabel,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import { useIsMounted } from "./hooks/useIsMounted";
import Team from "./sections/team";
import LocationProvider from "./sections/locationProvider";
import Head from "next/head";
import contractAddresses from "./constants/contractAddresses.json";

const Home: NextPage = () => {
  const { toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue("gray.100", "black.100");

  const mounted = useIsMounted();
  const { address } = useAccount();

  return (
    <>
      <Head>
        <title>Sportsbook</title>
        <meta name="description" content="Made with love by Lulox" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>

      <Container maxW="container.xl" p={0} bg={bgColor} centerContent>
        <HStack
          justifyContent="space-evenly"
          alignItems="center"
          wrap="wrap"
          w="full"
          px={5}
        >
          <Heading marginY={2} as="h1" size="xl">
            ⚽ 🥊 Sportsbook 🏒 🏉
          </Heading>

          <Button
            onClick={toggleColorMode}
            marginTop={5}
            variant="link"
            colorScheme="black"
          >
            Dark theme?
          </Button>
          <ConnectButton label="Connect Web3 Wallet" chainStatus={"none"} />
        </HStack>

        <Text>Team/Location provider switch</Text>

        {mounted
          ? address && (
              <Flex
                h={{ base: "auto", md: "full" }}
                py={[0, 5, 2]}
                direction={{ base: "column", md: "row" }}
              >
                <Team />
                <LocationProvider />
              </Flex>
            )
          : null}
      </Container>
    </>
  );
};

export default Home;

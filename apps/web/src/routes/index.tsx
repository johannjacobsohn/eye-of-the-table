import { createFileRoute } from "@tanstack/react-router";
import { Card, Heading, Text, Button, Flex } from "@radix-ui/themes";
import { useTranslation } from "react-i18next";
import { PopulationChartSection } from "@/components/population/PopulationChartSection";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
} from "@clerk/tanstack-react-start";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const { t } = useTranslation();

  return (
    <div>
      <Heading as="h1" size="8">
        Some Dashboard
      </Heading>
      <Card my="6" size="4">
        <Heading as="h2" size="6" mb="3">
          {t("Welcome to this sample application")}
        </Heading>
        <Text>{t("This is a simple application.")}</Text>
        <SignedOut>
          <Flex gap="4" justify="center" align="center" m="2">
            <Button size="4" asChild>
              <SignInButton />
            </Button>
            or
            <Button size="4" asChild>
              <SignUpButton />
            </Button>
          </Flex>
        </SignedOut>
      </Card>

      <PopulationChartSection />
    </div>
  );
}

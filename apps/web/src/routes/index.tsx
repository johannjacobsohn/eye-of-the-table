import { createFileRoute } from "@tanstack/react-router";
import { Card, Heading, Text } from "@radix-ui/themes";
import { useTranslation } from "react-i18next";
import { PopulationChartSection } from "@/components/population/PopulationChartSection";

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
      </Card>

      <PopulationChartSection />
    </div>
  );
}

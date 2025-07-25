import { useQuery } from "@tanstack/react-query";
import { PopulationChart } from "@/components/population/PopulationChart";
import {
  Card,
  Heading,
  Text,
  Skeleton,
  IconButton,
  Flex,
} from "@radix-ui/themes";
import { useTranslation } from "react-i18next";
import React from "react";
import type { PopulationChartData } from "@/components/population/PopulationChart";
import { BiBarChart, BiLineChart } from "react-icons/bi";

export const PopulationChartSection: React.FC = () => {
  const { t } = useTranslation();
  // Aktualisiere die Abfrage, um die neue API-Route zu verwenden
  const { data, isLoading, error } = useQuery<PopulationChartData[]>({
    queryKey: ["population"],
    queryFn: async (): Promise<PopulationChartData[]> => {
      const res = await fetch(`/api/population?page=1&limit=10&sort=Year`);
      if (!res.ok) throw new Error("Error fetching population data");
      const result = await res.json();
      return result.data;
    },
    initialData: [],
  });

  const [chartType, setChartType] = React.useState<"line" | "bar">("bar");

  return (
    <Card my="6" size="4">
      <Heading as="h2" size="6" mb="3">
        <Flex gap="4" align="center">
          {t("Population Chart")}
          <Flex gap="1">
            <IconButton
              variant="ghost"
              color={chartType === "line" ? "yellow" : "gray"}
              onClick={() => setChartType("line")}
              aria-label={t("Line chart")}
            >
              <BiLineChart size="24" />
            </IconButton>
            <IconButton
              variant="ghost"
              color={chartType === "bar" ? "yellow" : "gray"}
              onClick={() => setChartType("bar")}
              aria-label={t("Bar chart")}
            >
              <BiBarChart size="24" />
            </IconButton>
          </Flex>
        </Flex>
      </Heading>
      {isLoading ? (
        <Skeleton height="300px" />
      ) : error ? (
        <Text color="red">{t("Error loading orders")}</Text>
      ) : (
        <PopulationChart data={data ?? []} chartType={chartType} />
      )}
    </Card>
  );
};

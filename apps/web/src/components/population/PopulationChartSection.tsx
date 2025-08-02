import { useQuery } from "@tanstack/react-query";
import { PopulationChart } from "@/components/population/PopulationChart";
import {
  Card,
  Heading,
  Text,
  Skeleton,
  IconButton,
  Flex,
  Select,
  Box,
} from "@radix-ui/themes";
import { useTranslation } from "react-i18next";
import React from "react";
import type { PopulationChartData } from "@/components/population/PopulationChart";
import { BiBarChart, BiLineChart } from "react-icons/bi";

type SortField = "Year" | "Population";
type SortDirection = "asc" | "desc";

export const PopulationChartSection: React.FC = () => {
  const { t } = useTranslation();
  const [sortField, setSortField] = React.useState<SortField>("Year");
  const [sortDirection, setSortDirection] =
    React.useState<SortDirection>("asc");
  const [limit, setLimit] = React.useState<number>(10);
  const [mode, setMode] = React.useState<"absolute" | "relative">("absolute");

  const { data, isLoading, error } = useQuery<PopulationChartData[]>({
    queryKey: ["population", sortField, sortDirection, limit],
    queryFn: async (): Promise<PopulationChartData[]> => {
      const res = await fetch(
        `/api/population?page=1&limit=${limit}&sort=${sortField}&order=${sortDirection}`
      );
      if (!res.ok) throw new Error(t("Error fetching population data"));
      const result = await res.json();
      return result.data;
    },
    initialData: [],
  });

  const [chartType, setChartType] = React.useState<"line" | "bar">("bar");

  return (
    <Card my="6" size="4">
      <Heading as="h2" size="6" mb="3">
        <Flex
          gap="4"
          align="center"
          justify="between"
          direction={{ initial: "column", md: "row" }}
        >
          <Flex align="center" gap="2">
            <Text>{t("Population Chart")}</Text>
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

          <Flex gap="3" align="center">
            <Box>
              <Select.Root
                size="2"
                value={String(limit)}
                onValueChange={(value) => setLimit(Number(value))}
              >
                <Select.Trigger placeholder={t("Show entries")} />
                <Select.Content>
                  <Select.Group>
                    <Select.Label>{t("Show entries")}</Select.Label>
                    <Select.Item value="5">5</Select.Item>
                    <Select.Item value="10">10</Select.Item>
                    <Select.Item value="25">25</Select.Item>
                    <Select.Item value="50">50</Select.Item>
                  </Select.Group>
                </Select.Content>
              </Select.Root>
            </Box>

            <Box>
              <Select.Root
                size="2"
                value={`${sortField}-${sortDirection}`}
                onValueChange={(value) => {
                  const [field, direction] = value.split("-");
                  setSortField(field as SortField);
                  setSortDirection(direction as SortDirection);
                }}
              >
                <Select.Trigger placeholder={t("Sort by")} />
                <Select.Content>
                  <Select.Group>
                    <Select.Label>{t("Sort by Year")}</Select.Label>
                    <Select.Item value="Year-asc">
                      {t("Oldest first")}
                    </Select.Item>
                    <Select.Item value="Year-desc">
                      {t("Newest first")}
                    </Select.Item>
                  </Select.Group>
                </Select.Content>
              </Select.Root>
            </Box>

            <Box>
              <Select.Root
                size="2"
                value={mode}
                onValueChange={(value) =>
                  setMode(value as "absolute" | "relative")
                }
              >
                <Select.Trigger placeholder={t("Mode")} />
                <Select.Content>
                  <Select.Group>
                    <Select.Label>{t("Mode")}</Select.Label>
                    <Select.Item value="absolute">{t("Absolute")}</Select.Item>
                    <Select.Item value="relative">{t("Relative")}</Select.Item>
                  </Select.Group>
                </Select.Content>
              </Select.Root>
            </Box>
          </Flex>
        </Flex>
      </Heading>

      {isLoading ? (
        <Skeleton height="300px" />
      ) : error ? (
        <Text color="red">{t("Error loading orders")}</Text>
      ) : (
        <>
          <Text size="2" color="gray" mb="2">
            {t("Population data for the USA")}
          </Text>
          <PopulationChart
            data={data ?? []}
            chartType={chartType}
            mode={mode}
          />
        </>
      )}
    </Card>
  );
};

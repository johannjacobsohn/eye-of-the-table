import { createFileRoute } from '@tanstack/react-router'
import { Card, Heading, Text, Flex, Grid } from '@radix-ui/themes'
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { OrdersChartSection } from '@/components/orders/OrdersChartSection';
import { DepotOverviewCard } from '@/components/DepotOverviewCard';


export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const { t } = useTranslation()
 
  const { data } = useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      const res = await fetch('/api/analytics');
      if (!res.ok) throw new Error('Fehler beim Laden der Analytics');
      return res.json();
    }
  });


  return (
    <>
      <Heading as="h1" size="8"><em>Eye</em>-Of<em>-</em>the-T<em>able</em></Heading>
      <Card my="6" size="4">
        <Heading as="h2" size="6" mb="3">{t("Welcome to the Trade Journal")}</Heading>
        <Text>
          {t("This is a simple application to track your trades. You can add, edit, and delete trades, and view your trading history. Feel free to explore the application and start tracking your trades!")}
        </Text>
      </Card>

      <DepotOverviewCard />

      <OrdersChartSection />

      <Grid my="6" columns={{ 'md': "2", 'lg': "3" }} gap="4">
        <Card size="3">
          <Flex direction="column" gap="4" align="center">
            <Text size="9">{data?.winRate ? (data.winRate * 100).toFixed(1) : '0'}</Text>
            <Text color='gray'>{t('Win Rate')}</Text>
          </Flex>
        </Card>
        <Card size="3">
          <Flex direction="column" gap="4" align="center">
            <Text size="9">{data?.profitFactor ? data.profitFactor.toFixed(2) : '0.00'}</Text>
            <Text color='gray'>{t('Profit Factor')}</Text>
          </Flex>
        </Card>
        <Card size="3">
          <Flex direction="column" gap="4" align="center">
            <Text size="9">{data?.avgWin ? data.avgWin.toFixed(2) : '0.00'}</Text>
            <Text color='gray'>{t('Average Win')}</Text>
          </Flex>
        </Card>
        <Card size="3">
          <Flex direction="column" gap="4" align="center">
            <Text size="9">{data?.avgLoss ? data.avgLoss.toFixed(2) : '0.00'}</Text>
            <Text color='gray'>{t('Average Loss')}</Text>
          </Flex>
        </Card>
        <Card size="3">
          <Flex direction="column" gap="4" align="center">
            <Text size="9">{data?.avgHoldDurationDays ? data.avgHoldDurationDays.toFixed(2) : '0.00'}</Text>
            <Text color='gray'>{t('Average Hold Duration')} ({t('days')})</Text>
          </Flex>
        </Card>
      </Grid>
    </>
  )
}

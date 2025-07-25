import React from "react";
import { Table, Button, Popover } from "@radix-ui/themes";
import { useTranslation } from "react-i18next";

export type Order = {
  id: number;
  symbol: string;
  quantity: number;
  price: number;
  side: "buy" | "sell";
  date: string;
  comments?: string;
};

interface OrdersTableProps {
  orders: Order[];
  onDelete?: (id: number) => void;
  deletingId?: number | null;
  onEdit?: (order: Order) => void;
  editOrderMutation?: { isPending: boolean };
}

export const OrdersTable: React.FC<OrdersTableProps> = ({
  orders,
  onDelete,
  deletingId,
  onEdit,
}) => {
  const { t } = useTranslation();

  return (
    <Table.Root variant="surface" size="3">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>{t("ID")}</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>{t("Symbol")}</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>{t("Quantity")}</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>{t("Price")}</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>{t("Side")}</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>{t("Date")}</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>{t("Comments")}</Table.ColumnHeaderCell>
          {(onEdit || onDelete) && (
            <Table.ColumnHeaderCell>{t("Action")}</Table.ColumnHeaderCell>
          )}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {orders.map((order) => (
          <Table.Row key={order.id}>
            <Table.Cell>{order.id}</Table.Cell>
            <Table.Cell>{order.symbol}</Table.Cell>
            <Table.Cell>{order.quantity}</Table.Cell>
            <Table.Cell>{order.price}</Table.Cell>
            <Table.Cell>{order.side}</Table.Cell>
            <Table.Cell>
              {order.date ? new Date(order.date).toLocaleString() : ""}
            </Table.Cell>
            <Table.Cell>{order.comments || ""}</Table.Cell>
            {(onEdit || onDelete) && (
              <Table.Cell>
                {onEdit && (
                  <Popover.Root onOpenChange={() => {}}>
                    <Popover.Trigger>
                      <Button
                        color="blue"
                        variant="soft"
                        size="1"
                        style={{ marginRight: 8 }}
                      >
                        {t("Edit")}
                      </Button>
                    </Popover.Trigger>
                    <Popover.Content style={{ maxWidth: 400 }}>
                      {t("Edit Order")}
                      <Popover.Close>
                        <Button
                          variant="soft"
                          color="gray"
                          mt="3"
                          style={{ width: "100%" }}
                        >
                          {t("Cancel")}
                        </Button>
                      </Popover.Close>
                    </Popover.Content>
                  </Popover.Root>
                )}
                {onDelete && (
                  <Button
                    color="red"
                    variant="soft"
                    size="1"
                    onClick={() => onDelete(order.id)}
                    loading={deletingId === order.id}
                    disabled={deletingId === order.id}
                  >
                    {t("Delete")}
                  </Button>
                )}
              </Table.Cell>
            )}
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
};

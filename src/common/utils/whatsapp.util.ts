interface OrderMessageItem {
  name: string;
  quantity: number;
  lineTotalCents: number;
}

interface BuildWhatsappMessageParams {
  orderCode: string;
  customerName: string;
  items: OrderMessageItem[];
  totalCents: number;
  addressLine: string;
  notes?: string;
}

export function formatCurrencyFromCents(value: number): string {
  return (value / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export function buildWhatsappMessage(
  params: BuildWhatsappMessageParams,
): string {
  const itemsText = params.items
    .map(
      (item) =>
        `- ${item.quantity}x ${item.name} (${formatCurrencyFromCents(item.lineTotalCents)})`,
    )
    .join('\n');

  const notesBlock = params.notes ? `\nObservacoes: ${params.notes}` : '';

  return [
    `Pedido ${params.orderCode}`,
    `Cliente: ${params.customerName}`,
    '',
    'Itens:',
    itemsText,
    '',
    `Total: ${formatCurrencyFromCents(params.totalCents)}`,
    `Entrega: ${params.addressLine}`,
    notesBlock,
  ]
    .filter(Boolean)
    .join('\n');
}

export function buildWhatsappUrl(
  whatsappNumber: string,
  message: string,
): string {
  const normalizedNumber = whatsappNumber.replace(/\D/g, '');
  return `https://wa.me/${normalizedNumber}?text=${encodeURIComponent(message)}`;
}


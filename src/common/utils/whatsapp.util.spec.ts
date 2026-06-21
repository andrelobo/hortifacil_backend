import {
  buildWhatsappMessage,
  buildWhatsappUrl,
  formatCurrencyFromCents,
} from './whatsapp.util';

describe('whatsapp util', () => {
  it('formats currency from cents in BRL', () => {
    expect(formatCurrencyFromCents(1798)).toBe('R$ 17,98');
  });

  it('builds a WhatsApp message with items and notes', () => {
    const message = buildWhatsappMessage({
      orderCode: 'HF-1001',
      customerName: 'Maria Souza',
      items: [
        {
          name: 'Tomate',
          quantity: 2,
          lineTotalCents: 1798,
        },
      ],
      totalCents: 1798,
      addressLine: 'Rua das Flores, 123 - Centro, Manaus/AM, CEP 69000000',
      notes: 'Entregar pela manhã',
    });

    expect(message).toContain('Pedido HF-1001');
    expect(message).toContain('Cliente: Maria Souza');
    expect(message).toContain('- 2x Tomate (R$ 17,98)');
    expect(message).toContain('Observacoes: Entregar pela manhã');
  });

  it('builds a normalized WhatsApp URL', () => {
    const url = buildWhatsappUrl(
      '+55 (92) 99999-9999',
      'Pedido HF-1001',
    );

    expect(url).toBe(
      'https://wa.me/5592999999999?text=Pedido%20HF-1001',
    );
  });
});

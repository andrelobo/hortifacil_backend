interface AddressLike {
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  complement?: string;
}

export function formatAddressLine(address: AddressLike): string {
  const complement = address.complement ? `, ${address.complement}` : '';
  return `${address.street}, ${address.number} - ${address.neighborhood}, ${address.city}/${address.state}, CEP ${address.zipCode}${complement}`;
}


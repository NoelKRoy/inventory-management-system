export interface Supplier {
  id: number;
  name: string;
  contact: string;
  email: string;
  address?: string;
  city?: string;
  phone?: string;
  createdAt?: string;
}

export class SupplierDetail implements Supplier {
  id!: number;
  name!: string;
  contact!: string;
  email!: string;
  address?: string;
  city?: string;
  phone?: string;
  createdAt?: string;

  constructor(supplier: Supplier) {
    Object.assign(this, supplier);
  }

  getDisplayName(): string {
    return `${this.name} (${this.city || 'Unknown'})`;
  }
}

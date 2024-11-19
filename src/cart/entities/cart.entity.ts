import { CartItem } from '../../cart-items/entities/cart-item.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalValue: number;

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart, { cascade: true })
  items: CartItem[];

  constructor(props: { items: string; totalValue: number }) {
    Object.assign(this, props);
  }

  calculateTotalValue(): void {
    this.totalValue = this.items.reduce(
      (total, item) => total + item.quantity * item.product.price,
      0,
    );
  }
}

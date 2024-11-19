import { Cart } from '../../cart/entities/cart.entity';
import { Product } from '../../products/entities/product.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, { eager: true })
  product: Product;

  @Column()
  quantity: number;

  @ManyToOne(() => Cart, (cart) => cart.items)
  cart: Cart;

  constructor(props: { product: Product; quantity: number }) {
    Object.assign(this, props);
  }

  changeQuantity(quantity: number) {
    if (!quantity) {
      throw new Error('Quantity is required');
    }
    this.quantity = quantity;
  }
}

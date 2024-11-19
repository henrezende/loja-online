import { UnprocessableEntityException } from '@nestjs/common';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column()
  stock: number = 0;

  constructor(props: {
    name: string;
    description?: string;
    price: number;
    stock?: number;
  }) {
    Object.assign(this, props);
  }

  changeName(name: string) {
    if (!name) {
      throw new UnprocessableEntityException('Name é obrigatório');
    }
    this.name = name;
  }

  changeDescription(description: string) {
    this.description = description;
  }

  changePrice(price: number) {
    if (!price || price < 0) {
      throw new UnprocessableEntityException('Preço inválido');
    }
    this.price = price;
  }

  changeStock(stock: number) {
    if (!stock || stock < 0) {
      throw new UnprocessableEntityException('Estoque inválido');
    }
    this.stock = stock;
  }
}

import { DataSource } from 'typeorm';
import { Product } from './products/entities/product.entity';
import { Order } from './orders/entities/order.entity';
import { OrderItem } from './orders/entities/order-item.entity';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'db',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'store',
    database: process.env.DB_NAME || 'store',
    entities: [Product, Order, OrderItem],
    migrations: ['./src/migrations/*.ts'],
    synchronize: false,
    logging: true,
});
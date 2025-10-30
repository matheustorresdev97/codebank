import { DataSource } from 'typeorm';
import { CreditCard } from './invoices/entities/credit-card.entity';
import { Invoice } from './invoices/entities/invoice.entity';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'db',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'invoices',
    database: process.env.DB_NAME || 'invoices',
    entities: [CreditCard, Invoice],
    migrations: ['./src/migrations/*.ts'],
    synchronize: false,
    logging: true,
});
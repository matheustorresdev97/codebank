import {
  Controller,
  Get,
  Param,
  ValidationPipe,
} from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { KafkaCreateInvoiceDto } from './dto/create-invoice.dto';

@Controller('credit-cards/:creditCardNumber/invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @MessagePattern('payments')
  create(@Payload(new ValidationPipe()) message: KafkaCreateInvoiceDto) {
    return this.invoicesService.create(message.value);
  }

  @Get()
  findAll(@Param('creditCardNumber') creditCardNumber: string) {
    return this.invoicesService.findAll(creditCardNumber);
  }
}

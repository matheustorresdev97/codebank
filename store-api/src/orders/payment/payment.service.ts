import { OnModuleInit } from '@nestjs/common';
import { Inject, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import type { ClientGrpc } from '@nestjs/microservices';
import { Observable, firstValueFrom, timeout, catchError } from 'rxjs';

interface PaymentData {
  creditCard: {
    number: string;
    name: string;
    expirationMonth: number;
    expirationYear: number;
    cvv: string;
  };
  amount: number;
  description: string;
  store: string;
}

interface PaymentGrpcRequest {
  creditCard: {
    number: string;
    name: string;
    expirationMonth: number;
    expirationYear: number;
    cvv: number; 
  };
  amount: number;
  description: string;
  store: string;
}

interface PaymentGrpcService {
  payment(data: PaymentGrpcRequest): Observable<void>;
}

@Injectable()
export class PaymentService implements OnModuleInit {
  private paymentGrpcService: PaymentGrpcService;

  constructor(@Inject('PAYMENT_PACKAGE') private clientGrpc: ClientGrpc) {}

  onModuleInit() {
    this.paymentGrpcService =
      this.clientGrpc.getService<PaymentGrpcService>('PaymentService');
  }

  async payment(data: PaymentData) {

    try {
      const paymentRequest: PaymentGrpcRequest = {
        creditCard: {
          name: data.creditCard.name,
          number: data.creditCard.number,
          expirationMonth: data.creditCard.expirationMonth,
          expirationYear: data.creditCard.expirationYear,
          cvv: parseInt(data.creditCard.cvv, 10),
        },
        amount: data.amount,
        store: data.store,
        description: data.description,
      };

      const result = await firstValueFrom(
        this.paymentGrpcService.payment(paymentRequest).pipe(
          timeout(30000),
          catchError((error) => {
            console.error('❌ gRPC payment error:', {
              name: error.name,
              message: error.message,
              code: error.code,
              details: error.details,
            });
            throw error;
          }),
        ),
      );
      return result;
    } catch (e) {
      throw new RpcException({
        code: e.code || 'UNKNOWN',
        message: e.message || 'Payment service error',
        details: e.details,
      });
    }
  }
}
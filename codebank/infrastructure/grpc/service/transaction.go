package service

import (
	"context"

	"github.com/matheustorresdev97/codebank/dto"
	"github.com/matheustorresdev97/codebank/infrastructure/grpc/pb"
	"github.com/matheustorresdev97/codebank/usecase"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

type TransactionService struct {
	ProcessTransactionUseCase usecase.UseCaseTransaction
	pb.UnimplementedPaymentServiceServer
}

func NewTransactionService() *TransactionService {
	return &TransactionService{}
}

func (t *TransactionService) Payment(ctx context.Context, in *pb.PaymentRequest) (*pb.PaymentResponse, error) {
	transactionDto := dto.Transaction{
		Name:            in.GetCreditCard().GetName(),
		Number:          in.GetCreditCard().GetNumber(),
		ExpirationMonth: in.GetCreditCard().GetExpirationMonth(),
		ExpirationYear:  in.GetCreditCard().GetExpirationYear(),
		CVV:             in.GetCreditCard().GetCvv(),
		Amount:          in.GetAmount(),
		Store:           in.GetStore(),
		Description:     in.GetDescription(),
	}

	transaction, err := t.ProcessTransactionUseCase.ProcessTransaction(transactionDto)
	if err != nil {
		return nil, status.Error(codes.FailedPrecondition, err.Error())
	}

	if transaction.Status != "approved" {
		return nil, status.Error(codes.FailedPrecondition, "transaction rejected by the bank")
	}

	// Retorne um PaymentResponse vazio (ou com dados, se quiser)
	return &pb.PaymentResponse{}, nil
}

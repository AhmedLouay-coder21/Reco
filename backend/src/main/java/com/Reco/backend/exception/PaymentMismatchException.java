package com.Reco.backend.exception;

public class PaymentMismatchException extends RuntimeException {
    public PaymentMismatchException(String message) {
        super(message);
    }
}

package com.Reco.backend.exception;

public class OrderNotEligibleException extends RuntimeException {
    public OrderNotEligibleException(String message) {
        super(message);
    }
}

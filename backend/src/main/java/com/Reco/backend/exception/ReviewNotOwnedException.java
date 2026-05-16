package com.Reco.backend.exception;

public class ReviewNotOwnedException extends RuntimeException {
    public ReviewNotOwnedException(String message) {
        super(message);
    }
}

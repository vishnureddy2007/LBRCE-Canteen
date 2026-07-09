package com.lbrce.canteen.exception;

/** Thrown for business-rule violations (e.g. order not in correct status). */
public class BadRequestException extends RuntimeException {
    public BadRequestException(String message) { super(message); }
}
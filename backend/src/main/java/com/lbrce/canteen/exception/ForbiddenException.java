package com.lbrce.canteen.exception;

/** Thrown when a user attempts a forbidden action. */
public class ForbiddenException extends RuntimeException {
    public ForbiddenException(String message) { super(message); }
}
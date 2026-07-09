package com.lbrce.canteen.exception;

/** Thrown on duplicate-key violations like a roll number already in use. */
public class ConflictException extends RuntimeException {
    public ConflictException(String message) { super(message); }
}
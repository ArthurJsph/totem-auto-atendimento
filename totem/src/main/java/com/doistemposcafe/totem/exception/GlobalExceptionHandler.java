package com.doistemposcafe.totem.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.util.Date;


@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    // 401 - Unauthorized
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorDetails> handleBadCredentialsException(Exception ex, WebRequest request) {
        return buildError(HttpStatus.UNAUTHORIZED, ex.getMessage(), request);
    }

    // 403 - Forbidden
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorDetails> handleAccessDeniedException(Exception ex, WebRequest request) {
        return buildError(HttpStatus.FORBIDDEN, "Acesso negado", request);
    }

    // 404 - Not Found
    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<ErrorDetails> handleUserNotFoundException(Exception ex, WebRequest request) {
        return buildError(HttpStatus.NOT_FOUND, ex.getMessage(), request);
    }

    // 400 - Bad Request
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorDetails> handleBadRequestException(Exception ex, WebRequest request) {
        return buildError(HttpStatus.BAD_REQUEST, ex.getMessage(), request);
    }

    // 500 - Internal Server Error
    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<ErrorDetails> handleDatabaseException(DataAccessException ex, WebRequest request) {
        return buildError(HttpStatus.INTERNAL_SERVER_ERROR, "Erro ao acessar o banco de dados", request);
    }

    // 500 - Another Exceptions
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorDetails> handleGlobalException(Exception ex, WebRequest request) {
        return buildError(HttpStatus.INTERNAL_SERVER_ERROR, "Erro interno no servidor", request);
    }

    // Auxiliary Class to Represent the Details of the Error
    private record ErrorDetails(Date timestamp, String message) {}

    // Auxiliary method for build objects of error details
    private ResponseEntity<ErrorDetails> buildError(HttpStatus status, String message, WebRequest request) {
        String uri = request.getDescription(false);
        logger.warn("Erro {}: {} - {}", status.value(), message, uri);
        ErrorDetails error = new ErrorDetails(new Date(), message);
        return ResponseEntity.status(status).body(error);
    }

    // Custom Exceptions
    @ExceptionHandler(ResourceAlreadyExistsException.class)
    public ResponseEntity<ErrorDetails> handleResourceAlreadyExistsException(Exception ex, WebRequest request) {
        return buildError(HttpStatus.BAD_REQUEST, ex.getMessage(), request);
    }

    // 401 - Unauthorized
    @ExceptionHandler(TokenExpiredException.class)
    public ResponseEntity<ErrorDetails> handleTokenExpiredException(TokenExpiredException ex, WebRequest request) {
        return buildError(HttpStatus.UNAUTHORIZED, ex.getMessage(), request);
    }

    // 401 - Unauthorized
    @ExceptionHandler(JwtException.class)
    public ResponseEntity<ErrorDetails> handleJwtException(JwtException ex, WebRequest request) {
        return buildError(HttpStatus.UNAUTHORIZED, ex.getMessage(), request);
    }
}

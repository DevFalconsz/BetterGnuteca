package com.biblioteca.service;

import com.biblioteca.dto.BookDTO;
import com.biblioteca.model.Author;
import com.biblioteca.model.Book;
import com.biblioteca.repository.AuthorRepository;
import com.biblioteca.repository.BookRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.biblioteca.exception.ResourceNotFoundException;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class BookService {

    private static final Logger logger = LoggerFactory.getLogger(BookService.class);

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private AuthorRepository authorRepository;

    @Transactional
    public Book createBook(BookDTO bookDTO) {
        logger.info("Iniciando criação do livro: {}", bookDTO.getTitulo());

        Book book = new Book();
        book.setTitulo(bookDTO.getTitulo());
        book.setPaginas(bookDTO.getPaginas());
        book.setDisponivel(bookDTO.isDisponivel());
        book.setDataPublicacao(bookDTO.getDataPublicacao());

        if (bookDTO.getAuthorIds() != null && !bookDTO.getAuthorIds().isEmpty()) {
            Set<Author> authors = bookDTO.getAuthorIds().stream()
                    .map(authorId -> authorRepository.findById(authorId)
                            .orElseThrow(() -> new ResourceNotFoundException("Autor não encontrado com o ID: " + authorId)))
                    .collect(Collectors.toSet());
            book.setAuthors(authors);

                        String authorNames = authors.stream()
                                                    .map(Author::getName)
                                                    .collect(Collectors.joining(", "));
                        book.setAutor(authorNames);        }

        Book savedBook = bookRepository.save(book);
        logger.info("Livro '{}' criado com sucesso com ID: {}", savedBook.getTitulo(), savedBook.getId());
        return savedBook;
    }

    public List<Book> getAllBooks() {
        logger.info("Buscando todos os livros");
        return bookRepository.findAll();
    }

    public Optional<Book> getBookById(Long id) {
        logger.info("Buscando livro com ID: {}", id);
        return bookRepository.findById(id);
    }

    @Transactional
    public Optional<Book> updateBook(Long id, BookDTO bookDTO) {
        logger.info("Atualizando livro com ID: {}", id);
        return bookRepository.findById(id).map(book -> {
            book.setTitulo(bookDTO.getTitulo());
            book.setPaginas(bookDTO.getPaginas());
            book.setDisponivel(bookDTO.isDisponivel());
            book.setDataPublicacao(bookDTO.getDataPublicacao());

            if (bookDTO.getAuthorIds() != null && !bookDTO.getAuthorIds().isEmpty()) {
                Set<Author> authors = new HashSet<>(authorRepository.findAllById(bookDTO.getAuthorIds()));
                book.setAuthors(authors);

                            String authorNames = authors.stream()
                                                        .map(Author::getName)
                                                        .collect(Collectors.joining(", "));
                            book.setAutor(authorNames);            }

            Book updatedBook = bookRepository.save(book);
            logger.info("Livro com ID: {} atualizado com sucesso.", id);
            return updatedBook;
        });
    }

    public void deleteBook(Long id) {
        logger.info("Deletando livro com ID: {}", id);
        bookRepository.deleteById(id);
    }

    @Transactional
    public Book save(Book book) {
        return bookRepository.save(book);
    }
}


package com.biblioteca.controller;

import com.biblioteca.model.Book;
import com.biblioteca.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST para a entidade Book.
 * Gerencia as requisições HTTP relacionadas às operações CRUD de livros.
 */
@RestController
@RequestMapping("/books") // Define o caminho base para todos os endpoints neste controlador
public class BookController {

    /**
     * Injeção de dependência do BookService.
     * O Spring se encarrega de criar e gerenciar uma instância de BookService.
     */
    @Autowired
    private BookService bookService;

    /**
     * Endpoint para criar um novo livro.
     * Mapeado para requisições POST em /books.
     * @param book O objeto Book enviado no corpo da requisição (JSON).
     * @return ResponseEntity com o livro criado e status HTTP 201 (Created).
     */
    @PostMapping
    public ResponseEntity<Book> createBook(@RequestBody Book book) {
        Book createdBook = bookService.createBook(book);
        return new ResponseEntity<>(createdBook, HttpStatus.CREATED);
    }

    /**
     * Endpoint para listar todos os livros.
     * Mapeado para requisições GET em /books.
     * @return ResponseEntity com a lista de todos os livros e status HTTP 200 (OK).
     */
    @GetMapping
    public ResponseEntity<List<Book>> getAllBooks() {
        List<Book> books = bookService.getAllBooks();
        return new ResponseEntity<>(books, HttpStatus.OK);
    }

    /**
     * Endpoint para consultar um livro por ID.
     * Mapeado para requisições GET em /books/{id}.
     * @param id O ID do livro a ser consultado, extraído do caminho da URL.
     * @return ResponseEntity com o livro encontrado e status HTTP 200 (OK), ou 404 (Not Found) se não existir.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Book> getBookById(@PathVariable Long id) {
        return bookService.getBookById(id)
                .map(book -> new ResponseEntity<>(book, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * Endpoint para atualizar um livro existente.
     * Mapeado para requisições PUT em /books/{id}.
     * @param id O ID do livro a ser atualizado, extraído do caminho da URL.
     * @param bookDetails O objeto Book com as informações atualizadas, enviado no corpo da requisição (JSON).
     * @return ResponseEntity com o livro atualizado e status HTTP 200 (OK), ou 404 (Not Found) se não existir.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Book> updateBook(@PathVariable Long id, @RequestBody Book bookDetails) {
        return bookService.updateBook(id, bookDetails)
                .map(book -> new ResponseEntity<>(book, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * Endpoint para excluir um livro por ID.
     * Mapeado para requisições DELETE em /books/{id}.
     * @param id O ID do livro a ser excluído, extraído do caminho da URL.
     * @return ResponseEntity com status HTTP 204 (No Content) se a exclusão for bem-sucedida.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable Long id) {
        bookService.deleteBook(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}


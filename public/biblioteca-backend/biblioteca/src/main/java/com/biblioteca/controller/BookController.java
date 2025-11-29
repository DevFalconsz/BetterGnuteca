package com.biblioteca.controller;

import com.biblioteca.dto.BookDTO;
import com.biblioteca.model.Book;
import com.biblioteca.service.BookService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/books")
public class BookController {

    private static final Logger logger = LoggerFactory.getLogger(BookController.class);

    @Autowired
    private BookService bookService;

    private final Path root = Paths.get("uploads");

    public BookController() {
        try {
            Files.createDirectories(root);
        } catch (IOException e) {
            throw new RuntimeException("Não foi possível inicializar a pasta para upload!");
        }
    }

    @PostMapping(consumes = "application/json")
    public ResponseEntity<Book> createBook(@RequestBody BookDTO bookDTO) {
        logger.info("Recebida requisição POST para criar livro: {}", bookDTO.getTitulo());
        Book createdBook = bookService.createBook(bookDTO);
        return new ResponseEntity<>(createdBook, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Book>> getAllBooks() {
        logger.info("Recebida requisição GET para listar todos os livros");
        List<Book> books = bookService.getAllBooks();
        return new ResponseEntity<>(books, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Book> getBookById(@PathVariable Long id) {
        logger.info("Recebida requisição GET para buscar livro com ID: {}", id);
        return bookService.getBookById(id)
                .map(book -> new ResponseEntity<>(book, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PutMapping(value = "/{id}", consumes = "application/json")
    public ResponseEntity<Book> updateBook(@PathVariable Long id, @RequestBody BookDTO bookDTO) {
        logger.info("Recebida requisição PUT para atualizar livro com ID: {}", id);
        return bookService.updateBook(id, bookDTO)
                .map(book -> new ResponseEntity<>(book, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable Long id) {
        logger.info("Recebida requisição DELETE para deletar livro com ID: {}", id);
        bookService.deleteBook(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PostMapping("/{id}/upload-pdf")
    public ResponseEntity<String> uploadPdf(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        logger.info("Recebida requisição POST para upload de PDF para o livro ID: {}. Nome do arquivo: {}", id, file.getOriginalFilename());
        Optional<Book> bookOptional = bookService.getBookById(id);

        if (bookOptional.isEmpty()) {
            return new ResponseEntity<>("Livro não encontrado.", HttpStatus.NOT_FOUND);
        }

        try {
            Files.copy(file.getInputStream(), this.root.resolve(file.getOriginalFilename()));
            Book book = bookOptional.get();
            book.setPdfPath(this.root.resolve(file.getOriginalFilename()).toString());
            bookService.save(book);
            return new ResponseEntity<>("Upload do arquivo realizado com sucesso: " + file.getOriginalFilename(), HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Falha no upload do arquivo: {}", e.getMessage());
            return new ResponseEntity<>("Falha no upload do arquivo!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/files/{filename:.+}")
    public ResponseEntity<Resource> getFile(@PathVariable String filename) {
        logger.info("Recebida requisição GET para baixar o arquivo: {}", filename);
        try {
            Path file = root.resolve(filename);
            Resource resource = new UrlResource(file.toUri());

            if (resource.exists() || resource.isReadable()) {
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                        .contentType(MediaType.APPLICATION_PDF)
                        .body(resource);
            } else {
                logger.warn("Arquivo não encontrado ou ilegível: {}", filename);
                throw new RuntimeException("Não foi possível ler o arquivo!");
            }
        } catch (MalformedURLException e) {
            logger.error("Erro de URL mal formada para o arquivo: {}", filename, e);
            throw new RuntimeException("Erro: " + e.getMessage());
        }
    }
}


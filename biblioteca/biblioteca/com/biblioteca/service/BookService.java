package com.biblioteca.service;

import com.biblioteca.model.Book;
import com.biblioteca.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Camada de Serviço para a entidade Book.
 * Contém a lógica de negócio para as operações CRUD de livros.
 */
@Service
public class BookService {

    /**
     * Injeção de dependência do BookRepository.
     * O Spring se encarrega de criar e gerenciar uma instância de BookRepository.
     */
    @Autowired
    private BookRepository bookRepository;

    /**
     * Salva um novo livro no banco de dados.
     * @param book O objeto Book a ser salvo.
     * @return O livro salvo, incluindo o ID gerado.
     */
    public Book createBook(Book book) {
        return bookRepository.save(book);
    }

    /**
     * Retorna uma lista de todos os livros cadastrados.
     * @return Uma lista de objetos Book.
     */
    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    /**
     * Busca um livro pelo seu ID.
     * @param id O ID do livro a ser buscado.
     * @return Um Optional contendo o livro, se encontrado, ou vazio se não existir.
     */
    public Optional<Book> getBookById(Long id) {
        return bookRepository.findById(id);
    }

    /**
     * Atualiza as informações de um livro existente.
     * @param id O ID do livro a ser atualizado.
     * @param bookDetails O objeto Book com as novas informações.
     * @return Um Optional contendo o livro atualizado, se encontrado, ou vazio se o ID não existir.
     */
    public Optional<Book> updateBook(Long id, Book bookDetails) {
        return bookRepository.findById(id).map(book -> {
            book.setTitulo(bookDetails.getTitulo());
            book.setAutor(bookDetails.getAutor());
            book.setPaginas(bookDetails.getPaginas());
            book.setDisponivel(bookDetails.isDisponivel());
            book.setDataPublicacao(bookDetails.getDataPublicacao());
            return bookRepository.save(book);
        });
    }

    /**
     * Exclui um livro do banco de dados pelo seu ID.
     * @param id O ID do livro a ser excluído.
     */
    public void deleteBook(Long id) {
        bookRepository.deleteById(id);
    }
}


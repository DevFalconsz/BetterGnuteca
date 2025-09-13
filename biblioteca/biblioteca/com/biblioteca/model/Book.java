package com.biblioteca.model;

import jakarta.persistence.*;
import java.time.LocalDate;

/**
 * Entidade que representa um Livro no sistema da Biblioteca.
 * Mapeada para a tabela "books" no banco de dados.
 */
@Entity
@Table(name = "books")
public class Book {

    /**
     * Identificador único do livro.
     * É a chave primária da tabela e é gerado automaticamente.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Título do livro.
     * Não pode ser nulo e tem um limite de 255 caracteres.
     */
    @Column(nullable = false, length = 255)
    private String titulo;

    /**
     * Nome do autor do livro.
     * Não pode ser nulo e tem um limite de 255 caracteres.
     */
    @Column(nullable = false, length = 255)
    private String autor;

    /**
     * Número de páginas do livro.
     * Não pode ser nulo.
     */
    @Column(nullable = false)
    private int paginas;

    /**
     * Indica se o livro está disponível para empréstimo.
     * Não pode ser nulo.
     */
    @Column(nullable = false)
    private boolean disponivel;

    /**
     * Data de publicação do livro.
     * Não pode ser nulo.
     */
    @Column(nullable = false)
    private LocalDate dataPublicacao;

    // Construtor padrão (necessário para JPA)
    public Book() {
    }

    // Construtor com todos os campos (útil para testes e criação de objetos)
    public Book(String titulo, String autor, int paginas, boolean disponivel, LocalDate dataPublicacao) {
        this.titulo = titulo;
        this.autor = autor;
        this.paginas = paginas;
        this.disponivel = disponivel;
        this.dataPublicacao = dataPublicacao;
    }

    // Getters e Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getAutor() {
        return autor;
    }

    public void setAutor(String autor) {
        this.autor = autor;
    }

    public int getPaginas() {
        return paginas;
    }

    public void setPaginas(int paginas) {
        this.paginas = paginas;
    }

    public boolean isDisponivel() {
        return disponivel;
    }

    public void setDisponivel(boolean disponivel) {
        this.disponivel = disponivel;
    }

    public LocalDate getDataPublicacao() {
        return dataPublicacao;
    }

    public void setDataPublicacao(LocalDate dataPublicacao) {
        this.dataPublicacao = dataPublicacao;
    }

    /**
     * Sobrescreve o método toString para fornecer uma representação em string do objeto Book.
     * Útil para depuração e logs.
     */
    @Override
    public String toString() {
        return "Book{" +
               "id=" + id +
               ", titulo='" + titulo + '\'' +
               ", autor='" + autor + '\'' +
               ", paginas=" + paginas +
               ", disponivel=" + disponivel +
               ", dataPublicacao=" + dataPublicacao +
               '}';
    }
}


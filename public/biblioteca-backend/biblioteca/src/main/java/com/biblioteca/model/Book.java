package com.biblioteca.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

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

    @Column(name = "autor", nullable = false)
    private String autor;

    @ManyToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    @JoinTable(
        name = "book_author",
        joinColumns = @JoinColumn(name = "book_id"),
        inverseJoinColumns = @JoinColumn(name = "author_id")
    )
    @JsonManagedReference
    private Set<Author> authors = new HashSet<>();

    /**
     * Número de páginas do livro.
     * Não pode ser nulo.
     */
    @Column(nullable = false)
    private int paginas;

    /**
     * Indica se o livro está disponível para empréstimo?
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

    /**
     * Caminho do arquivo PDF associado ao livro.
     * Pode ser nulo se o livro não tiver um PDF.
     */
    @Column(length = 500)
    private String pdfPath;

    // Construtor padrão (necessário para JPA)
    public Book() {
    }

    // Construtor com todos os campos (útil para testes e criação de objetos)
    public Book(String titulo, int paginas, boolean disponivel, LocalDate dataPublicacao, String pdfPath) {
        this.titulo = titulo;
        this.paginas = paginas;
        this.disponivel = disponivel;
        this.dataPublicacao = dataPublicacao;
        this.pdfPath = pdfPath;
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

    public Set<Author> getAuthors() {
        return authors;
    }

    public void setAuthors(Set<Author> authors) {
        this.authors = authors;
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

    public String getPdfPath() {
        return pdfPath;
    }

    public void setPdfPath(String pdfPath) {
        this.pdfPath = pdfPath;
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
               ", authors=" + authors +
               ", paginas=" + paginas +
               ", disponivel=" + disponivel +
               ", dataPublicacao=" + dataPublicacao +
               ", pdfPath='" + pdfPath + '\'' +
               '}';
    }
}


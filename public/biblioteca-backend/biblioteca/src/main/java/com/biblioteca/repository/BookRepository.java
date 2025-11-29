package com.biblioteca.repository;

import com.biblioteca.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Interface de repositório para a entidade Book.
 * Estende JpaRepository para fornecer operações CRUD básicas e funcionalidades de paginação e ordenação.
 * O primeiro parâmetro é o tipo da entidade (Book) e o segundo é o tipo da chave primária (Long).
 */
@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    // Métodos CRUD básicos são fornecidos automaticamente pelo JpaRepository.
    // Você pode adicionar métodos de consulta personalizados aqui, se necessário.
}


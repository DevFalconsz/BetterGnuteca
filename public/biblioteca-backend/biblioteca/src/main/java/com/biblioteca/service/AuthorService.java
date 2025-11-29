package com.biblioteca.service;

import com.biblioteca.dto.AuthorDTO;
import com.biblioteca.model.Author;
import com.biblioteca.repository.AuthorRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AuthorService {

    private static final Logger logger = LoggerFactory.getLogger(AuthorService.class);

    @Autowired
    private AuthorRepository authorRepository;

    public Author createAuthor(AuthorDTO authorDTO) {
        Author author = new Author();
        author.setName(authorDTO.getName());
        author.setDataNascimento(authorDTO.getDataNascimento());
        author.setNacionalidade(authorDTO.getNacionalidade());
        author.setBiografia(authorDTO.getBiografia());
        logger.info("Criando autor: {}", author.getName());
        return authorRepository.save(author);
    }
    
    public Author createAuthor(Author author) {
        logger.info("Criando autor: {}", author.getName());
        return authorRepository.save(author);
    }

    public List<Author> getAllAuthors() {
        logger.info("Buscando todos os autores");
        return authorRepository.findAll();
    }

    public Optional<Author> getAuthorById(Long id) {
        logger.info("Buscando autor com ID: {}", id);
        return authorRepository.findById(id);
    }

    public Optional<Author> updateAuthor(Long id, AuthorDTO authorDetails) {
        logger.info("Atualizando autor com ID: {}", id);
        return authorRepository.findById(id).map(author -> {
            author.setName(authorDetails.getName());
            author.setDataNascimento(authorDetails.getDataNascimento());
            author.setNacionalidade(authorDetails.getNacionalidade());
            author.setBiografia(authorDetails.getBiografia());
            return authorRepository.save(author);
        });
    }

    public void deleteAuthor(Long id) {
        logger.info("Deletando autor com ID: {}", id);
        authorRepository.deleteById(id);
    }
}

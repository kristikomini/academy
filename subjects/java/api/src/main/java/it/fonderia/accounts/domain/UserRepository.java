package it.fonderia.accounts.domain;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

/**
 * Accounts, looked up by their normalised username.
 *
 * <p>A top-level interface, not one nested inside another. Spring Data scans for
 * repository interfaces and does not find them nested in a non-repository outer type —
 * the symptom is a {@code NoSuchBeanDefinitionException} at start-up naming the nested
 * type, which is a confusing way to learn a packaging rule.
 */
public interface UserRepository extends JpaRepository<UserAccount, UUID> {

    Optional<UserAccount> findByUsername(String username);

    boolean existsByUsername(String username);
}

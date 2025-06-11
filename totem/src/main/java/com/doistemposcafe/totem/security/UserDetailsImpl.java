package com.doistemposcafe.totem.security;

import com.doistemposcafe.totem.model.Manager;
import com.doistemposcafe.totem.model.User;
// Importe sua classe/enum Role aqui se ela estiver em um pacote diferente
// Exemplo: import com.doistemposcafe.totem.model.Role;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

public class UserDetailsImpl implements UserDetails {

    private final String email;
    private final String password;
    private final List<GrantedAuthority> authorities;

    /**
     * Construtor para inicializar UserDetailsImpl com email, senha e role.
     * A role (do tipo Role) é convertida para uma SimpleGrantedAuthority usando sua representação em String.
     * @param email O email do usuário, que será usado como username.
     * @param password A senha do usuário.
     * @param role O objeto Role (ex: um enum como Role.ADMIN).
     */
    // Alterado o tipo do parâmetro 'role' de String para Role
    public UserDetailsImpl(String email, String password, com.doistemposcafe.totem.model.Role role) { // Assuming Role enum/class is in model package
        this.email = email;
        this.password = password;
        // CORREÇÃO AQUI: Chama .name() se Role for um enum, ou outro método se for uma classe (ex: .getValue())
        this.authorities = List.of(new SimpleGrantedAuthority(role.name()));
    }

    /**
     * Método de fábrica para criar UserDetailsImpl a partir de um objeto User.
     * Ele obtém o objeto Role do próprio objeto User.
     * É fundamental que a classe 'User' tenha um método 'getRole()' que retorne um objeto 'Role'.
     * @param user O objeto User do qual extrair os detalhes.
     * @return Uma instância de UserDetailsImpl com os detalhes do User.
     */
    public static UserDetailsImpl fromUser(User user) {
        // Agora user.getRole() deve retornar um objeto Role, não uma String
        return new UserDetailsImpl(user.getEmail(), user.getPassword(), user.getRole());
    }

    /**
     * Método de fábrica para criar UserDetailsImpl a partir de um objeto Manager.
     * Ele obtém o objeto Role do próprio objeto Manager.
     * É fundamental que a classe 'Manager' tenha um método 'getRole()' que retorne um objeto 'Role'.
     * @param manager O objeto Manager do qual extrair os detalhes.
     * @return Uma instância de UserDetailsImpl com os detalhes do Manager.
     */
    public static UserDetailsImpl fromManager(Manager manager) {
        // Agora manager.getRole() deve retornar um objeto Role, não uma String
        return new UserDetailsImpl(manager.getEmail(), manager.getPassword(), manager.getRole());
    }

    // Métodos da interface UserDetails
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email; // O email é usado como username para autenticação
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // Implementação padrão, ajuste conforme sua necessidade
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // Implementação padrão, ajuste conforme sua necessidade
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // Implementação padrão, ajuste conforme sua necessidade
    }

    @Override
    public boolean isEnabled() {
        return true; // Implementação padrão, ajuste conforme sua necessidade
    }
}

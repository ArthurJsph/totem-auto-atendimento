package com.doistemposcafe.totem.security;

import com.doistemposcafe.totem.model.Manager;
import com.doistemposcafe.totem.model.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

public class UserDetailsImpl implements UserDetails {

    private final String email;
    private final String password;
    private final List<GrantedAuthority> authorities;

    public UserDetailsImpl(String email, String password, String role) {
        this.email = email;
        this.password = password;
        this.authorities = List.of(new SimpleGrantedAuthority(role));
    }

    public static UserDetailsImpl fromUser(User user) {
        return new UserDetailsImpl(user.getEmail(), user.getPassword(), "CLIENT");
    }

    public static UserDetailsImpl fromManager(Manager manager) {
        return new UserDetailsImpl(manager.getEmail(), manager.getPassword(), "MANAGER");
    }

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
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}

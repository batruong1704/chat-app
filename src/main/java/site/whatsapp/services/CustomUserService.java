package site.whatsapp.services;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import site.whatsapp.models.UserModel;
import site.whatsapp.repositorys.UserRepository;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomUserService implements UserDetailsService {
    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        UserModel userModel = userRepository.findByEmail(email);
        if (userModel == null) {
            throw new UsernameNotFoundException("Không tìm thấy user: " + email);
        }

        List<GrantedAuthority> authorityList = new ArrayList<>();
        return new User(userModel.getEmail(), userModel.getPassword(), authorityList);
    }



}

package com.musify.service;

import com.musify.dto.AuthRequest;
import com.musify.dto.AuthResponse;
import com.musify.dto.RegisterRequest;
import com.musify.entity.Artist;
import com.musify.entity.User;
import com.musify.exception.BadRequestException;
import com.musify.repository.ArtistRepository;
import com.musify.repository.UserRepository;
import com.musify.security.JwtTokenProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final ArtistRepository artistRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthService(UserRepository userRepository, 
                       ArtistRepository artistRepository,
                       PasswordEncoder passwordEncoder, 
                       JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.artistRepository = artistRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    public AuthResponse login(AuthRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new BadRequestException("Invalid email or password");
        }

        String token = tokenProvider.generateToken(user.getId(), user.getEmail(), user.getRole());
        AuthResponse.UserDto userDto = new AuthResponse.UserDto(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getProfileImage()
        );

        return new AuthResponse(token, userDto);
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered");
        }

        String role = "ARTIST".equalsIgnoreCase(request.getRole()) ? "ARTIST" : "USER";

        User user = new User(
                request.getName(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                role,
                request.getProfileImage()
        );

        User savedUser = userRepository.save(user);

        // If artist account, create Artist profile
        if ("ARTIST".equals(role)) {
            Artist artist = new Artist(
                    savedUser.getId(),
                    savedUser.getName(),
                    "Verified MUSIFY Artist & Creator",
                    savedUser.getProfileImage(),
                    100L
            );
            artistRepository.save(artist);
        }

        String token = tokenProvider.generateToken(savedUser.getId(), savedUser.getEmail(), savedUser.getRole());
        AuthResponse.UserDto userDto = new AuthResponse.UserDto(
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getRole(),
                savedUser.getProfileImage()
        );

        return new AuthResponse(token, userDto);
    }
}

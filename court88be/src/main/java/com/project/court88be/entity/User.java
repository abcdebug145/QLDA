package com.project.court88be.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.Set;
import com.project.court88be.enums.Role;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(unique = true, nullable = false)
    private String phone;

    @Column(nullable = false)
    private String password;

    private String name;
    private String address;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private Role role; // CHU_SÂN, QUẢN_LÝ, NHÂN_VIÊN, KHÁCH_HÀNG

    // Quan hệ với các entity khác nếu cần
    @JsonIgnore
    @OneToMany(mappedBy = "user")
    private Set<Booking> bookings;

    @JsonIgnore
    @OneToMany(mappedBy = "user")
    private Set<Cart> carts;

    // getter, setter
    // ...
}

//
//  ProfileView.swift
//  FalconSafe
//
//  Created by user on 09.11.2024.
//

import SwiftUI

struct ProfileOptionsView: View {
    @State private var isRegistration = false
    @State private var isAuthorization = false
    @Environment(\.dismiss) var dismiss // Это свойство позволяет закрыть текущий экран

    var body: some View {
        NavigationStack {
            VStack(spacing: 20) {
                if isRegistration {
                    RegistrationView(isRegistration: $isRegistration)
                } else if isAuthorization {
                    AuthorizationView(isAuthorization: $isAuthorization)
                } else {
                    VStack(spacing: 20) {
                        Button("Регистрация") {
                            isRegistration = true
                        }
                        .font(.headline)
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Color.blue)
                        .foregroundColor(.white)
                        .cornerRadius(10)
                        .padding(.horizontal)

                        Button("Авторизация") {
                            isAuthorization = true
                        }
                        .font(.headline)
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Color.green)
                        .foregroundColor(.white)
                        .cornerRadius(10)
                        .padding(.horizontal)
                    }
                    .navigationTitle("Профиль")
                    .toolbar {
                        ToolbarItem(placement: .navigationBarLeading) {
                            Button(action: {
                                dismiss() // Закрытие текущего экрана
                            }) {
                                HStack {
                                    Image(systemName: "arrow.backward")
                                    Text("Назад")
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

struct RegistrationView: View {
    @Binding var isRegistration: Bool
    @State private var login = ""
    @State private var password = ""
    @State private var confirmPassword = ""

    var body: some View {
        VStack(spacing: 20) {
            TextField("Логин", text: $login)
                .textFieldStyle(RoundedBorderTextFieldStyle())
                .padding(.horizontal)

            SecureField("Пароль", text: $password)
                .textFieldStyle(RoundedBorderTextFieldStyle())
                .padding(.horizontal)

            SecureField("Повторите пароль", text: $confirmPassword)
                .textFieldStyle(RoundedBorderTextFieldStyle())
                .padding(.horizontal)
        }
        .navigationTitle("Регистрация")
        .toolbar {
            ToolbarItem(placement: .navigationBarLeading) {
                Button(action: {
                    isRegistration = false
                }) {
                    HStack {
                        Image(systemName: "arrow.backward")
                        Text("Назад")
                    }
                }
            }
        }
    }
}

struct AuthorizationView: View {
    @Binding var isAuthorization: Bool
    @State private var login = ""
    @State private var password = ""

    var body: some View {
        VStack(spacing: 20) {
            TextField("Логин", text: $login)
                .textFieldStyle(RoundedBorderTextFieldStyle())
                .padding(.horizontal)

            SecureField("Пароль", text: $password)
                .textFieldStyle(RoundedBorderTextFieldStyle())
                .padding(.horizontal)
        }
        .navigationTitle("Авторизация")
        .toolbar {
            ToolbarItem(placement: .navigationBarLeading) {
                Button(action: {
                    isAuthorization = false
                }) {
                    HStack {
                        Image(systemName: "arrow.backward")
                        Text("Назад")
                    }
                }
            }
        }
    }
}

struct ProfileOptionsView_Previews: PreviewProvider {
    static var previews: some View {
        ProfileOptionsView()
    }
}

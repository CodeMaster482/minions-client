//
//  ProfileView.swift
//  FalconSafe
//
//  Created by user on 09.11.2024.
//

import SwiftUI
import WebKit

struct ProfileOptionsView: View {
    @Binding var isLoggedIn: Bool
    @State private var isRegistration = false
    @State private var isAuthorization = false
    @State private var htmlContent: String? = nil  // Для хранения HTML-контента
    @Environment(\.dismiss) var dismiss

    var body: some View {
        NavigationStack {
            VStack(spacing: 20) {
                if isLoggedIn {
                    // Отображаем HTML-график
                    if let htmlContent = htmlContent {
                        WebView(htmlContent: htmlContent)
                        .frame(maxWidth: .infinity, maxHeight: .infinity)
                        .padding(.top, 20)
                    }

                    // Кнопка "Выход из аккаунта"
                    Button("Выход из аккаунта") {
                        logoutUser()
                    }
                    
                    .font(.headline)
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color.red)
                    .foregroundColor(.white)
                    .cornerRadius(10)
                    .padding(.horizontal)
                    
                } else if isRegistration {
                    RegistrationView(isRegistration: $isRegistration, isLoggedIn: $isLoggedIn)
                } else if isAuthorization {
                    AuthorizationView(isAuthorization: $isAuthorization, isLoggedIn: $isLoggedIn)
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
                }
            }
            .navigationTitle("Профиль")
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button(action: {
                        dismiss()
                    }) {
                        HStack {
                            Image(systemName: "arrow.backward")
                            //Text("Назад")
                        }
                    }
                }
            }
        }
        .onChange(of: isLoggedIn) { newValue in
            if newValue {
                fetchHtmlContent()  // Загружаем HTML-контент при успешном входе
            } else {
                htmlContent = nil  // Если пользователь вышел, очищаем HTML
            }
        }
        .onAppear {
                    if isLoggedIn {
                        fetchHtmlContent()  // Загружаем HTML-контент при успешном входе
                    }
                }
    }

    private func fetchHtmlContent() {
        guard let url = URL(string: "http://90.156.219.248:8080/api/statistics/top-links") else {
            return
        }

        let task = URLSession.shared.dataTask(with: url) { data, response, error in
            DispatchQueue.main.async {
                if let error = error {
                    print("Ошибка при загрузке HTML: \(error.localizedDescription)")
                    return
                }

                if let data = data, let htmlString = String(data: data, encoding: .utf8) {
                    htmlContent = htmlString  // Сохраняем HTML в состояние
                }
            }
        }
        task.resume()
    }

    private func logoutUser() {
        guard let url = URL(string: "http://90.156.219.248:8080/api/auth/logout") else { return }

        var request = URLRequest(url: url)
        request.httpMethod = "POST"

        let task = URLSession.shared.dataTask(with: request) { data, response, error in
            DispatchQueue.main.async {
                if let error = error {
                    print("Ошибка при выходе из аккаунта: \(error.localizedDescription)")
                    return
                }

                guard let httpResponse = response as? HTTPURLResponse else { return }

                if httpResponse.statusCode == 200 {
                    isLoggedIn = false
                } else {
                    print("Ошибка выхода: \(httpResponse.statusCode)")
                }
            }
        }
        task.resume()
    }
}

// WebView для отображения HTML-контента
struct WebView: View {
    let htmlContent: String
    
    var body: some View {
        WebViewRepresentable(htmlContent: htmlContent)
    }
}

struct WebViewRepresentable: UIViewRepresentable {
    let htmlContent: String

    func makeUIView(context: Context) -> WKWebView {
        let webView = WKWebView()
        return webView
    }

    func updateUIView(_ uiView: WKWebView, context: Context) {
        if let htmlData = htmlContent.data(using: .utf8) {
            uiView.load(htmlData, mimeType: "text/html", characterEncodingName: "UTF-8", baseURL: URL(string: "http://90.156.219.248:8080")!)
        }
    }
}


struct RegistrationView: View {
    @Binding var isRegistration: Bool
    @Binding var isLoggedIn: Bool
    @State private var login = ""
    @State private var password = ""
    @State private var confirmPassword = ""
    @State private var errorMessage = ""

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

            Button("Зарегистрироваться") {
                registerUser()
            }
            .font(.headline)
            .frame(maxWidth: .infinity)
            .padding()
            .background(Color.green)
            .foregroundColor(.white)
            .cornerRadius(10)
            .padding(.horizontal)

            if !errorMessage.isEmpty {
                Text(errorMessage)
                    .foregroundColor(.red)
                    .padding(.horizontal)
            }
        }
        .navigationTitle("Регистрация")
        .toolbar {
            ToolbarItem(placement: .navigationBarLeading) {
                Button(action: {
                    isRegistration = false
                }) {
                    HStack {
                        Image(systemName: "arrow.backward")
                        //Text("Назад")
                    }
                }
            }
        }
    }
    private func registerUser() {
            guard let url = URL(string: "http://90.156.219.248:8080/api/auth/register") else {
                errorMessage = "Некорректный URL."
                return
            }

            guard password == confirmPassword else {
                errorMessage = "Пароли не совпадают."
                return
            }

            let registrationData = [
                "username": login,
                "password": password
            ]

            guard let jsonData = try? JSONSerialization.data(withJSONObject: registrationData, options: []) else {
                errorMessage = "Ошибка формирования данных."
                return
            }

            var request = URLRequest(url: url)
            request.httpMethod = "POST"
            request.setValue("application/json", forHTTPHeaderField: "Content-Type")
            request.httpBody = jsonData

            let task = URLSession.shared.dataTask(with: request) { data, response, error in
                DispatchQueue.main.async {
                    if let error = error {
                        errorMessage = "Ошибка: \(error.localizedDescription)"
                        return
                    }

                    guard let httpResponse = response as? HTTPURLResponse else {
                        errorMessage = "Неизвестный ответ сервера."
                        return
                    }

                    switch httpResponse.statusCode {
                    case 201:
                        errorMessage = "Регистрация успешна!"
                        isRegistration = false
                        isLoggedIn = true
                    case 400:
                        errorMessage = "Неверные данные для регистрации."
                    case 500:
                        errorMessage = "Внутренняя ошибка сервера."
                    default:
                        if let data = data, let responseString = String(data: data, encoding: .utf8) {
                            errorMessage = "Ошибка: \(responseString)"
                        } else {
                            errorMessage = "Неизвестная ошибка."
                        }
                    }
                    print(errorMessage)
                }
            }
            task.resume()
        }
}

struct AuthorizationView: View {
    @Binding var isAuthorization: Bool
    @Binding var isLoggedIn: Bool
    @State private var login = ""
    @State private var password = ""
    @State private var errorMessage = ""

    var body: some View {
        VStack(spacing: 20) {
            TextField("Логин", text: $login)
                .textFieldStyle(RoundedBorderTextFieldStyle())
                .padding(.horizontal)

            SecureField("Пароль", text: $password)
                .textFieldStyle(RoundedBorderTextFieldStyle())
                .padding(.horizontal)

            Button("Войти") {
                loginUser()
            }
            .font(.headline)
            .frame(maxWidth: .infinity)
            .padding()
            .background(Color.blue)
            .foregroundColor(.white)
            .cornerRadius(10)
            .padding(.horizontal)

            if !errorMessage.isEmpty {
                Text(errorMessage)
                    .foregroundColor(.red)
                    .padding(.horizontal)
            }
        }
        .navigationTitle("Авторизация")
        .toolbar {
            ToolbarItem(placement: .navigationBarLeading) {
                Button(action: {
                    isAuthorization = false
                }) {
                    HStack {
                        Image(systemName: "arrow.backward")
                        //Text("Назад")
                    }
                }
            }
        }
    }

    private func loginUser() {
            guard let url = URL(string: "http://90.156.219.248:8080/api/auth/login") else {
                errorMessage = "Некорректный URL."
                return
            }

            let loginData = [
                "username": login,
                "password": password
            ]

            guard let jsonData = try? JSONSerialization.data(withJSONObject: loginData, options: []) else {
                errorMessage = "Ошибка формирования данных."
                return
            }

            var request = URLRequest(url: url)
            request.httpMethod = "POST"
            request.setValue("application/json", forHTTPHeaderField: "Content-Type")
            request.httpBody = jsonData

            let task = URLSession.shared.dataTask(with: request) { data, response, error in
                DispatchQueue.main.async {
                    if let error = error {
                        errorMessage = "Ошибка: \(error.localizedDescription)"
                        return
                    }

                    guard let httpResponse = response as? HTTPURLResponse else {
                        errorMessage = "Неизвестный ответ сервера."
                        return
                    }

                    switch httpResponse.statusCode {
                    case 200:
                        errorMessage = "Успешный вход!"
                        isAuthorization = false
                        isLoggedIn = true
                    case 400, 401:
                        errorMessage = "Неверные данные для входа."
                    case 500:
                        errorMessage = "Внутренняя ошибка сервера."
                    default:
                        if let data = data, let responseString = String(data: data, encoding: .utf8) {
                            errorMessage = "Ошибка: \(responseString)"
                        } else {
                            errorMessage = "Неизвестная ошибка."
                        }
                    }
                    print(errorMessage)
                }
            }
            task.resume()
        }
}

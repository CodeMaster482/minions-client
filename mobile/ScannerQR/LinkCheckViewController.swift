import SwiftUI
import AVFoundation

struct LinkCheckView: View {
    @State private var link: String = ""
    @State private var result: String = ""
    @State private var showScanner: Bool = false
    
    var body: some View {
        NavigationView {
            VStack {
                // Кнопка "Проверить ссылку"
                Button(action: checkLink) {
                    Text("Проверить ссылку")
                        .font(.headline)
                        .padding()
                        .background(Color.blue)
                        .foregroundColor(.white)
                        .cornerRadius(10)
                }
                .frame(maxWidth: .infinity)
                .padding(.bottom)
                
                // Поле для ввода ссылки
                TextField("Вставьте ссылку здесь", text: $link)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                    .padding()
                    .frame(maxWidth: .infinity)
                
                // Результат проверки
                Text(result)
                    .padding()
                    .foregroundColor(.green)
                
                Spacer()
                
                // Кнопка "Сканировать QR-код"
                Button(action: {
                    showScanner = true // Показываем сканер
                }) {
                    Text("Сканировать QR-код")
                        .font(.headline)
                        .padding()
                        .background(Color.green)
                        .foregroundColor(.white)
                        .cornerRadius(10)
                }
                .frame(maxWidth: .infinity)
                .padding(.top)
            }
            .padding()
            .navigationTitle("Проверка ссылки")
            .fullScreenCover(isPresented: $showScanner) {
                QRCodeScanner { scannedLink in
                    self.link = scannedLink
                    self.showScanner = false
                }
            }
        }
    }
    
    private func checkLink() {
        // Проверяем, что введена ссылка
        guard !link.isEmpty, let encodedLink = link.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed),
              let url = URL(string: "http://90.156.219.248:8080/api/scan/domain?request=\(encodedLink)") else {
            result = "Введите корректную ссылку."
            return
        }
        
        // Создаем GET-запрос
        let task = URLSession.shared.dataTask(with: url) { data, response, error in
            if let error = error {
                DispatchQueue.main.async {
                    result = "Ошибка: \(error.localizedDescription)"
                }
                return
            }
            
            guard let data = data else {
                DispatchQueue.main.async {
                    result = "Нет данных."
                }
                return
            }
            
            // Выводим ответ от сервера в консоль
            if let dataString = String(data: data, encoding: .utf8) {
                print("Ответ от сервера: \(dataString)")
            }
            
            do {
                // Парсим JSON-ответ
                if let json = try JSONSerialization.jsonObject(with: data, options: []) as? [String: Any],
                   let color = json["color"] as? String {
                    DispatchQueue.main.async {
                        result = "Статус ссылки: \(color == "red" ? "Опасна" : "Безопасна")"
                    }
                } else {
                    DispatchQueue.main.async {
                        result = "Не удалось распознать ответ."
                    }
                }
            } catch {
                DispatchQueue.main.async {
                    result = "Ошибка при обработке ответа."
                }
            }
        }
        task.resume()
    }
}

struct QRCodeScanner: UIViewControllerRepresentable {
    var onQRCodeScanned: (String) -> Void

    func makeUIViewController(context: Context) -> ViewController {
        let viewController = ViewController()
        viewController.onQRCodeScanned = { scannedLink in
            onQRCodeScanned(scannedLink)
        }
        viewController.startRunning() // Запускаем сессию при создании
        return viewController
    }

    func updateUIViewController(_ uiViewController: ViewController, context: Context) {
        // Обновление не требуется
    }
}

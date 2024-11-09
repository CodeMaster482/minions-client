import SwiftUI
import AVFoundation
import UniformTypeIdentifiers

struct LinkCheckView: View {
    @State private var link: String = ""
    @State private var result: String = ""
    @State private var showScanner: Bool = false
    @State private var showDocumentPicker: Bool = false
    @State private var showImagePicker: Bool = false
    @State private var selectedFileURL: URL?
    @State private var textColor: Color = .black

    var body: some View {
        NavigationView {
            VStack(spacing: 20) {
                TextField("Вставьте ссылку здесь", text: $link)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                    .padding(.horizontal)
                    .autocapitalization(.none)

                Button(action: checkLink) {
                    Text("Проверить ссылку")
                        .font(.headline)
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Color.accentColor)
                        .foregroundColor(.white)
                        .cornerRadius(10)
                }
                .padding(.horizontal)

                ScrollView {
                    Text(result)
                        .padding()
                        .foregroundColor(textColor)
                        .frame(maxWidth: .infinity, alignment: .leading)
                }

                Spacer()

                HStack(spacing: 20) {
                    Button(action: {
                        showScanner = true
                    }) {
                        VStack {
                            Image(systemName: "qrcode.viewfinder")
                                .resizable()
                                .scaledToFit()
                                .frame(height: 50)
                            Text("Сканировать QR")
                                .font(.caption)
                        }
                    }

                    Button(action: {
                        showImagePicker = true
                    }) {
                        VStack {
                            Image(systemName: "photo")
                                .resizable()
                                .scaledToFit()
                                .frame(height: 50)
                            Text("Выбрать фото")
                                .font(.caption)
                        }
                    }

                    Button(action: {
                        showDocumentPicker = true
                    }) {
                        VStack {
                            Image(systemName: "doc")
                                .resizable()
                                .scaledToFit()
                                .frame(height: 50)
                            Text("Выбрать файл")
                                .font(.caption)
                        }
                    }
                }
                .padding(.bottom)
            }
            .navigationTitle("Проверка ссылки")
            .sheet(isPresented: $showScanner) {
                QRCodeScanner { scannedLink in
                    self.link = scannedLink
                    self.showScanner = false
                    checkLink()
                }
            }
            .sheet(isPresented: $showDocumentPicker) {
                DocumentPicker(selectedFileURL: $selectedFileURL, onFileSelected: { url in
                    uploadFile(at: url)
                })
            }
            .sheet(isPresented: $showImagePicker) {
                ImagePicker(selectedImageURL: $selectedFileURL, onImageSelected: { url in
                    uploadImage(at: url)
                })
            }
        }
    }

    private func checkLink() {
        guard !link.isEmpty, let encodedLink = link.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed),
              let url = URL(string: "http://90.156.219.248:8080/api/scan/uri?request=\(encodedLink)") else {
            result = "Введите корректную ссылку."
            return
        }

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

            if let dataString = String(data: data, encoding: .utf8) {
                print("Ответ от сервера: \(dataString)")
            }

            do {
                let decoder = JSONDecoder()
                let scanResponse = try decoder.decode(ScanResponse.self, from: data)

                DispatchQueue.main.async {
                    var resultText = ""

                    // Обработка статуса зоны
                    if let zone = scanResponse.zone {
                        switch zone {
                        case "Red":
                            resultText = "Статус ссылки: Опасна\n"
                            textColor = .red
                        case "Green":
                            resultText = "Статус ссылки: Безопасна\n"
                            textColor = .green
                        default:
                            resultText = "Статус ссылки: Неизвестен\n"
                            textColor = .gray
                        }
                    } else {
                        resultText = "Статус ссылки: Неизвестен\n"
                        textColor = .gray
                    }

                    // Информация о URL
                    if let urlInfo = scanResponse.urlGeneralInfo {
                        let urlCategories = urlInfo.categories.joined(separator: ", ")
                        resultText += """

                        Информация о URL:
                        URL: \(urlInfo.url)
                        Категории: \(urlCategories.isEmpty ? "нет данных" : urlCategories)
                        Количество файлов: \(urlInfo.filesCount)
                        """
                    }

                    // Информация об IP, если доступна
                    if let ipInfo = scanResponse.ipGeneralInfo {
                        let ipCategories = ipInfo.categories.joined(separator: ", ")
                        resultText += """

                        Информация об IP:
                        IP: \(ipInfo.ip)
                        Категории: \(ipCategories.isEmpty ? "нет данных" : ipCategories)
                        Страна: \(ipInfo.countryCode)
                        """
                    }

                    // Информация о домене, если доступна
                    if let domainInfo = scanResponse.domainGeneralInfo {
                        let domainCategories = domainInfo.categories.joined(separator: ", ")
                        resultText += """

                        Информация о домене:
                        Домен: \(domainInfo.domain)
                        Категории: \(domainCategories.isEmpty ? "нет данных" : domainCategories)
                        Количество файлов: \(domainInfo.filesCount)
                        Количество IP: \(domainInfo.ipv4Count)
                        Количество обращений: \(domainInfo.hitsCount)
                        """
                    }

                    result = resultText
                }
            } catch {
                print("Ошибка при декодировании: \(error.localizedDescription)")
                DispatchQueue.main.async {
                    result = "Ошибка при обработке ответа."
                    textColor = .gray
                }
            }

        }
        task.resume()
    }

    private func uploadFile(at url: URL) {
        // Проверяем расширение файла
        let fileExtension = url.pathExtension.lowercased()
        if fileExtension == "png" || fileExtension == "jpg" || fileExtension == "jpeg" {
            uploadImage(at: url)
            return
        }

        guard let serverURL = URL(string: "http://90.156.219.248:8080/api/scan/file") else {
            result = "Некорректный URL сервера."
            return
        }

        var request = URLRequest(url: serverURL)
        request.httpMethod = "POST"

        let boundary = UUID().uuidString
        request.setValue("multipart/form-data; boundary=\(boundary)", forHTTPHeaderField: "Content-Type")

        var body = Data()

        // Добавляем файл в тело запроса
        let filename = url.lastPathComponent
        let mimeType = "application/octet-stream"
        body.append("--\(boundary)\r\n".data(using: .utf8)!)
        body.append("Content-Disposition: form-data; name=\"file\"; filename=\"\(filename)\"\r\n".data(using: .utf8)!)
        body.append("Content-Type: \(mimeType)\r\n\r\n".data(using: .utf8)!)
        body.append(try! Data(contentsOf: url))
        body.append("\r\n".data(using: .utf8)!)
        body.append("--\(boundary)--\r\n".data(using: .utf8)!)

        request.httpBody = body

        let task = URLSession.shared.dataTask(with: request) { data, response, error in
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

            do {
                let decoder = JSONDecoder()
                let scanResponse = try decoder.decode(ScanResponse.self, from: data)

                DispatchQueue.main.async {
                    var resultText = ""

                    // Обработка статуса зоны
                    if let zone = scanResponse.zone {
                        switch zone {
                        case "Red":
                            resultText = "Статус файла: Опасен\n"
                            textColor = .red
                        case "Green":
                            resultText = "Статус файла: Безопасен\n"
                            textColor = .green
                        default:
                            resultText = "Статус файла: Неизвестен\n"
                            textColor = .gray
                        }
                    } else {
                        resultText = "Статус файла: Неизвестен\n"
                        textColor = .gray
                    }

                    // Информация о URL
                    if let urlInfo = scanResponse.urlGeneralInfo {
                        let urlCategories = urlInfo.categories.joined(separator: ", ")
                        resultText += """

                        Информация о URL:
                        URL: \(urlInfo.url)
                        Категории: \(urlCategories.isEmpty ? "нет данных" : urlCategories)
                        Количество файлов: \(urlInfo.filesCount)
                        """
                    }

                    // Информация об IP, если доступна
                    if let ipInfo = scanResponse.ipGeneralInfo {
                        let ipCategories = ipInfo.categories.joined(separator: ", ")
                        resultText += """

                        Информация об IP:
                        IP: \(ipInfo.ip)
                        Категории: \(ipCategories.isEmpty ? "нет данных" : ipCategories)
                        Страна: \(ipInfo.countryCode)
                        """
                    }

                    // Информация о домене, если доступна
                    if let domainInfo = scanResponse.domainGeneralInfo {
                        let domainCategories = domainInfo.categories.joined(separator: ", ")
                        resultText += """

                        Информация о домене:
                        Домен: \(domainInfo.domain)
                        Категории: \(domainCategories.isEmpty ? "нет данных" : domainCategories)
                        Количество файлов: \(domainInfo.filesCount)
                        Количество IP: \(domainInfo.ipv4Count)
                        Количество обращений: \(domainInfo.hitsCount)
                        """
                    }

                    result = resultText
                }
            } catch {
                print("Ошибка при декодировании: \(error.localizedDescription)")
                DispatchQueue.main.async {
                    result = "Ошибка при обработке ответа."
                    textColor = .gray
                }
            }
        }
        task.resume()
    }

    private func uploadImage(at url: URL) {
        guard let serverURL = URL(string: "http://90.156.219.248:8080/api/scan/screen") else {
            result = "Некорректный URL сервера."
            return
        }

        var request = URLRequest(url: serverURL)
        request.httpMethod = "POST"

        let boundary = UUID().uuidString
        request.setValue("multipart/form-data; boundary=\(boundary)", forHTTPHeaderField: "Content-Type")

        var body = Data()

        let filename = url.lastPathComponent
        let mimeType = "image/\(url.pathExtension.lowercased())"
        body.append("--\(boundary)\r\n".data(using: .utf8)!)
        body.append("Content-Disposition: form-data; name=\"file\"; filename=\"\(filename)\"\r\n".data(using: .utf8)!)
        body.append("Content-Type: \(mimeType)\r\n\r\n".data(using: .utf8)!)
        body.append(try! Data(contentsOf: url))
        body.append("\r\n".data(using: .utf8)!)
        body.append("--\(boundary)--\r\n".data(using: .utf8)!)

        request.httpBody = body

        let task = URLSession.shared.dataTask(with: request) { data, response, error in
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

            do {
                let decoder = JSONDecoder()
                let screenResponse = try decoder.decode(ScreenScanResponse.self, from: data)

                DispatchQueue.main.async {
                    var resultText = ""

                    for (key, scanResponse) in screenResponse.results {
                        resultText += "Результат для ссылки: \(key)\n"

                        // Обработка статуса зоны
                        if let zone = scanResponse.zone {
                            switch zone {
                            case "Red":
                                resultText += "Статус ссылки: Опасна\n"
                                textColor = .red
                            case "Green":
                                resultText += "Статус ссылки: Безопасна\n"
                                textColor = .green
                            default:
                                resultText += "Статус ссылки: Неизвестен\n"
                                textColor = .gray
                            }
                        } else {
                            resultText += "Статус ссылки: Неизвестен\n"
                            textColor = .gray
                        }

                        // Информация о URL
                        if let urlInfo = scanResponse.urlGeneralInfo {
                            let urlCategories = urlInfo.categories.joined(separator: ", ")
                            resultText += """

                            Информация о URL:
                            URL: \(urlInfo.url)
                            Категории: \(urlCategories.isEmpty ? "нет данных" : urlCategories)
                            Количество файлов: \(urlInfo.filesCount)
                            """
                        }

                        // Информация об IP, если доступна
                        if let ipInfo = scanResponse.ipGeneralInfo {
                            let ipCategories = ipInfo.categories.joined(separator: ", ")
                            resultText += """

                            Информация об IP:
                            IP: \(ipInfo.ip)
                            Категории: \(ipCategories.isEmpty ? "нет данных" : ipCategories)
                            Страна: \(ipInfo.countryCode)
                            """
                        }

                        // Информация о домене, если доступна
                        if let domainInfo = scanResponse.domainGeneralInfo {
                            let domainCategories = domainInfo.categories.joined(separator: ", ")
                            resultText += """

                            Информация о домене:
                            Домен: \(domainInfo.domain)
                            Категории: \(domainCategories.isEmpty ? "нет данных" : domainCategories)
                            Количество файлов: \(domainInfo.filesCount)
                            Количество IP: \(domainInfo.ipv4Count)
                            Количество обращений: \(domainInfo.hitsCount)
                            """
                        }

                        resultText += "\n\n"
                    }

                    result = resultText
                }
            } catch {
                print("Ошибка при декодировании: \(error.localizedDescription)")
                DispatchQueue.main.async {
                    result = "Ошибка при обработке ответа."
                    textColor = .gray
                }
            }
        }
        task.resume()
    }
}

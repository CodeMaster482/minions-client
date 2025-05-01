import SwiftUI
import PhotosUI

struct ImagePicker: UIViewControllerRepresentable {
    @Binding var selectedImageURL: URL?
    var onImageSelected: (URL) -> Void

    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }

    func makeUIViewController(context: Context) -> some UIViewController {
        var configuration = PHPickerConfiguration()
        configuration.filter = .images

        let picker = PHPickerViewController(configuration: configuration)
        picker.delegate = context.coordinator

        return picker
    }

    func updateUIViewController(_ uiViewController: UIViewControllerType, context: Context) {
        // Не требуется
    }

    class Coordinator: NSObject, PHPickerViewControllerDelegate {
        var parent: ImagePicker

        init(_ parent: ImagePicker) {
            self.parent = parent
        }

        func picker(_ picker: PHPickerViewController, didFinishPicking results: [PHPickerResult]) {
            picker.dismiss(animated: true)

            guard let provider = results.first?.itemProvider else {
                return
            }

            if provider.hasItemConformingToTypeIdentifier(UTType.image.identifier) {
                provider.loadDataRepresentation(forTypeIdentifier: UTType.image.identifier) { data, error in
                    if let data = data {
                        DispatchQueue.main.async {
                            // Сохранение данных во временный файл
                            let tempDirectory = FileManager.default.temporaryDirectory
                            let fileName = UUID().uuidString + ".jpg"
                            let fileURL = tempDirectory.appendingPathComponent(fileName)
                            do {
                                try data.write(to: fileURL)
                                self.parent.selectedImageURL = fileURL
                                self.parent.onImageSelected(fileURL)
                            } catch {
                                print("Ошибка при сохранении изображения во временный файл: \(error)")
                            }
                        }
                    } else {
                        print("Ошибка при загрузке данных изображения: \(error?.localizedDescription ?? "Неизвестная ошибка")")
                    }
                }
            }
        }
    }
}

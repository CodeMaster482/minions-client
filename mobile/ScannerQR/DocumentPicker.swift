import SwiftUI
import UniformTypeIdentifiers

struct DocumentPicker: UIViewControllerRepresentable {
    @Binding var selectedFileURL: URL?
    var onFileSelected: (URL) -> Void

    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }

    func makeUIViewController(context: Context) -> UIDocumentPickerViewController {
        let types = [UTType.data]
        let picker = UIDocumentPickerViewController(forOpeningContentTypes: types, asCopy: true)
        picker.delegate = context.coordinator
        picker.allowsMultipleSelection = false
        return picker
    }

    func updateUIViewController(_ uiViewController: UIDocumentPickerViewController, context: Context) {
        // Обновление не требуется
    }

    class Coordinator: NSObject, UIDocumentPickerDelegate {
        var parent: DocumentPicker

        init(_ parent: DocumentPicker) {
            self.parent = parent
        }

        func documentPicker(_ controller: UIDocumentPickerViewController, didPickDocumentsAt urls: [URL]) {
            if let url = urls.first {
                parent.selectedFileURL = url
                parent.onFileSelected(url)
            }
        }

        func documentPickerWasCancelled(_ controller: UIDocumentPickerViewController) {
            // Обработка отмены выбора файла
            parent.selectedFileURL = nil // Сброс URL, если необходимо
            print("Выбор документа отменён")
        }
    }
}

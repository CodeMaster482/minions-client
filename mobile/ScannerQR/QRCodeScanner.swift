import SwiftUI
import AVFoundation

struct QRCodeScanner: UIViewControllerRepresentable {
    var onQRCodeScanned: (String) -> Void

    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }

    func makeUIViewController(context: Context) -> ViewController {
        let scannerVC = ViewController()
        scannerVC.delegate = context.coordinator
        return scannerVC
    }

    func updateUIViewController(_ uiViewController: ViewController, context: Context) {
        // Не требуется
    }

    class Coordinator: NSObject, QRScannerDelegate {
        var parent: QRCodeScanner

        init(_ parent: QRCodeScanner) {
            self.parent = parent
        }

        func didScanQRCode(_ code: String) {
            parent.onQRCodeScanned(code)
        }
    }
}

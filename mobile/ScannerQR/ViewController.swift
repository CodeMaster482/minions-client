import UIKit
import AVFoundation

class ViewController: UIViewController, AVCaptureMetadataOutputObjectsDelegate {
    var video = AVCaptureVideoPreviewLayer()
    let session = AVCaptureSession()
    
    // Замыкание для обработки считанного QR-кода
    var onQRCodeScanned: ((String) -> Void)?

    override func viewDidLoad() {
        super.viewDidLoad()
        setupVideo()
    }
    
    func setupVideo() {
        guard let captureDevice = AVCaptureDevice.default(for: AVMediaType.video) else {
            // Если устройство не найдено, показываем алерт и возвращаемся на предыдущий экран
            DispatchQueue.main.async {
                self.showCameraAccessError()
            }
            return
        }

        do {
            let input = try AVCaptureDeviceInput(device: captureDevice)
            session.addInput(input)
        } catch {
            fatalError(error.localizedDescription)
        }

        let output = AVCaptureMetadataOutput()
        session.addOutput(output)

        output.setMetadataObjectsDelegate(self, queue: DispatchQueue.main)
        output.metadataObjectTypes = [AVMetadataObject.ObjectType.qr]

        video = AVCaptureVideoPreviewLayer(session: session)
        video.frame = view.layer.bounds
        view.layer.addSublayer(video)
        
        // Запуск сессии на фоновом потоке
        DispatchQueue.global(qos: .userInitiated).async {
            self.session.startRunning()
        }
    }

    private func showCameraAccessError() {
        let alert = UIAlertController(title: "Ошибка доступа", message: "Не удалось получить доступ к камере. Пожалуйста, проверьте настройки приложения.", preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "OK", style: .default, handler: { _ in
            self.dismiss(animated: true, completion: nil)
        }))
        
        // Проверяем, находимся ли мы на главном потоке
        if Thread.isMainThread {
            present(alert, animated: true, completion: nil)
        } else {
            DispatchQueue.main.async {
                self.present(alert, animated: true, completion: nil)
            }
        }
    }

    
    func startRunning() {
        view.layer.addSublayer(video)
        session.startRunning()
    }
    
    func metadataOutput(_ output: AVCaptureMetadataOutput, didOutput metadataObjects: [AVMetadataObject], from connection: AVCaptureConnection) {
        guard metadataObjects.count > 0 else { return }
        if let object = metadataObjects.first as? AVMetadataMachineReadableCodeObject {
            if object.type == AVMetadataObject.ObjectType.qr, let stringValue = object.stringValue {
                onQRCodeScanned?(stringValue) // Вызов замыкания с считанным значением
                session.stopRunning() // Остановка сессии после сканирования
                view.layer.sublayers?.removeLast() // Удаление слоя превью
            }
        }
    }
}

import UIKit
import AVFoundation

protocol QRScannerDelegate: AnyObject {
    func didScanQRCode(_ code: String)
}

class ViewController: UIViewController, AVCaptureMetadataOutputObjectsDelegate {
    weak var delegate: QRScannerDelegate?

    var captureSession: AVCaptureSession!
    var previewLayer: AVCaptureVideoPreviewLayer!

    override func viewDidLoad() {
        super.viewDidLoad()

        view.backgroundColor = UIColor.black
        captureSession = AVCaptureSession()

        guard let videoCaptureDevice = AVCaptureDevice.default(for: .video) else {
            showError()
            return
        }

        guard let videoInput = try? AVCaptureDeviceInput(device: videoCaptureDevice) else {
            showError()
            return
        }

        if captureSession.canAddInput(videoInput) {
            captureSession.addInput(videoInput)
        } else {
            showError()
            return
        }

        let metadataOutput = AVCaptureMetadataOutput()

        if captureSession.canAddOutput(metadataOutput) {
            captureSession.addOutput(metadataOutput)

            metadataOutput.setMetadataObjectsDelegate(self, queue: DispatchQueue.main)
            metadataOutput.metadataObjectTypes = [.qr]
        } else {
            showError()
            return
        }

        previewLayer = AVCaptureVideoPreviewLayer(session: captureSession)
        previewLayer.frame = view.layer.bounds
        previewLayer.videoGravity = .resizeAspectFill
        view.layer.addSublayer(previewLayer)

        captureSession.startRunning()
    }

    func showError() {
        let alert = UIAlertController(title: "Ошибка", message: "Невозможно запустить камеру", preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "OK", style: .default) { _ in
            self.dismiss(animated: true)
        })
        present(alert, animated: true)
        captureSession = nil
    }

    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)

        if captureSession?.isRunning == false {
            captureSession.startRunning()
        }
    }

    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)

        if captureSession?.isRunning == true {
            captureSession.stopRunning()
        }
    }

    func metadataOutput(_ output: AVCaptureMetadataOutput, didOutput metadataObjects: [AVMetadataObject], from connection: AVCaptureConnection) {
        captureSession.stopRunning()

        if let metadataObject = metadataObjects.first {
            guard let readableObject = metadataObject as? AVMetadataMachineReadableCodeObject,
                  let stringValue = readableObject.stringValue else { return }
            AudioServicesPlaySystemSound(SystemSoundID(kSystemSoundID_Vibrate))
            delegate?.didScanQRCode(stringValue)
            dismiss(animated: true)
        }
    }

    override var prefersStatusBarHidden: Bool {
        return true
    }
}

import SwiftUI
import AVFoundation

struct ContentView: View {
    @State private var animate = false
    @State private var isLoading = true // состояние для показа экрана загрузки
    @State private var cameraAccessGranted = false // состояние для доступа к камере

    var body: some View {
        ZStack {
            if isLoading {
                LoadingView(animate: $animate)
                    .onAppear {
                        requestCameraAccess() // Запрос доступа к камере
                        withAnimation(.easeInOut(duration: 1)) {
                            animate.toggle()
                        }
                        DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
                            print("Переход на основной экран")
                            withAnimation {
                                isLoading = false
                            }
                        }
                    }
            } else {
                // Основной экран
                LinkCheckView()
            }
        }
        .edgesIgnoringSafeArea(.all)
    }

    private func requestCameraAccess() {
        AVCaptureDevice.requestAccess(for: .video) { granted in
            DispatchQueue.main.async {
                cameraAccessGranted = granted
                if granted {
                    print("Access camera granted")
                } else {
                    print("Access camera denied")
                }
            }
        }
    }
}

struct LoadingView: View {
    @Binding var animate: Bool

    var body: some View {
        ZStack {
            Image("LaunchImage")
                .resizable()
                .scaledToFit()
                .scaleEffect(animate ? 4 : 1)
                .opacity(animate ? 0 : 1)

            VStack {
                Spacer()
                Text("Загрузка...")
                    .font(.headline)
                    .foregroundColor(.white)
                    .padding(.bottom, 20)
            }
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}

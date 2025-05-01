import SwiftUI
import AVFoundation

struct ContentView: View {
    @State private var isLoading = true
    @State private var showLinkCheckView = false

    var body: some View {
        ZStack {
            if isLoading {
                LoadingView()
                    .onAppear {
                        requestCameraAccess()
                        DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
                            withAnimation {
                                isLoading = false
                                showLinkCheckView = true
                            }
                        }
                    }
            } else if showLinkCheckView {
                LinkCheckView()
            }
        }
        .edgesIgnoringSafeArea(.all)
    }

    private func requestCameraAccess() {
        AVCaptureDevice.requestAccess(for: .video) { granted in
            if granted {
                print("Access to camera granted")
            } else {
                print("Access to camera denied")
            }
        }
    }
}

struct LoadingView: View {
    var body: some View {
        VStack {
            Spacer()
            Image(systemName: "shield.lefthalf.fill")
                .resizable()
                .scaledToFit()
                .frame(width: 100, height: 100)
                .foregroundColor(.blue)
            Text("Загрузка...")
                .font(.headline)
                .padding()
            Spacer()
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const url = params.get("url");
  
    const btn = document.getElementById("proceed-btn");
    if (btn) {
      btn.addEventListener("click", () => {
        if (url) {
          window.open(decodeURIComponent(url), "_blank");
        } else {
          alert("Ссылка недействительна.");
        }
      });
    }
  });
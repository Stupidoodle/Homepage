document.addEventListener("DOMContentLoaded", () => {
    const windowWidth = window.innerWidth; // Use window.innerWidth for full window size
    const windowHeight = window.innerHeight; // Use window.innerHeight for full window size
    let str = "";
    let count = 0;
    let snowCount = (windowWidth * windowHeight) / 10000;

    let container = document.createElement("div");
    container.className = "snow-container";
    document.body.appendChild(container);

    function randINRange(min, max) {
        const rand = Math.random();
        return min + Math.floor(rand * (max - min + 1));
    }

    function createSnow() {
        this.html = document.createElement("div");
        this.html.className = "snow";
        this.html.style.opacity = Math.random();
        this.html.style.transform = `scale(${Math.random() * 3})`;
        this.html.style.animationName = `fall-${count}`;
        this.html.style.animationDelay = `${Math.random() * -30}s`;
        this.html.style.animationDuration = `${randINRange(10, 30)}s`;
        container.appendChild(this.html);
    }

    function createFrames() {
        const y = Math.floor(randINRange(30000, 80000) / 100000);
        str += ` @keyframes fall-${count} {
            ${y}% {
                transform: translate(${Math.random() * 100}vw, ${y}vh);
            }
            100% {
                transform: translate( ${Math.floor(Math.random() * 100)}vw, 100vh);
            }
        }
        `;
    }

    for (let i = 0; i < snowCount; i++) {
        createSnow();
        createFrames();
        count++;
    }

    const style = document.createElement("style");
    style.innerHTML += str;
    document.head.appendChild(style);
}); 

function showText(image, readmeUrl, redir) {
    // Get the modal container and modal content elements
    const modalContainer = document.getElementById("modalContainer");
    const modalContent = document.getElementById("modalContent");

    // Fetch the README.md content using the provided URL
    fetch(readmeUrl)
        .then(response => response.text())
        .then(markdownContent => {
            // Convert Markdown to HTML using Showdown
            const converter = new showdown.Converter();
            const htmlContent = converter.makeHtml(markdownContent);

            // Set the HTML content of the modal
            modalContent.innerHTML = htmlContent;

            // Show the modal by adding a "show" class to the modal container
            modalContainer.classList.add("show");
        })
        .catch(error => {
            console.error("Error fetching or converting Markdown:", error);
        });

    // When clicking outside the modal, close it
    modalContainer.addEventListener("click", closeModal);
    document.addEventListener("keydown", handleKeyDown);
    window.open(redir);
}

function closeModal(event) {
    // Check if the click is within the modal content
    if(event != null){
        if (event.target.closest("#modalContent")) {
            return;
        }
    }

    // Get the modal container and modal content elements
    const modalContainer = document.getElementById("modalContainer");
    const modalContent = document.getElementById("modalContent");

    // Hide the modal by removing the "show" class from the modal container
    modalContainer.classList.remove("show");

    // Remove the click event listener to prevent multiple popups
    modalContainer.removeEventListener("click", closeModal);
    document.removeEventListener("keydown", handleKeyDown);
}  

function handleKeyDown(event) {
    // Check if the "Escape" key is pressed (key code 27)
    if (event.code === "Escape") {
        closeModal();
    }
} 
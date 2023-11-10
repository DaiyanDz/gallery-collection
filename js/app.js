const access_key = "Gt_49H4ByCo9p_foEw2MAqR9ta-unz9_FwhtOXvOkIc";
const apiUrl = "https://api.unsplash.com/photos/random";

async function fetchPhotos(query, count = 25) {
    try {
        let url = `${apiUrl}?client_id=${access_key}&count=${count}`;

        if (query) {
            url += `&query=${query}`;
        }

        const response = await fetch(url);
        const data = await response.json();
        const photoContainer = document.querySelector(".photo-container");
        photoContainer.innerHTML = '';

        data.forEach(photo => {
            const photoDiv = document.createElement("div");
            photoDiv.classList.add("photo");
            const img = document.createElement("img");
            img.src = photo.urls.regular;
            img.alt = photo.alt_description;
            img.addEventListener("click", () => openModal(photo.urls.regular));
            photoDiv.appendChild(img);
            photoContainer.appendChild(photoDiv);
        });
    } catch (error) {
        console.error("Error fetching photos:", error);
    }
}

// Add the count to the fetchPhotos function
function openModal(imageUrl) {
    const modal = document.getElementById("modal");
    const modalImage = document.getElementById("modalImage");
    const downloadButton = document.getElementById("downloadButton");
    const copyButton = document.getElementById("copyButton");

    modalImage.src = imageUrl;
    downloadButton.href = imageUrl;
    copyButton.addEventListener("click", () => copyLinkToClipboard(imageUrl));

    modal.style.display = "block";
    document.getElementById("closeButton").addEventListener("click", closeModal);
    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });
}

// Modal
function openModal(imageUrl) {
    const modal = new bootstrap.Modal(document.getElementById("modal"));
    const modalImage = document.getElementById("modalImage");
    const downloadButton = document.getElementById("downloadButton");
    const copyButton = document.getElementById("copyButton");

    // Determine if the image is portrait or landscape
    const img = new Image();
    img.src = imageUrl;
    img.onload = function () {
        modalImage.src = imageUrl;  // Set the image source first

        if (img.height > img.width) {
            modal._element.classList.add("portrait");
            modal._element.classList.remove("landscape");

            modalImage.style.width = "auto";
            modalImage.style.height = "100%";
        } else {
            modal._element.classList.add("landscape");
            modal._element.classList.remove("portrait");

            modalImage.style.width = "100%";
            modalImage.style.height = "auto";
        }

        modal.show();
    };

    downloadButton.href = imageUrl;
    copyButton.addEventListener("click", () => copyLinkToClipboard(imageUrl));

    document.querySelector(".modal-header .btn-close").addEventListener("click", () => {
        modal._element.classList.remove("portrait", "landscape");
        modal.hide();
    });
    window.addEventListener("click", (event) => {
        if (event.target === modal._element) {
            modal._element.classList.remove("portrait", "landscape");
            modal.hide();
        }
    });
}

function copyLinkToClipboard(link) {
    const tempInput = document.createElement("input");
    tempInput.value = link;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
    alert("Link copied to clipboard!");
}

const popularTags = ['Nature', 'City', 'Food', 'Animal', 'People'];
const tagContainer = document.getElementById('tagContainer');
popularTags.forEach(tag => {
    const tagElement = document.createElement('div');
    tagElement.className = 'tag';
    tagElement.textContent = tag;
    tagElement.addEventListener('click', () => {
        const searchInput = document.getElementById("searchInput");
        searchInput.value = tag;
        fetchPhotos(tag);
    });
    tagContainer.appendChild(tagElement);
});

fetchPhotos();

// Search button
const searchForm = document.querySelector("form[role='search']");
searchForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission behavior
    const searchInput = document.getElementById("searchInput").value;
    fetchPhotos(searchInput);
});

//Landscape
const filterLandscape = document.getElementById('photoLandscape');
filterLandscape.addEventListener('click', () => {
    filterImagesBySize('landscape');
});

//Portrait
const filterPortrait = document.getElementById('photoPortrait');
filterPortrait.addEventListener('click', () => {
    filterImagesBySize('portrait');
});

// Function to filter
function filterImagesBySize(size) {
    const images = document.querySelectorAll('.gallery img');
    images.forEach(img => {
        const image = new Image();
        image.src = img.src;
        image.onload = function () {
            const isLandscape = image.width > image.height;
            if ((size === 'landscape' && isLandscape) || (size === 'portrait' && !isLandscape)) {
                img.style.display = 'block';
            } else {
                img.style.display = 'none';
            }
        };
    });
}


async function filterImagesBySize(size, count) {
    const images = document.querySelectorAll('.photo img');

    for (const img of images) {
        await loadImage(img).then(image => {
            const isLandscape = image.naturalWidth > image.naturalHeight;
            img.parentElement.style.display = (size === 'landscape' && isLandscape) || (size === 'portrait' && !isLandscape)
                ? 'block'
                : 'none';
        });
    }
}

function loadImage(img) {
    return new Promise(resolve => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.src = img.src;
    });
}

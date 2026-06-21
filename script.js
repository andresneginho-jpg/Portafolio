document.addEventListener('DOMContentLoaded', () => {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleries = document.querySelectorAll('.gallery');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const targetFilter = btn.getAttribute('data-filter');

            // Hide all galleries and reset their animations
            galleries.forEach(gallery => {
                gallery.classList.remove('active');
            });

            // Show target gallery
            const targetGallery = document.getElementById(`gallery-${targetFilter}`);
            if (targetGallery) {
                // Force a reflow to ensure the CSS animation restarts
                void targetGallery.offsetWidth;
                targetGallery.classList.add('active');
            }
        });
    });

    // Lightbox Logic
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxVideo = document.getElementById('lightbox-video');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    let carouselImages = [];
    let currentCarouselIndex = 0;

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            const vid = item.querySelector('video');
            const carouselData = item.getAttribute('data-carousel');
            
            // Ocultar ambos inicialmente
            lightboxImg.style.display = 'none';
            if (lightboxVideo) {
                lightboxVideo.style.display = 'none';
                lightboxVideo.pause();
            }
            
            if (lightboxPrev && lightboxNext) {
                lightboxPrev.style.display = 'none';
                lightboxNext.style.display = 'none';
            }
            carouselImages = [];

            if (carouselData) {
                carouselImages = carouselData.split(',');
                currentCarouselIndex = 0;
                lightboxImg.src = carouselImages[currentCarouselIndex];
                lightboxImg.style.display = 'block';
                if (lightboxPrev && lightboxNext) {
                    lightboxPrev.style.display = 'block';
                    lightboxNext.style.display = 'block';
                }
                lightbox.classList.add('active');
            } else if (img) {
                lightboxImg.src = img.src;
                lightboxImg.style.display = 'block';
                lightbox.classList.add('active');
            } else if (vid) {
                lightboxVideo.src = vid.src;
                lightboxVideo.style.display = 'block';
                lightboxVideo.play();
                lightbox.classList.add('active');
            }
        });
    });

    if (lightboxPrev && lightboxNext) {
        lightboxPrev.addEventListener('click', (e) => {
            e.stopPropagation(); // Evitar cerrar el lightbox
            if (carouselImages.length > 0) {
                currentCarouselIndex = (currentCarouselIndex - 1 + carouselImages.length) % carouselImages.length;
                lightboxImg.src = carouselImages[currentCarouselIndex];
            }
        });

        lightboxNext.addEventListener('click', (e) => {
            e.stopPropagation(); // Evitar cerrar el lightbox
            if (carouselImages.length > 0) {
                currentCarouselIndex = (currentCarouselIndex + 1) % carouselImages.length;
                lightboxImg.src = carouselImages[currentCarouselIndex];
            }
        });
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        if (lightboxVideo) {
            lightboxVideo.pause();
            // Limpiar el src para que deje de cargar/reproducir en segundo plano
            setTimeout(() => {
                if (!lightbox.classList.contains('active')) {
                    lightboxVideo.src = '';
                }
            }, 400); // Dar tiempo a la transición de CSS
        }
    }

    lightboxClose.addEventListener('click', closeLightbox);

    // Cierra el lightbox si se hace clic fuera de la imagen o video
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
});

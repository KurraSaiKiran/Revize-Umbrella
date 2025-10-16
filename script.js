document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const umbrellaImage = document.getElementById('umbrella-image');
    const logoPreview = document.getElementById('logo-preview');
    const logoUpload = document.getElementById('logo-upload');
    const colorSwatches = document.querySelectorAll('.color-swatch');
    const loader = document.getElementById('loader');
    const logoControls = document.getElementById('logo-controls');
    const scaleSlider = document.getElementById('scale-slider');
    const rotateSlider = document.getElementById('rotate-slider');
    const scaleValue = document.getElementById('scale-value');
    const rotateValue = document.getElementById('rotate-value');
    const downloadBtn = document.getElementById('download-btn');
    const exportCanvas = document.getElementById('export-canvas');
    
    // Configuration
    const availableColors = ['blue', 'pink', 'yellow'];
    const loadingDuration = 2500;
    const maxFileSize = 5 * 1024 * 1024;
    let currentColor = 'blue';
    let isLoading = false;
    let logoScale = 100;
    let logoRotation = 0;
    
    // Update logo transform
    function updateLogoTransform() {
        logoPreview.style.transform = 'translateX(-50%) scale(' + (logoScale / 100) + ') rotate(' + logoRotation + 'deg)';
    }
    
    // Set initial umbrella image
    umbrellaImage.src = 'images/' + currentColor.charAt(0).toUpperCase() + currentColor.slice(1) + ' umbrella.png';
    
    // Handle color swatch clicks
    colorSwatches.forEach(function(swatch) {
        swatch.addEventListener('click', function() {
            if (isLoading) return;
            
            const color = this.getAttribute('data-color');
            
            if (availableColors.includes(color) && color !== currentColor) {
                // Update active state
                colorSwatches.forEach(function(s) {
                    s.classList.remove('active');
                });
                this.classList.add('active');
                
                // Show loader
                isLoading = true;
                umbrellaImage.style.display = 'none';
                logoPreview.style.display = 'none';
                loader.style.display = 'block';
                
                setTimeout(function() {
                    // Update umbrella image
                    const capitalizedColor = color.charAt(0).toUpperCase() + color.slice(1);
                    umbrellaImage.src = 'images/' + capitalizedColor + ' umbrella.png';
                    
                    // Change theme
                    document.body.className = 'theme-' + color;
                    currentColor = color;
                    
                    // Hide loader, show umbrella
                    isLoading = false;
                    loader.style.display = 'none';
                    umbrellaImage.style.display = 'block';
                    
                    // Show logo if exists
                    if (logoPreview.src && logoPreview.src.indexOf('data:') === 0) {
                        logoPreview.style.display = 'block';
                    }
                }, loadingDuration);
            }
        });
    });
    
    // Handle logo upload
    logoUpload.addEventListener('change', function(event) {
        if (isLoading) return;
        
        const file = event.target.files[0];
        if (!file) return;
        
        // Validate file type
        if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
            alert('Please upload a JPG or PNG file only.');
            return;
        }
        
        // Validate file size
        if (file.size > maxFileSize) {
            alert('File size exceeds 5MB. Please upload a smaller file.');
            return;
        }
        
        // Show loader
        isLoading = true;
        umbrellaImage.style.display = 'none';
        logoPreview.style.display = 'none';
        loader.style.display = 'block';
        
        const reader = new FileReader();
        reader.onload = function(e) {
            setTimeout(function() {
                logoPreview.src = e.target.result;
                
                // Hide loader, show umbrella and logo
                isLoading = false;
                loader.style.display = 'none';
                umbrellaImage.style.display = 'block';
                logoPreview.style.display = 'block';
                logoControls.classList.remove('hidden');
                downloadBtn.classList.remove('hidden');
                updateLogoTransform();
            }, loadingDuration);
        };
        
        reader.onerror = function() {
            isLoading = false;
            loader.style.display = 'none';
            umbrellaImage.style.display = 'block';
            alert('Error reading file. Please try again.');
        };
        
        reader.readAsDataURL(file);
    });
    
    // Scale slider
    scaleSlider.addEventListener('input', function() {
        logoScale = this.value;
        scaleValue.textContent = logoScale + '%';
        updateLogoTransform();
    });
    
    // Rotate slider
    rotateSlider.addEventListener('input', function() {
        logoRotation = this.value;
        rotateValue.textContent = logoRotation + '°';
        updateLogoTransform();
    });
    
    // Download functionality
    downloadBtn.addEventListener('click', function() {
        const canvas = exportCanvas;
        const ctx = canvas.getContext('2d');
        const containerRect = umbrellaImage.getBoundingClientRect();
        
        canvas.width = umbrellaImage.naturalWidth;
        canvas.height = umbrellaImage.naturalHeight;
        
        // Draw umbrella
        ctx.drawImage(umbrellaImage, 0, 0);
        
        // Draw logo if exists
        if (logoPreview.src && logoPreview.src.indexOf('data:') === 0) {
            const logoImg = new Image();
            logoImg.onload = function() {
                ctx.save();
                
                // Match CSS positioning: bottom 10%, center horizontally
                const logoX = canvas.width * 0.5;
                const logoY = canvas.height * 0.85; // Adjusted to match CSS bottom: 10%
                
                // Calculate logo size (max 30% of umbrella width as per CSS)
                const maxLogoWidth = canvas.width * 0.3;
                const logoAspectRatio = logoImg.width / logoImg.height;
                let logoWidth = Math.min(maxLogoWidth, logoImg.width * (logoScale / 100));
                let logoHeight = logoWidth / logoAspectRatio;
                
                // Apply transforms
                ctx.translate(logoX, logoY);
                ctx.rotate(logoRotation * Math.PI / 180);
                ctx.drawImage(logoImg, -logoWidth / 2, -logoHeight / 2, logoWidth, logoHeight);
                
                ctx.restore();
                
                // Download
                const link = document.createElement('a');
                link.download = 'custom-umbrella.png';
                link.href = canvas.toDataURL('image/png');
                link.click();
            };
            logoImg.src = logoPreview.src;
        } else {
            // Download without logo
            const link = document.createElement('a');
            link.download = 'custom-umbrella.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        }
    });
    
    // Set initial theme
    document.body.classList.add('theme-blue');
});
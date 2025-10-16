document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const umbrellaImage = document.getElementById('umbrella-image');
    const logoPreview = document.getElementById('logo-preview');
    const logoUpload = document.getElementById('logo-upload');
    const colorSwatches = document.querySelectorAll('.color-swatch');
    const loader = document.getElementById('loader');
    
    // Configuration
    const availableColors = ['blue', 'pink', 'yellow'];
    const loadingDuration = 2500;
    const maxFileSize = 5 * 1024 * 1024;
    let currentColor = 'blue';
    let isLoading = false;
    
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
    
    // Set initial theme
    document.body.classList.add('theme-blue');
});
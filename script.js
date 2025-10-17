/**
 * Custom Umbrella Configurator Application
 * 
 * A professional web application for customizing umbrellas with:
 * - Color selection with theme switching
 * - Logo upload with validation
 * - Logo transformation (scale, rotate)
 * - 3D umbrella rotation interaction
 * - Undo/redo functionality
 * - High-quality PNG export
 * 
 * @author Sai Kiran Kurra
 * @version 2.0.0
 */

(function() {
    'use strict';
    
    /**
     * Initialize the umbrella configurator when DOM is ready
     */
    document.addEventListener('DOMContentLoaded', function() {
        
        // ========================================
        // CONFIGURATION CONSTANTS
        // ========================================
        
        /** @constant {string[]} Available umbrella color options */
        const AVAILABLE_COLORS = ['blue', 'pink', 'yellow'];
        
        /** @constant {number} Loading animation duration in milliseconds */
        const LOADING_DURATION_MS = 2500;
        
        /** @constant {number} Maximum allowed file size in bytes (5MB) */
        const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
        
        /** @constant {string[]} Allowed file MIME types */
        const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png'];
        
        /** @constant {Object} Logo transformation limits */
        const LOGO_LIMITS = {
            MIN_SCALE: 50,
            MAX_SCALE: 150,
            MIN_ROTATION: -180,
            MAX_ROTATION: 180,
            DEFAULT_SCALE: 100,
            DEFAULT_ROTATION: 0
        };
        
        /** @constant {Object} 3D rotation limits for umbrella */
        const ROTATION_3D_LIMITS = {
            MAX_X: 15,
            MAX_Y: 30,
            SENSITIVITY_X: 0.1,
            SENSITIVITY_Y: 0.2
        };
        
        // ========================================
        // DOM ELEMENT REFERENCES
        // ========================================
        
        /** @type {HTMLImageElement} Main umbrella image element */
        const umbrellaImage = document.getElementById('umbrella-image');
        
        /** @type {HTMLImageElement} Logo preview overlay element */
        const logoPreview = document.getElementById('logo-preview');
        
        /** @type {HTMLInputElement} File input for logo upload */
        const logoUpload = document.getElementById('logo-upload');
        
        /** @type {NodeList} Color selection buttons */
        const colorSwatches = document.querySelectorAll('.color-swatch');
        
        /** @type {HTMLElement} Loading spinner element */
        const loader = document.getElementById('loader');
        
        /** @type {HTMLElement} Logo control panel container */
        const logoControls = document.getElementById('logo-controls');
        
        /** @type {HTMLInputElement} Scale adjustment slider */
        const scaleSlider = document.getElementById('scale-slider');
        
        /** @type {HTMLInputElement} Rotation adjustment slider */
        const rotateSlider = document.getElementById('rotate-slider');
        
        /** @type {HTMLElement} Scale percentage display */
        const scaleValue = document.getElementById('scale-value');
        
        /** @type {HTMLElement} Rotation degree display */
        const rotateValue = document.getElementById('rotate-value');
        
        /** @type {HTMLButtonElement} PNG download button */
        const downloadBtn = document.getElementById('download-btn');
        
        /** @type {HTMLCanvasElement} Canvas for image export */
        const exportCanvas = document.getElementById('export-canvas');
        
        /** @type {HTMLElement} Umbrella container for 3D rotation */
        const umbrellaContainer = document.getElementById('umbrella-container');
        
        /** @type {HTMLButtonElement} Undo action button */
        const undoBtn = document.getElementById('undo-btn');
        
        /** @type {HTMLButtonElement} Redo action button */
        const redoBtn = document.getElementById('redo-btn');
        
        /** @type {HTMLButtonElement} Reset to defaults button */
        const resetBtn = document.getElementById('reset-btn');
        
        // ========================================
        // APPLICATION STATE
        // ========================================
        
        /** @type {string} Currently selected umbrella color */
        let currentUmbrellaColor = 'blue';
        
        /** @type {boolean} Loading state flag */
        let isApplicationLoading = false;
        
        /** @type {number} Current logo scale percentage (50-150) */
        let currentLogoScale = LOGO_LIMITS.DEFAULT_SCALE;
        
        /** @type {number} Current logo rotation in degrees (-180 to 180) */
        let currentLogoRotation = LOGO_LIMITS.DEFAULT_ROTATION;
        
        /** @type {number} Current umbrella X-axis rotation for 3D effect */
        let umbrellaRotationX = 0;
        
        /** @type {number} Current umbrella Y-axis rotation for 3D effect */
        let umbrellaRotationY = 0;
        
        /** @type {boolean} Flag indicating if umbrella is being dragged */
        let isUmbrellaDragging = false;
        
        /** @type {Array<Object>} History stack for undo/redo functionality */
        let actionHistory = [];
        
        /** @type {number} Current position in history stack */
        let historyCurrentIndex = -1;
        
        // ========================================
        // UTILITY FUNCTIONS
        // ========================================
        
        /**
         * Capitalizes the first letter of a string
         * @param {string} str - String to capitalize
         * @returns {string} Capitalized string
         */
        function capitalizeFirstLetter(str) {
            return str.charAt(0).toUpperCase() + str.slice(1);
        }
        
        /**
         * Validates uploaded file type and size
         * @param {File} file - The file to validate
         * @throws {Error} If file is invalid
         */
        function validateUploadedFile(file) {
            if (!ALLOWED_FILE_TYPES.includes(file.type)) {
                throw new Error('Please upload a JPG or PNG file only.');
            }
            
            if (file.size > MAX_FILE_SIZE_BYTES) {
                throw new Error('File size exceeds 5MB. Please upload a smaller file.');
            }
        }
        
        /**
         * Checks if a logo has been uploaded
         * @returns {boolean} True if logo is uploaded
         */
        function isLogoUploaded() {
            return logoPreview.src && logoPreview.src.indexOf('data:') === 0;
        }
        
        // ========================================
        // STATE MANAGEMENT
        // ========================================
        
        /**
         * Saves current logo state to history for undo/redo functionality
         */
        function saveCurrentStateToHistory() {
            const currentState = { 
                scale: currentLogoScale, 
                rotation: currentLogoRotation 
            };
            
            actionHistory = actionHistory.slice(0, historyCurrentIndex + 1);
            actionHistory.push(currentState);
            historyCurrentIndex++;
            
            updateUndoRedoButtonStates();
        }
        
        /**
         * Updates the enabled/disabled state of undo and redo buttons
         */
        function updateUndoRedoButtonStates() {
            undoBtn.disabled = historyCurrentIndex <= 0;
            redoBtn.disabled = historyCurrentIndex >= actionHistory.length - 1;
        }
        
        // ========================================
        // TRANSFORM FUNCTIONS
        // ========================================
        
        /**
         * Updates the CSS transform for logo preview element
         */
        function updateLogoTransform() {
            const scaleRatio = currentLogoScale / 100;
            const transformValue = 'translateX(-50%) scale(' + scaleRatio + ') rotate(' + currentLogoRotation + 'deg)';
            logoPreview.style.transform = transformValue;
        }
        
        /**
         * Updates the 3D rotation transform for umbrella container
         */
        function updateUmbrellaRotationTransform() {
            const transformValue = 'rotateX(' + umbrellaRotationX + 'deg) rotateY(' + umbrellaRotationY + 'deg)';
            umbrellaContainer.style.transform = transformValue;
        }
        
        /**
         * Updates slider values and display text to match current state
         */
        function updateSliderDisplayValues(scale, rotation) {
            scaleSlider.value = scale;
            rotateSlider.value = rotation;
            scaleValue.textContent = scale + '%';
            rotateValue.textContent = rotation + '°';
        }
        
        // ========================================
        // UI STATE FUNCTIONS
        // ========================================
        
        /**
         * Shows loading state by hiding content and displaying loader
         */
        function showLoadingState() {
            isApplicationLoading = true;
            umbrellaImage.style.display = 'none';
            logoPreview.style.display = 'none';
            loader.style.display = 'block';
        }
        
        /**
         * Hides loading state and shows umbrella content
         */
        function hideLoadingState() {
            isApplicationLoading = false;
            loader.style.display = 'none';
            umbrellaImage.style.display = 'block';
        }
        
        /**
         * Updates umbrella image and application theme
         */
        function updateUmbrellaColorAndTheme(colorName) {
            const capitalizedColorName = capitalizeFirstLetter(colorName);
            umbrellaImage.src = 'images/' + capitalizedColorName + ' umbrella.png';
            document.body.className = 'theme-' + colorName;
            currentUmbrellaColor = colorName;
        }
        
        // ========================================
        // EVENT HANDLERS
        // ========================================
        
        /**
         * Handles color swatch selection and theme switching
         */
        function handleColorSwatchSelection(event) {
            if (isApplicationLoading) return;
            
            const selectedColor = event.target.getAttribute('data-color');
            
            if (!AVAILABLE_COLORS.includes(selectedColor) || selectedColor === currentUmbrellaColor) {
                return;
            }
            
            colorSwatches.forEach(function(swatchElement) {
                swatchElement.classList.remove('active');
            });
            event.target.classList.add('active');
            
            showLoadingState();
            
            setTimeout(function() {
                updateUmbrellaColorAndTheme(selectedColor);
                hideLoadingState();
                
                if (isLogoUploaded()) {
                    logoPreview.style.display = 'block';
                }
            }, LOADING_DURATION_MS);
        }
        
        /**
         * Handles logo file upload and validation
         */
        function handleLogoUpload(event) {
            if (isApplicationLoading) return;
            
            const uploadedFile = event.target.files[0];
            if (!uploadedFile) return;
            
            try {
                validateUploadedFile(uploadedFile);
                showLoadingState();
                
                const fileReader = new FileReader();
                fileReader.onload = function(e) {
                    setTimeout(function() {
                        logoPreview.src = e.target.result;
                        
                        hideLoadingState();
                        logoPreview.style.display = 'block';
                        logoControls.classList.remove('hidden');
                        downloadBtn.classList.remove('hidden');
                        updateLogoTransform();
                        
                        actionHistory = [{ scale: LOGO_LIMITS.DEFAULT_SCALE, rotation: LOGO_LIMITS.DEFAULT_ROTATION }];
                        historyCurrentIndex = 0;
                        updateUndoRedoButtonStates();
                    }, LOADING_DURATION_MS);
                };
                
                fileReader.onerror = function() {
                    hideLoadingState();
                    alert('Error reading file. Please try again.');
                };
                
                fileReader.readAsDataURL(uploadedFile);
            } catch (error) {
                alert(error.message);
            }
        }
        
        // ========================================
        // INITIALIZATION
        // ========================================
        
        /**
         * Initialize the application with default state
         */
        function initializeApplication() {
            const capitalizedColor = capitalizeFirstLetter(currentUmbrellaColor);
            umbrellaImage.src = 'images/' + capitalizedColor + ' umbrella.png';
            document.body.classList.add('theme-' + currentUmbrellaColor);
        }
        
        // ========================================
        // EVENT LISTENERS
        // ========================================
        
        // Color swatch selection
        colorSwatches.forEach(function(swatch) {
            swatch.addEventListener('click', handleColorSwatchSelection);
        });
        
        // Logo upload
        logoUpload.addEventListener('change', handleLogoUpload);
        
        // Scale slider
        scaleSlider.addEventListener('input', function() {
            currentLogoScale = parseInt(this.value);
            scaleValue.textContent = currentLogoScale + '%';
            updateLogoTransform();
        });
        
        scaleSlider.addEventListener('change', saveCurrentStateToHistory);
        
        // Rotate slider
        rotateSlider.addEventListener('input', function() {
            currentLogoRotation = parseInt(this.value);
            rotateValue.textContent = currentLogoRotation + '°';
            updateLogoTransform();
        });
        
        rotateSlider.addEventListener('change', saveCurrentStateToHistory);
        
        // Umbrella 3D rotation
        let dragStartX, dragStartY;
        
        umbrellaContainer.addEventListener('mousedown', function(e) {
            isUmbrellaDragging = true;
            dragStartX = e.clientX;
            dragStartY = e.clientY;
            umbrellaContainer.classList.add('rotating');
        });
        
        document.addEventListener('mousemove', function(e) {
            if (!isUmbrellaDragging) return;
            
            const deltaX = e.clientX - dragStartX;
            const deltaY = e.clientY - dragStartY;
            
            umbrellaRotationY = Math.max(-ROTATION_3D_LIMITS.MAX_Y, Math.min(ROTATION_3D_LIMITS.MAX_Y, deltaX * ROTATION_3D_LIMITS.SENSITIVITY_Y));
            umbrellaRotationX = Math.max(-ROTATION_3D_LIMITS.MAX_X, Math.min(ROTATION_3D_LIMITS.MAX_X, -deltaY * ROTATION_3D_LIMITS.SENSITIVITY_X));
            
            updateUmbrellaRotationTransform();
        });
        
        document.addEventListener('mouseup', function() {
            if (isUmbrellaDragging) {
                isUmbrellaDragging = false;
                umbrellaContainer.classList.remove('rotating');
                
                setTimeout(function() {
                    umbrellaRotationX = 0;
                    umbrellaRotationY = 0;
                    updateUmbrellaRotationTransform();
                }, 100);
            }
        });
        
        // Undo functionality
        undoBtn.addEventListener('click', function() {
            if (historyCurrentIndex > 0) {
                historyCurrentIndex--;
                const previousState = actionHistory[historyCurrentIndex];
                currentLogoScale = previousState.scale;
                currentLogoRotation = previousState.rotation;
                updateSliderDisplayValues(currentLogoScale, currentLogoRotation);
                updateLogoTransform();
                updateUndoRedoButtonStates();
            }
        });
        
        // Redo functionality
        redoBtn.addEventListener('click', function() {
            if (historyCurrentIndex < actionHistory.length - 1) {
                historyCurrentIndex++;
                const nextState = actionHistory[historyCurrentIndex];
                currentLogoScale = nextState.scale;
                currentLogoRotation = nextState.rotation;
                updateSliderDisplayValues(currentLogoScale, currentLogoRotation);
                updateLogoTransform();
                updateUndoRedoButtonStates();
            }
        });
        
        // Reset functionality
        resetBtn.addEventListener('click', function() {
            currentLogoScale = LOGO_LIMITS.DEFAULT_SCALE;
            currentLogoRotation = LOGO_LIMITS.DEFAULT_ROTATION;
            updateSliderDisplayValues(currentLogoScale, currentLogoRotation);
            updateLogoTransform();
            saveCurrentStateToHistory();
        });
        
        // Download functionality
        downloadBtn.addEventListener('click', function() {
            const canvas = exportCanvas;
            const ctx = canvas.getContext('2d');
            
            canvas.width = umbrellaImage.naturalWidth;
            canvas.height = umbrellaImage.naturalHeight;
            
            ctx.drawImage(umbrellaImage, 0, 0);
            
            if (isLogoUploaded()) {
                const logoImg = new Image();
                logoImg.onload = function() {
                    ctx.save();
                    
                    const logoX = canvas.width * 0.5;
                    const logoY = canvas.height * 0.85;
                    
                    const maxLogoWidth = canvas.width * 0.3;
                    const logoAspectRatio = logoImg.width / logoImg.height;
                    let logoWidth = Math.min(maxLogoWidth, logoImg.width * (currentLogoScale / 100));
                    let logoHeight = logoWidth / logoAspectRatio;
                    
                    ctx.translate(logoX, logoY);
                    ctx.rotate(currentLogoRotation * Math.PI / 180);
                    ctx.drawImage(logoImg, -logoWidth / 2, -logoHeight / 2, logoWidth, logoHeight);
                    
                    ctx.restore();
                    
                    const downloadLink = document.createElement('a');
                    downloadLink.download = 'custom-umbrella.png';
                    downloadLink.href = canvas.toDataURL('image/png');
                    downloadLink.click();
                };
                logoImg.src = logoPreview.src;
            } else {
                const downloadLink = document.createElement('a');
                downloadLink.download = 'custom-umbrella.png';
                downloadLink.href = canvas.toDataURL('image/png');
                downloadLink.click();
            }
        });
        
        // Initialize application
        initializeApplication();
    });
})();
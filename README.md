# Custom Umbrella Configurator

A professional web application that allows users to customize umbrellas by selecting colors, uploading logos, and adjusting logo properties with real-time preview and high-quality PNG export functionality.

## ✨ Features

### 🎨 Color Customization
- **3 Umbrella Colors**: Blue, Pink, and Yellow options
- **Dynamic Themes**: Background and UI elements change to match selected color
- **Smooth Transitions**: 2.5-second loading animation with spinner

### 🖼️ Logo Management
- **File Upload**: Support for .jpg and .png files (max 5MB)
- **Real-time Preview**: Instant logo positioning on umbrella
- **File Validation**: Automatic type and size checking with user feedback

### 🔧 Logo Customization Tools
- **Scale Control**: Resize logos from 50% to 150% with live percentage display
- **Rotation Control**: Rotate logos from -180° to +180° with live degree display
- **Combined Transforms**: Scale and rotation work together seamlessly
- **Boundary Respect**: Logo stays within umbrella boundaries

### 💾 Export Functionality
- **High-Quality PNG Export**: Download customized umbrella as PNG image
- **Exact Preview Match**: Downloaded image matches on-screen preview perfectly
- **Canvas-Based Rendering**: Professional image generation with proper positioning
- **One-Click Download**: Simple button triggers instant file download

### 🎯 User Experience
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Accessibility**: Screen reader support with proper ARIA labels
- **Intuitive Controls**: Clear labels and real-time value indicators
- **Loading States**: Visual feedback during all operations

## Technologies Used

- **HTML5** - Semantic markup structure
- **CSS3** - Responsive styling with custom properties
- **Vanilla JavaScript** - Interactive functionality (No frameworks)

## File Structure

```
├── index.html          # Main HTML file
├── styles.css          # CSS styling and themes
├── script.js           # JavaScript functionality
├── images/             # Umbrella images
│   ├── Blue umbrella.png
│   ├── Pink umbrella.png
│   └── Yellow umbrella.png
└── icons/              # UI icons
    ├── loader_icon.svg
    └── upload_icon.svg
```

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/KurraSaiKiran/Revize-Umbrella.git
```

2. Navigate to the project directory:
```bash
cd Revize-Umbrella
```

3. Open `index.html` in your web browser or serve it using a local server.

## 🚀 Usage Guide

### Step 1: Choose Umbrella Color
- Click on any color swatch (Pink, Blue, or Yellow)
- Watch the 2.5-second loading animation
- See the umbrella and background theme change

### Step 2: Upload Your Logo
- Click the "UPLOAD LOGO" button
- Select a .jpg or .png file (max 5MB)
- Wait for the loading animation to complete
- Your logo appears on the umbrella

### Step 3: Customize Logo (Optional)
- **Scale**: Use the scale slider to resize (50%-150%)
- **Rotate**: Use the rotate slider to adjust angle (-180° to +180°)
- See changes applied in real-time

### Step 4: Download Your Design
- Click "DOWNLOAD PNG" button
- High-quality PNG file downloads automatically
- Image matches your preview exactly

### 📱 Mobile Support
All features work seamlessly on mobile devices with touch-friendly controls.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 💻 Technical Implementation

### Core Technologies
- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Custom properties, responsive design, smooth animations
- **Vanilla JavaScript**: No frameworks or external dependencies
- **Canvas API**: High-quality image export functionality

### Code Quality Features
- **Clean Architecture**: Modular, maintainable code structure
- **Error Handling**: Comprehensive validation and user feedback
- **Performance**: Optimized DOM operations and event handling
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support
- **Cross-Browser**: Compatible with all modern browsers
- **Mobile-First**: Responsive design with touch-friendly controls

### Key Algorithms
- **Transform Combination**: Seamless scale + rotation using CSS transforms
- **Canvas Rendering**: Precise logo positioning matching CSS preview
- **File Processing**: Efficient image loading and validation
- **State Management**: Clean application state handling

## License

This project is open source and available under the [MIT License](LICENSE).

## Author

**Sai Kiran Kurra**
- GitHub: [@KurraSaiKiran](https://github.com/KurraSaiKiran)

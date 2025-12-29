# SVG Editor

A free, web-based vector graphics editor designed for creating and editing SVG images. Think of it as MS Paint but for vector graphics - offering the simplicity and ease of use you'd expect, combined with powerful vector editing capabilities similar to Inkscape, but completely free and without licensing restrictions.

## Overview

This SVG editor provides an intuitive interface for designing vector graphics with features like pen stroke drawing, shape manipulation, and comprehensive editing tools. Built with HTML5 Canvas technology, it runs directly in your web browser without requiring any software installation.

## Key Features

- **Vector Graphics Creation**: Design scalable vector graphics that maintain quality at any size
- **Intuitive Drawing Tools**: Easy-to-use pen stroke and shape tools for natural drawing experience
- **Multi-touch Support**: Full touch screen compatibility for tablets and touch devices
- **Layer Management**: Organize your artwork with multiple layers and pages
- **Real-time Editing**: Live property editing with instant visual feedback
- **Multiple Export Formats**: Save your work in SVG, XML, YAML, and JSON formats
- **Free & Open Source**: No licensing fees or restrictions - completely free to use

## Why Choose This SVG Editor?

- **Accessibility**: No software installation required - works in any modern web browser
- **Cost-effective**: Completely free alternative to expensive vector graphics software
- **User-friendly**: Designed with simplicity in mind while maintaining professional capabilities
- **Cross-platform**: Works on Windows, Mac, Linux, and mobile devices
- **Lightweight**: Fast loading and responsive performance

## Technical Concepts

- **Shape**: The fundamental geometry objects displayed on the canvas, including rectangles, lines, ellipses, and other geometric forms. This also encompasses objects that can be contained within geometric frames, such as text and images.
- **Layout**: A collection of shapes grouped together. All shapes within a layout share common behaviors such as moving, resizing, layer management, and color modifications.
- **Widget**: The collective term for both shapes and layouts - essentially any manipulable object in the editor.
- **Menu**: The top navigation area of the web interface containing all available functions and operations for user interaction.
- **Toolbar**: Located beneath the menu, this area provides quick access to frequently used functions through intuitive icon-based controls.
- **Overview Sidebar**: The left panel displaying the hierarchical organization of pages and layers, providing easy navigation through complex projects.
- **Property Sidebar**: The right panel showing properties of selected widgets (shapes or layouts), allowing users to view and modify attributes in real-time.
- **Workplace**: The central canvas area where users design and create their vector graphics artwork.

## Development Progress

### ✅ Core Canvas System (HTML5 Canvas)
- ✅ Canvas initialization and setup
- ✅ Widget system (shapes and layouts)
  - ✅ **Positional Properties**:
    - ✅ Percentage-based positioning (relative units)
    - ⏳ Scaling functionality
    - ✅ Rotation controls
    - ✅ Drag and move operations
    - ✅ Multi-selection capabilities
    - ⏳ Resizing handles
  - ✅ **Visual Properties**:
    - ✅ Color management
    - ✅ Border styling
    - ⏳ Gradient effects
- ✅ **Event Handling System**
  - ✅ **Mouse Events**:
    - ✅ Drag and drop functionality
    - ✅ Mouse down, move, and up events
    - ⏳ Click and double-click events
  - ✅ **Touch Events**:
    - ✅ Touch start, move, and end events
  - ⏳ Keyboard event handling

### 🚧 User Interface Features
- ⏳ **Menu and Toolbar Operations**:
  - ⏳ Add and delete shapes
  - ⏳ Undo and redo functionality
  - ⏳ Layer management (bring forward/backward)
  - ⏳ Widget grouping (layout creation)
- ⏳ **Overview Sidebar**:
  - ⏳ Multi-page organization
  - ⏳ Multi-layer hierarchy
- ⏳ **Property Sidebar**:
  - ⏳ Dynamic property display
  - ⏳ Real-time property editing

### 📁 File Format Support
- ⏳ **SVG Format**: Loading (optional) and saving
- ⏳ **XML Format**: Loading and saving
- ⏳ **YAML Format**: Loading and saving
- ⏳ **JSON Format**: Loading and saving

## Getting Started

1. Clone this repository
2. Open the main HTML file in your web browser
3. Start creating vector graphics!

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

## License

This project is free and open source. No licensing restrictions apply.

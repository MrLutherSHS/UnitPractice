
# GCSE Units - Computer Science Practice

A comprehensive practice application for GCSE Computer Science students to master unit conversions, file size calculations, and storage capacity problems. Built with modern React, TypeScript, and Tailwind CSS.

## 🎯 Features

- **Unit Conversion Practice** - Convert between bytes, kilobytes, megabytes, gigabytes, and terabytes
- **File Size Calculator** - Calculate image, sound, and text file sizes with detailed explanations  
- **Capacity Calculator** - Determine storage requirements and file counts
- **Progress Tracking** - Built-in scoring system with detailed analytics
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Educational Explanations** - Step-by-step breakdowns for every calculation

## 🚀 Live Demo

Visit the live application: [GCSE Units Practice](https://gcseunits.netlify.app/)

## 🛠️ Technology Stack

- **React 19** & **TypeScript** for type-safe component development
- **Vite** for fast development and optimized builds
- **TanStack React Router** for client-side routing
- **Tailwind CSS** for responsive, utility-first styling
- **Biome** for consistent code formatting and linting
- **Vitest + Testing Library** for comprehensive testing

## 🎮 How to Use

### Unit Converter
Practice converting between different data units:
- Enter a value and select source/target units
- Get instant feedback with detailed conversion steps
- Advanced mode includes decimal and complex conversions

### File Size Calculator  
Calculate storage requirements for digital files:
- **Image Files:** Based on dimensions and color depth
- **Sound Files:** Based on sample rate, bit depth, and duration
- **Text Files:** Based on character count and encoding

### Capacity Calculator
Understand storage capacity relationships:
- Calculate how many files fit on a storage device
- Determine total storage needed for multiple files
- Learn the relationship between file sizes and storage capacity

## 🏁 Getting Started

### Prerequisites
- Node.js 18+ and pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/domluther/GCSEUnits.git
cd GCSEUnits

# Install dependencies
pnpm install

# Start development server
pnpm run dev
```

### Available Scripts

### Available Scripts

```bash
# Development server
pnpm run dev

# Production build
pnpm run build

# Preview production build
pnpm run preview

# Run tests
pnpm run test
pnpm run test:run  # Run once
pnpm run test:ui   # Test UI

# Code quality
pnpm run lint      # Check linting
pnpm run format    # Format code
pnpm run type-check # TypeScript checking
```

## 📚 Educational Value

This application is designed specifically for GCSE Computer Science students and covers:

- **Data Representation:** Understanding how different file types are stored
- **Units and Calculations:** Converting between binary units (bytes, KB, MB, GB, TB) 
- **Problem Solving:** Working through multi-step calculations with guidance
- **Real-World Applications:** Understanding storage requirements for actual file types

## 🎓 GCSE Curriculum Alignment

- **AQA Computer Science:** Unit 3.2 (Data Representation)
- **OCR Computer Science:** J277 Component 1 (Data representation)
- **Edexcel Computer Science:** Topic 4 (Data representation)

## 🧪 Testing

The application includes comprehensive test coverage for:
- Question generation algorithms
- Answer validation logic  
- UI component interactions
- Score tracking and persistence

Run tests with:
```bash
pnpm run test        # Watch mode
pnpm run test:run    # Single run
pnpm run test:ui     # Interactive UI
```

## 🏗️ Architecture

### Component Structure
- **Route Components:** Individual calculator pages with shared layout
- **Calculator Components:** Core logic for each practice mode
- **Shared Components:** Reusable UI elements and layouts  
- **Hooks & Utils:** Quiz logic, scoring, and mathematical utilities

### Key Files
- `src/routes/` - Application pages (unit converter, file size, capacity)
- `src/components/` - Reusable React components  
- `src/lib/` - Utility functions, configuration, and business logic
- `src/contexts/` - React contexts (theme provider)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/improvement`)
3. Commit changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/improvement`) 
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built for GCSE Computer Science students and educators
- Inspired by the need for interactive, educational calculation practice
- Uses modern web technologies for optimal learning experience

---

*For technical documentation and development guides, see the other markdown files in this repository.*



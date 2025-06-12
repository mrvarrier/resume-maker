# ATS-Friendly Resume Builder

A modern, professional resume builder with real-time preview and ATS-friendly PDF export. Built with Next.js 14, TypeScript, and Tailwind CSS.

> **Note**: This resume builder was originally created for personal use and is optimized for my specific resume formatting needs. While it follows ATS best practices, you may want to adapt the styling, sections, or layout to match your requirements.

![Resume Builder](https://img.shields.io/badge/Next.js-14+-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3+-06B6D4?style=for-the-badge&logo=tailwindcss)
![React PDF](https://img.shields.io/badge/React%20PDF-3+-red?style=for-the-badge)

## ✨ Features

### 🎯 **ATS-Optimized Design**
- **Semantic HTML structure** for proper ATS parsing
- **Clean text extraction** without complex styling interference
- **Standard formatting** that passes through ATS systems
- **Linear content flow** for accurate field recognition

### 📝 **Professional Resume Sections**
- **Personal Information** - Name, email, LinkedIn, portfolio
- **Work Experience** - Job titles, companies, dates, achievements
- **Education** - Degrees, institutions, dates, GPA
- **Leadership & Activities** - Roles, organizations, accomplishments
- **Honors & Awards** - Titles, organizations, dates, descriptions
- **Skills** - Technical and soft skills categorization

### 💾 **Smart Auto-Save System**
- **Automatic saving** every 2 seconds after changes
- **Real-time status indicators** with visual feedback
- **Manual save** via button or Ctrl+S/Cmd+S keyboard shortcut
- **Data loss prevention** with browser warnings
- **Error handling** and recovery mechanisms

### 🖥️ **Split-Screen Editor**
- **Live preview** with real-time updates
- **A4 page dimensions** (794×1123px) with precise margins
- **Scalable preview** (40%-100% zoom levels)
- **Professional typography** with Times New Roman
- **Responsive design** for different screen sizes

### 📄 **Perfect PDF Export**
- **Pixel-perfect consistency** between preview and PDF
- **Professional formatting** with proper spacing
- **High-quality rendering** using @react-pdf/renderer
- **Optimized file size** and fast generation
- **Download with smart filename** (FirstName_LastName_Resume.pdf)

### 🎨 **Typography & Design**
- **24px name** in bold uppercase
- **12px section headers** with underlines
- **10px body text** for optimal readability
- **Left-aligned header** with single-line contact info
- **Consistent spacing** (20px sections, 10px subsections)
- **Professional margins** (35px sides, 28px top, 40px bottom)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ats-resume-builder.git
   cd ats-resume-builder
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

### Build for Production

```bash
npm run build
npm start
```

## 📖 Usage Guide

### Creating Your First Resume

1. **Create New Resume**
   - Click "Create New Resume" on the dashboard
   - Enter a name for your resume

2. **Fill in Personal Information**
   - Add your full name, email, LinkedIn, and portfolio
   - Information appears in left-aligned header format

3. **Add Work Experience**
   - Click "Add" to create experience entries
   - Include job title, company, dates, and bullet points
   - Use action verbs and quantify achievements

4. **Complete Education Section**
   - Add degree, institution, dates, and GPA (optional)
   - Multiple education entries supported

5. **Add Leadership & Activities**
   - Include leadership roles, volunteer work, activities
   - Add bullet points for key accomplishments

6. **List Honors & Awards**
   - Add academic honors, professional awards, certifications
   - Include organization and date information

7. **Categorize Skills**
   - Separate technical skills (programming, tools, technologies)
   - List soft skills (communication, leadership, problem-solving)

### Auto-Save Features

- **Changes save automatically** every 2 seconds
- **Manual save** with Ctrl+S (Windows) or Cmd+S (Mac)
- **Visual indicators** show save status:
  - 🟢 **Green check**: All changes saved
  - 🟠 **Orange clock**: Unsaved changes
  - 🔵 **Blue clock**: Currently saving

### PDF Export

1. Click "Export PDF" button in editor
2. Preview final layout in new tab
3. Click "Download PDF" for final file
4. File downloads as "FirstName_LastName_Resume.pdf"

## 🏗️ Technical Architecture

### Tech Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS + custom CSS
- **PDF Generation**: @react-pdf/renderer
- **Icons**: Lucide React
- **Storage**: Browser localStorage
- **Deployment**: Vercel-ready

### Project Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Dashboard homepage
│   ├── editor/[id]/       # Resume editor page
│   └── preview/[id]/      # PDF preview page
├── components/
│   ├── editor/            # Editor form components
│   ├── pdf/               # PDF export components
│   ├── resume/            # Resume display components
│   └── ui/                # Reusable UI components
├── lib/
│   ├── constants.ts       # Default data and constants
│   └── resume-utils.ts    # Data management utilities
└── types/
    └── resume.ts          # TypeScript type definitions
```

### Key Components

- **`ResumeEditor`** - Split-screen editor with form inputs and preview
- **`ResumeDocument`** - Unified component for web preview display
- **`ResumePDF`** - PDF-specific component with @react-pdf/renderer
- **Auto-save system** - Smart debouncing and change detection
- **Data persistence** - localStorage with error handling

## 🎯 ATS Optimization Details

### Why This Resume Builder is ATS-Friendly

1. **Semantic HTML Structure**
   - Proper heading hierarchy (H1 → H2 → H3)
   - Standard list elements for bullet points
   - Clear section organization

2. **Clean Text Extraction**
   - No complex CSS positioning that breaks parsing
   - Linear content flow for accurate reading order
   - Standard fonts and formatting

3. **Field Recognition**
   - Contact information clearly labeled
   - Section headers properly structured
   - Job titles, companies, and dates in separate elements

4. **Content Formatting**
   - Skills properly categorized and separated
   - Bullet points in standard HTML lists
   - Dates and text in parseable formats

### ATS Testing Checklist
- ✅ Name extracted correctly
- ✅ Email, LinkedIn, portfolio parsed as separate fields
- ✅ Job titles and companies identified
- ✅ Education degree and institution recognized
- ✅ Skills categorized properly
- ✅ Bullet points readable as text
- ✅ Section headers recognized

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler check
```

### Environment Setup

No environment variables required for basic functionality. All data is stored locally in the browser.

### Adding New Features

1. **New Resume Sections**
   - Update `Resume` type in `src/types/resume.ts`
   - Add form fields in `ResumeEditor`
   - Update display components (`ResumeDocument` and `ResumePDF`)

2. **Custom Styling**
   - Modify `src/app/globals.css` for web styles
   - Update PDF styles in `ResumePDF.tsx` component

3. **Export Formats**
   - Extend PDF component for different layouts
   - Add new export options in preview page

## 📱 Browser Support

- **Chrome** 90+
- **Firefox** 88+
- **Safari** 14+
- **Edge** 90+

## 🤝 Contributing

This project was built primarily for personal use, but contributions are welcome if you'd like to extend or improve it!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Use TypeScript for all new code
- Follow existing code style and conventions
- Add comments for complex logic
- Test changes in both preview and PDF export
- Ensure ATS compatibility for resume-related changes

### Customization Notes

Since this was built for personal use, you may want to customize:
- **Typography settings** in `src/app/globals.css`
- **Resume sections** in `src/types/resume.ts` and components
- **Default data structure** in `src/lib/constants.ts`
- **PDF layout** in `src/components/pdf/ResumePDF.tsx`

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js team** for the amazing React framework
- **@react-pdf/renderer** for PDF generation capabilities
- **Tailwind CSS** for utility-first styling
- **Lucide** for beautiful icons
- **Claude** for development assistance

## 🐛 Issues & Support

If you encounter any issues or have questions:

1. Check existing [GitHub Issues](https://github.com/yourusername/ats-resume-builder/issues)
2. Create a new issue with:
   - Clear description of the problem
   - Steps to reproduce
   - Expected vs actual behavior
   - Browser and OS information

## 🚀 Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2Fats-resume-builder)

1. Connect your GitHub repository to Vercel
2. Configure build settings (auto-detected)
3. Deploy and share your resume builder

### Deploy to Netlify

1. Connect repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `out`
4. Deploy
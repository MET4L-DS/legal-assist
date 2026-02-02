# Legal Assist - AI-Powered Legal Chat Interface

A modern, victim-centric legal assistance platform that provides AI-powered legal guidance through an intuitive chat interface. Built specifically for Indian Law, this application helps victims understand their rights, navigate legal procedures, and access immediate support.

## 🎥 Demo

https://github.com/user-attachments/assets/your-video-id-here

_Alternatively, view the demo video: [Demo.mp4](./Demo.mp4)_

> **Note**: See the application in action - conversational legal assistance with real-time citations and victim support features.

## ✨ Features

### 🎯 Victim-Centric Design

- **Emergency Protocol Alerts**: Immediate safety warnings with direct emergency contact access
- **Interactive Action Plans**: Step-by-step checklists for urgent legal procedures (Zero FIR, medical attention, etc.)
- **Empathetic UX**: Professional yet supportive design tailored for distressed users

### 💬 Advanced Chat Interface

- **Conversational AI**: Natural language legal queries with context-aware responses
- **Rich Message Streams**: Markdown-formatted answers with proper legal citations
- **Citation System**: Interactive source chips with detailed legal references in a side panel
- **Clean UI**: Modern, minimal design with subtle safety indicators

### 📚 Legal Intelligence

- **Comprehensive Coverage**: Indian Penal Code (IPC), Bharatiya Nyaya Sanhita (BNS), and procedural laws
- **Accurate Citations**: Every answer backed by specific legal sources and authorities
- **Procedural Guidance**: Step-by-step instructions for legal processes

## 🛠️ Tech Stack

### Frontend Framework

- **Next.js 16.1.4** - React framework with App Router
- **React 19.2.3** - Latest React with Server Components
- **TypeScript 5** - Type-safe development

### UI & Styling

- **Tailwind CSS 4** - Utility-first CSS framework
- **ShadCN UI** - High-quality, accessible component library
- **Radix UI** - Unstyled, accessible component primitives
- **Lucide React** - Beautiful icon library
- **React Markdown** - Markdown rendering for legal content
- **Framer Motion** - Smooth animations and transitions

### Design System

- **Fonts**: Inter (body) & Playfair Display (headings)
- **Color Palette**: Navy blue and slate gray for professional legal aesthetic
- **Responsive**: Mobile-first design with adaptive layouts

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**

    ```bash
    git clone <repository-url>
    cd legal-assist
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Set up environment variables**

    Create a `.env.local` file in the root directory:

    ```env
    NEXT_PUBLIC_API_URL=https://your-backend-api-url.com
    ```

4. **Run the development server**

    ```bash
    npm run dev
    ```

5. **Open your browser**

    Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
legal-assist/
├── app/                      # Next.js App Router
│   ├── icon.tsx             # Custom favicon (Law Scale)
│   ├── layout.tsx           # Root layout with fonts
│   ├── page.tsx             # Main chat interface
│   └── globals.css          # Global styles
├── components/
│   ├── chat/                # Chat-specific components
│   │   ├── app-sidebar.tsx  # Navigation sidebar
│   │   ├── chat-layout.tsx  # Main chat container
│   │   ├── chat-response.tsx # AI message component
│   │   ├── citation-sidebar.tsx # Legal sources panel
│   │   └── message-bubble.tsx   # Message wrapper
│   └── ui/                  # ShadCN UI components
├── lib/
│   ├── api.ts               # API client for backend
│   ├── types.ts             # TypeScript interfaces
│   └── utils.ts             # Utility functions
└── public/                  # Static assets
```

## 🌐 Deployment

### Vercel (Recommended)

1. **Push to GitHub**

    ```bash
    git push origin main
    ```

2. **Import to Vercel**
    - Connect your GitHub repository to Vercel
    - Vercel will auto-detect Next.js configuration

3. **Configure Environment Variables**

    In Vercel project settings, add:
    - `NEXT_PUBLIC_API_URL`: Your backend API URL

4. **Deploy**

    Vercel will automatically build and deploy your application

### Other Platforms

The application can be deployed to any platform that supports Next.js:

- Netlify
- AWS Amplify
- Railway
- Render

## 🔧 Configuration

### API Integration

The frontend communicates with a backend API for legal query processing. Configure the API endpoint in `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://api.example.com
```

See [API_DOCS.md](./API_DOCS.md) for backend API documentation.

### Customization

- **Colors**: Modify `app/globals.css` for theme colors
- **Fonts**: Update `app/layout.tsx` to change typography
- **Components**: Extend or customize components in `components/`

## 📝 Key Components

### ChatResponse

Renders AI responses with safety alerts, action plans, legal analysis, and citations.

### CitationSidebar

Non-modal side panel displaying detailed legal sources in an accordion format.

### AppSidebar

Navigation sidebar with branding and chat history (coming soon).

## 🎨 Design Philosophy

- **Minimal & Clean**: White/black color scheme with subtle accents
- **Accessible**: WCAG-compliant components from Radix UI
- **Professional**: Legal-appropriate typography and spacing
- **Empathetic**: Victim-focused UX with clear safety indicators

## 🔮 Roadmap

- [ ] Chat history persistence
- [ ] Multi-session management
- [ ] User authentication
- [ ] Bookmark important conversations
- [ ] Export legal guidance as PDF
- [ ] Multi-language support

## 📄 License

This project is private and proprietary.

## 🤝 Contributing

This is a private project. For questions or issues, please contact the development team.

---

**Built with ❤️ for victims seeking justice**

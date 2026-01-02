# E-Governance Nepal - Centralized Health Records System

A modern web application for managing centralized health records for citizens of Nepal. Built with React, Vite, and Tailwind CSS, this system provides secure access to medical records, lab reports, vaccinations, and prescriptions.

## 🌟 Features

- **Secure Authentication**: Login using National ID (NID) number
- **Health Records Dashboard**: View and search all medical records in one place
- **Record Categories**: 
  - Lab Reports
  - Vaccinations  
  - Prescriptions
  - Hospital Visits
- **Dark Mode Support**: Toggle between light and dark themes
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Search & Filter**: Find records quickly by type or keyword
- **Record Details**: View detailed information for each health record

## 🛠️ Tech Stack

- **Frontend**: React 18 with Vite
- **Styling**: Tailwind CSS with dark mode support
- **Icons**: Lucide React
- **State Management**: React Context API
- **Build Tool**: Vite

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd hackathon
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 📱 Usage

### Demo Login

For demonstration purposes, use the following NID number:
- **NID**: `1234567890`

### Navigation

1. **Login Page**: Enter your NID number to access the system
2. **Dashboard**: View your health records and profile information
3. **Search**: Use the search bar to find specific records
4. **Filter**: Filter records by type (Lab Reports, Vaccinations, etc.)
5. **Dark Mode**: Toggle between light and dark themes using the moon/sun icon

## 🎨 Design Features

- **Modern UI**: Clean, professional interface with gradient backgrounds
- **Accessibility**: Semantic HTML and keyboard navigation support
- **Performance**: Optimized with Vite for fast development and builds
- **Responsive**: Mobile-first design approach
- **Dark Mode**: System preference detection with manual override

## 📁 Project Structure

```
src/
├── components/          # Reusable React components
├── contexts/           # React Context providers
│   └── DarkModeContext.jsx
├── pages/              # Main application pages
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   └── App.jsx
├── utils/              # Utility functions
├── styles/             # CSS and styling files
│   └── index.css
└── main.jsx           # Application entry point
```

## 🔧 Configuration

### Tailwind CSS

The project uses Tailwind CSS with custom configuration for dark mode:

```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class',
  // ... other config
}
```

### Dark Mode Implementation

Dark mode is implemented using:
- React Context for state management
- localStorage for persistence
- Tailwind's `dark:` prefix for styling
- System preference detection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏛️ About

This project was developed for the E-Governance Nepal initiative to modernize healthcare record management. The system aims to provide citizens with secure, easy access to their medical history while maintaining data privacy and security standards.

## 📞 Support

For support or inquiries, please contact:
- Ministry of Health and Population, Nepal
- Email: support@egovernance.gov.np

---

**Note**: This is a demonstration project. In production, this system would integrate with secure government databases and implement additional security measures including multi-factor authentication and end-to-end encryption.


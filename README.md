# 💰 Finance Dashboard - Deliverables

## 📦 Project Information
- **GitHub Repository**: https://github.com/YOUR_USERNAME/finance-dashboard
- **Live Demo**: https://financedashboard-coral.vercel.app/
- **Demo Video**: [Loom Link Here - Max 3 min]

## 🎯 Completed Features
- ✅ Authentication (Login/Signup) with Appwrite
- ✅ Dashboard with financial metrics & charts
- ✅ Invoice creation with auto-VAT calculation
- ✅ Invoice management (Edit, Delete, Mark as Paid)
- ✅ Real-time status updates
- ✅ Responsive design (Mobile-first)
- ✅ Form validation with Zod
- ✅ Toast notifications

  
## 🏃 How to Run Locally

### Prerequisites
- Node.js 18+ installed
- Appwrite account (free tier)

### Steps
1. **Clone repository**
   \`\`\`bash
   git clone https://github.com/YOUR_USERNAME/finance-dashboard.git
   cd finance-dashboard
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Setup Appwrite**
   - Create project at cloud.appwrite.io
   - Create database "finance_db"
   - Create collection "invoices" with attributes:
     - userId (string, required)
     - invoiceNumber (string, required)
     - clientName (string, required)
     - clientEmail (email, required)
     - amount (float, required)
     - vatPercentage (float, required)
     - vatAmount (float, required)
     - total (float, required)
     - dueDate (datetime, required)
     - status (enum: Paid,Unpaid, required)
     - description (string, optional)
     - createdAt (datetime, required)
     - updatedAt (datetime, required)

4. **Environment variables**
   \`\`\`bash
   cp .env.example .env
   # Fill in your Appwrite credentials
   \`\`\`

5. **Run development server**
   \`\`\`bash
   npm run dev
   \`\`\`

6. **Open browser**
   Navigate to `http://localhost:5173`

## 🎥 Demo Video Highlights
- ✅ User registration & login
- ✅ Dashboard overview with live metrics
- ✅ Creating new invoice with auto-VAT calculation
- ✅ Marking invoice as paid (updates metrics instantly)
- ✅ Responsive design demonstration
- ✅ Form validation examples

## 🐛 Known Issues / Future Improvements
- [ ] Add PDF invoice generation
- [ ] Implement email sending for invoices
- [ ] Add multi-currency support
- [ ] Dark mode toggle
- [ ] Advanced filtering (date range, amount range)
- [ ] Export invoices to CSV/Excel
- [ ] Invoice templates customization

## 📊 Tech Stack
- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS v4, shadcn/ui
- **Backend**: Appwrite (Auth + Database)
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod
- **Routing**: React Router v6
- **State**: Custom Hooks + React Context
- **Testing**: Vitest + Playwright
- **Deployment**: Vercel

## 📝 Code Quality
- ✅ TypeScript strict mode
- ✅ ESLint + Prettier configured
- ✅ Conventional commits with Husky
- ✅ Component-based architecture
- ✅ Responsive mobile-first design
- ✅ WCAG AA accessibility compliance

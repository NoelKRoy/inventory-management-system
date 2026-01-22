# Inventory Management and Tracking System

A comprehensive web-based inventory management application built with **Angular 21** and **TypeScript**. This system monitors product stocks, suppliers, and purchase orders with a modern, responsive UI.

## 🎯 Features

### Core Functionality
- **Product Management**: Create, read, update, and delete products with detailed information
- **Supplier Management**: Manage supplier details and contact information
- **Order Tracking**: Track stock inflow and outflow with order status management
- **Dashboard**: Real-time inventory metrics and low-stock alerts
- **Stock Monitoring**: Automatic low-stock warnings and inventory value calculations

### Technical Features
- **Responsive Design**: Mobile-friendly interface that works on all devices
- **Real-time Data**: RxJS Observables for reactive data updates
- **Form Validation**: Both reactive and template-driven forms with custom validation
- **Custom Pipes**: Low-stock filter pipe for data visualization
- **Custom Directives**: Reorder level highlight directive for visual alerts
- **HTTP Integration**: Full CRUD operations with mock data fallback
- **Error Handling**: Comprehensive error handling and user feedback

## 📦 Technology Stack

| Technology | Version | Purpose |
|---|---|---|
| **Angular** | ^21.0.0 | Web framework |
| **TypeScript** | ~5.9.2 | Language |
| **RxJS** | ~7.8.0 | Reactive programming |
| **Angular Forms** | ^21.0.0 | Form management |
| **Angular Router** | ^21.0.0 | Navigation |
| **Node.js** | Latest | Development environment |

## 📁 Project Structure

```
inventory-management-system/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── dashboard/           # Main dashboard with metrics
│   │   │   ├── product-list/        # Product listing page
│   │   │   ├── product-detail/      # Product details & history
│   │   │   ├── product-form/        # Reactive form for products
│   │   │   ├── supplier-list/       # Supplier management
│   │   │   ├── supplier-form/       # Template-driven supplier form
│   │   │   ├── order-tracker/       # Order tracking page
│   │   │   └── order-form/          # Order creation/editing
│   │   ├── services/
│   │   │   ├── product.service.ts   # Product CRUD & observables
│   │   │   ├── supplier.service.ts  # Supplier CRUD & observables
│   │   │   └── order.service.ts     # Order CRUD & observables
│   │   ├── models/
│   │   │   ├── product.model.ts     # Product interfaces & classes
│   │   │   ├── supplier.model.ts    # Supplier interfaces & classes
│   │   │   └── order.model.ts       # Order interfaces & classes
│   │   ├── pipes/
│   │   │   └── low-stock-filter.pipe.ts  # Filter low-stock products
│   │   ├── directives/
│   │   │   └── reorder-level.directive.ts # Highlight reorder items
│   │   ├── app.ts                   # Root component
│   │   ├── app.routes.ts            # Routing configuration
│   │   └── app.config.ts            # App configuration
│   ├── main.ts                      # Bootstrap file
│   ├── index.html                   # HTML entry point
│   └── styles.css                   # Global styles
├── package.json                     # Dependencies
├── tsconfig.json                    # TypeScript config
└── README.md                        # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm (v11 or higher)
- Angular CLI (`npm install -g @angular/cli`)

### Installation

1. **Navigate to the project:**
   ```bash
   cd inventory-management-system
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Open in browser:**
   Navigate to `http://localhost:4200` in your web browser.

## 📖 Usage Guide

### Dashboard
- **Overview**: Key metrics including total products, suppliers, inventory value
- **Low Stock Alerts**: Products below reorder level
- **Pending Orders**: Orders awaiting completion
- **Recent Activity**: Latest order history

### Products Management
- **List View**: Browse all products with stock status
- **Create**: Add new products with detailed information
- **Details**: View product history and related orders
- **Edit**: Update product information
- **Delete**: Remove products (with confirmation)

### Suppliers Management
- **List View**: Browse all suppliers
- **Create**: Add new suppliers with contact information
- **Edit**: Update supplier details
- **Delete**: Remove suppliers (with confirmation)

### Order Tracking
- **List View**: Track all orders with filtering by type and status
- **Create**: Create new stock inflow/outflow orders
- **Filter**: Filter by order type (In/Out) and status (Pending/Completed/Cancelled)
- **Statistics**: View total inflow/outflow and pending orders

## 🎨 Key Components & Services

### Services (Dependency Injection Pattern)

All services implement CRUD operations and use RxJS Observables for reactive data management.

**ProductService**: Manages product data with low-stock filtering  
**SupplierService**: Handles supplier information and contacts  
**OrderService**: Tracks inventory movements with status management  

### Data Models

Three main domain models with interfaces and implementation classes:

**Product**: Name, price, quantity, reorder level, supplier reference  
**Supplier**: Company info, contact person, email, phone  
**Order**: Product reference, quantity, type (IN/OUT), status, date  

## 🔄 Data Flow Architecture

```
User Interaction → Component → Service (Observable) → HTTP/Mock API
                                      ↓
                           BehaviorSubject (State)
                                      ↓
                           Template (Async Pipe)
                                      ↓
                                 UI Display
```

## 🛣️ Routing Configuration

- `/dashboard` - Main dashboard with key metrics
- `/products` - Product listing and management
- `/products/:id` - Individual product details
- `/suppliers` - Supplier management
- `/orders` - Order tracking and management

## 🎯 Forms Implementation

### Reactive Forms
- **Products**: FormBuilder with custom validators
- **Orders**: Type-safe form control with error handling
- Programmatic form building and validation

### Template-Driven Forms
- **Suppliers**: ngModel two-way binding
- Simple form handling with minimal code
- Good for straightforward data entry

## 🔌 API & Mock Data

The system uses intelligent mock data fallback:

```
HTTP Request Attempt → Success: Use API → Display Data
                   ↓
                 Failure: Use Mock Data
                   ↓
                Display Mock Data with Console Warning
```

Mock data includes sample products, suppliers, and orders for testing.

## 🎨 UI Components & Styling

- **Responsive Grid Layouts**: Adaptable to any screen size
- **Color-Coded Alerts**: Green (good), yellow (warning), red (critical)
- **Interactive Cards**: Hover effects and visual feedback
- **Sidebar Navigation**: Collapsible with icon support
- **Modal Dialogs**: Confirmation for destructive actions

## 📊 Analytics & Metrics

Dashboard displays:
- Total inventory value calculation
- Stock status distribution
- Order volume statistics
- Supplier performance metrics
- Low-stock inventory alerts

## ✅ Key Accomplishments

- ✅ 8 Fully functional components
- ✅ 3 Complete service implementations
- ✅ Comprehensive type safety with TypeScript
- ✅ RxJS Observable patterns
- ✅ Reactive and template-driven forms
- ✅ Custom pipes and directives
- ✅ Responsive mobile-first design
- ✅ Error handling and user feedback
- ✅ Mock API with fallback strategy
- ✅ Complete routing structure

## 🚀 Running the Application

```bash
# Development server
npm start
# Navigate to http://localhost:4200/

# Build for production
npm run build

# Run tests
npm test
```

## 📝 Future Enhancement Opportunities

- Authentication and role-based access control
- Advanced analytics and reporting
- Real-time inventory notifications
- Multi-level supplier management
- Barcode scanning for inventory
- Mobile app version
- Dark mode theme
- Export functionality (CSV/PDF)
- Inventory forecasting
- Supplier performance analytics

## 🔒 Security Features

- Input validation on all forms
- Angular's built-in XSS protection
- CSRF token configuration
- Environment-based settings
- Error logging without sensitive data exposure

---

**Project Version**: 1.0.0  
**Status**: Complete - All objectives achieved  
**Last Updated**: January 2024  
**Built with**: Angular 21 | TypeScript 5.9 | RxJS 7.8

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

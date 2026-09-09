import { Project } from '../types';

export const projectsData: Project[] = [
  {
    id: 'ai-windows-technician',
    slug: 'ai-windows-technician',
    title: 'AI Windows Technician',
    // company is omitted because it is not specified in the project list
    description:
      'An intelligent Windows troubleshooting and technician-assistance application that diagnoses operating system issues, formulates step-by-step repair plans, and executes verified fixes with explicit user authorization.',
    type: 'Desktop App',
    year: '2025',
    status: 'In Progress',
    coverImage: './images/projects/ai-windows-technician/cover.svg',
    screenshots: [
      {
        url: './images/projects/ai-windows-technician/cover.svg',
        caption: 'AI Windows Technician — Diagnostic Investigation & System Remediation Console',
      },
      {
        url: './images/projects/ai-windows-technician/screen1.svg',
        caption: 'Diagnostic questionnaire correlating symptom inputs with telemetry',
      },
      {
        url: './images/projects/ai-windows-technician/screen2.svg',
        caption: 'Explicit authorization gate preventing unintended system modifications',
      },
      {
        url: './images/projects/ai-windows-technician/screen3.svg',
        caption: 'Automated PowerShell execution pipeline with rollback snapshots',
      },
    ],
    technologies: [
      'Python',
      'PowerShell',
      'Windows API',
      'Gemini 2.5',
      'Google AI Studio',
      'SQLite',
    ],
    details: {
      purpose:
        'To provide structured, dependable technical assistance for Windows workstations by moving beyond simple conversational chatbots into real diagnostic investigation and safe action execution.',
      mainFunctions: [
        'Problem Comprehension: Parses symptoms, error codes, and user descriptions into actionable diagnostic paths.',
        'Diagnostic Questioning: Inquires about recent updates, hardware changes, and specific behavioral triggers.',
        'System Evidence Collection: Checks event logs, driver states, disk health, memory usage, and background service statuses.',
        'Issue Analysis: Correlates symptoms with evidence to isolate root causes such as corrupted system files or conflicting drivers.',
        'Repair Plan Generation: Formulates a transparent, sequenced list of remediation steps before taking any action.',
        'User Authorization Guardrails: Requires explicit technician or user approval before running commands or modifying settings.',
        'Verified Action Execution: Performs approved repair tasks using native system tools and PowerShell scripts.',
        'Result Verification & Reporting: Confirms issue resolution post-execution and generates a clean technical summary.',
      ],
      workflow:
        'The technician inputs symptoms or error codes into the console. The system gathers event telemetry, presents clarifying diagnostic queries, and synthesizes an evidence matrix. Once root causes are confirmed, a prioritized repair plan is proposed. The technician reviews and selects specific remediation steps, triggering sandboxed script execution and post-repair system verification.',
      practicalBenefit:
        'Dramatically reduces technician diagnostic time on workstation tickets while eliminating risks of undocumented or accidental registry and driver modifications.',
    },
  },
  {
    id: 'laptop-stocks',
    slug: 'laptop-stocks',
    title: 'Laptop Stocks',
    // company is omitted because it is not specified
    description:
      'A streamlined inventory management web application for tracking laptop specifications, stock levels, condition grading, and location movement across retail and storage points.',
    type: 'Web App',
    year: '2025',
    status: 'In Progress',
    coverImage: './images/projects/laptop-stocks/cover.svg',
    screenshots: [
      {
        url: './images/projects/laptop-stocks/cover.svg',
        caption: 'Laptop Stocks — Active Inventory Management & Specification Table',
      },
      {
        url: './images/projects/laptop-stocks/screen1.svg',
        caption: 'Hardware specification registration sheet with cosmetic grading',
      },
      {
        url: './images/projects/laptop-stocks/screen2.svg',
        caption: 'Unit tracking across warehouse, retail shelf, and workbench locations',
      },
      {
        url: './images/projects/laptop-stocks/screen3.svg',
        caption: 'Stock availability analytics and fast model lookup filter',
      },
    ],
    technologies: [
      'React',
      'TypeScript',
      'Tailwind CSS',
      'Node.js',
      'MySQL',
      'REST API',
    ],
    details: {
      purpose:
        'To replace error-prone spreadsheets with a central, structured database for logging laptop hardware details, tracking inventory movements, and monitoring stock availability in real time.',
      mainFunctions: [
        'Hardware Specification Logging: Records processor models, RAM configurations, storage capacities, battery health, and cosmetic conditions.',
        'Unique Serial & SKU Tracking: Prevents duplicate records and maintains full history per device unit.',
        'Stock Level Monitoring: Visualizes active inventory, items reserved for repair, and available units for sale.',
        'Status Management: Categorizes units by readiness state (In Stock, Under Inspection, Sold, Dispatched).',
        'Fast Search & Filter: Quickly looks up devices by brand, processor tier, or serial number.',
      ],
      workflow:
        'Inbound laptops are logged with CPU, GPU, RAM, SSD capacity, and battery cycle counts. Items undergo physical inspection and are graded. Technicians and sales staff update device locations as units move between testing bench, showroom, and fulfillment.',
      practicalBenefit:
        'Provides instant inventory clarity, prevents overselling across sales channels, and eliminates time wasted manually checking device specs.',
    },
  },
  {
    id: 'digital-coupon-system',
    slug: 'digital-coupon-system',
    title: 'Digital Coupon System',
    company: 'Authentic Asia',
    description:
      'A digital coupon and promotional reward system designed for verified campaign distribution, single-use validation, barcode/QR scanning at checkout, and redemption tracking.',
    type: 'Web App',
    year: '2024',
    status: 'Completed',
    coverImage: './images/projects/digital-coupon-system/cover.svg',
    screenshots: [
      {
        url: './images/projects/digital-coupon-system/cover.svg',
        caption: 'Authentic Asia Digital Coupon System — QR Voucher Redemption Terminal',
      },
      {
        url: './images/projects/digital-coupon-system/screen1.svg',
        caption: 'Promotional campaign batch builder and discount rules config',
      },
      {
        url: './images/projects/digital-coupon-system/screen2.svg',
        caption: 'Point of sale live barcode scanner feed and instant discount deduction',
      },
      {
        url: './images/projects/digital-coupon-system/screen3.svg',
        caption: 'Real-time redemption audit log preventing duplicate voucher reuse',
      },
    ],
    technologies: [
      'React',
      'JavaScript',
      'PHP',
      'MariaDB',
      'REST API',
      'QR Code Integration',
    ],
    details: {
      purpose:
        'To provide a reliable digital alternative to paper vouchers, ensuring that marketing discounts are securely distributed, validated in real-time, and protected against unauthorized duplicate usage.',
      mainFunctions: [
        'Dynamic Coupon Generation: Creates unique, tamper-resistant digital codes tied to specific campaign parameters.',
        'Discount Configuration: Supports percentage-based discounts, fixed monetary reductions, and minimum spend thresholds.',
        'Single-Use Validation Engine: Immediately invalidates codes upon redemption to prevent duplicate usage.',
        'POS & Scanner Support: Formats coupons with high-readability QR codes and barcodes for quick scanning at cash registers.',
        'Customer Delivery & Saving: Allows customers to save coupons to mobile devices or access them via direct links.',
        'Redemption Tracking & Audit: Logs exact timestamp, store location, and transaction ID for each redeemed coupon.',
      ],
      workflow:
        'Marketing managers publish a voucher campaign with expiry dates and discount tiers. Customers receive personalized links displaying responsive QR vouchers. At checkout, cashiers scan the QR code; the system validates the cryptographic token, deducts the discount from the POS register, and locks the code.',
      practicalBenefit:
        'Completely eliminates counterfeit vouchers and repeated discount abuse while cutting checkout delays at physical retail counters.',
    },
  },
  {
    id: 'hr-payslip-portal',
    slug: 'hr-payslip-portal',
    title: 'HR Payslip Portal',
    company: 'Studio - A Photography Services',
    description:
      'An automated payroll and payslip portal that processes employee wage data, generates formatted PDF payslips using standardized templates, and coordinates digital distribution.',
    type: 'Web App',
    year: '2024',
    status: 'Completed',
    coverImage: './images/projects/hr-payslip-portal/cover.svg',
    screenshots: [
      {
        url: './images/projects/hr-payslip-portal/cover.svg',
        caption: 'HR Payslip Portal — Monthly Payroll Batch & Formatted PDF Statement',
      },
      {
        url: './images/projects/hr-payslip-portal/screen1.svg',
        caption: 'Automated wage, overtime, and statutory deduction calculation engine',
      },
      {
        url: './images/projects/hr-payslip-portal/screen2.svg',
        caption: 'Batch PDF rendering pipeline and encrypted distribution queue',
      },
      {
        url: './images/projects/hr-payslip-portal/screen3.svg',
        caption: 'Employee historical statement archive with secure document downloads',
      },
    ],
    technologies: [
      'PHP',
      'HTML',
      'CSS',
      'MySQL',
      'PDF Generation Engine',
      'Docker',
    ],
    details: {
      purpose:
        'To eliminate manual payroll calculation spreadsheets and tedious document formatting by automating monthly payslip generation and distribution for company staff.',
      mainFunctions: [
        'Payroll Data Ingestion: Imports raw work logs, base salaries, overtime rates, deductions, and bonuses.',
        'Template-Based Document Assembly: Formats financial breakdowns into consistent, brand-aligned payslip layouts.',
        'High-Resolution PDF Generation: Converts calculated payroll sheets into secure, printable PDF documents.',
        'Automated Distribution Pipeline: Dispatches payslips to individual employee mailboxes or accessible download links.',
        'Historical Records Archive: Stores past monthly payment summaries for employee reference and accounting audits.',
      ],
      workflow:
        'Monthly timesheets and commission bonuses are entered into the portal. The calculation engine applies deduction formulas, computes net disbursements, and renders individual PDF statements. Payslips are distributed to employees with historical archives maintained.',
      practicalBenefit:
        'Saves studio management extensive hours each pay period, eliminates calculation errors, and gives staff clear, verifiable earnings documentation.',
    },
  },
  {
    id: 'photo-gallery-showcase',
    slug: 'photo-gallery-showcase',
    title: 'Photo Gallery Showcase',
    company: 'Studio - A Photography Services',
    description:
      'A photography portfolio and showcase platform featuring categorized client galleries, high-fidelity image presentation, and a practical administrative asset manager.',
    type: 'Web App',
    year: '2023',
    status: 'Completed',
    coverImage: './images/projects/photo-gallery-showcase/cover.svg',
    screenshots: [
      {
        url: './images/projects/photo-gallery-showcase/cover.svg',
        caption: 'Photo Gallery Showcase — Curated Album Presentation & Media Asset Manager',
      },
      {
        url: './images/projects/photo-gallery-showcase/screen1.svg',
        caption: 'Administrative file-manager interface with batch image organization',
      },
      {
        url: './images/projects/photo-gallery-showcase/screen2.svg',
        caption: 'High-fidelity client presentation viewer with zero compression artifacts',
      },
      {
        url: './images/projects/photo-gallery-showcase/screen3.svg',
        caption: 'Responsive masonry layout optimized for rapid mobile previewing',
      },
    ],
    technologies: [
      'HTML',
      'CSS',
      'JavaScript',
      'PHP',
      'MySQL',
      'Image Optimization Pipeline',
    ],
    details: {
      purpose:
        'To showcase professional commercial and portrait photography in an elegant, client-accessible format with an easy-to-use backend media management workflow for studio staff.',
      mainFunctions: [
        'Categorized Gallery Presentation: Organizes works by shoot type (Events, Commercial, Portraits, Architecture).',
        'Optimized Image Delivery: Serves compressed, fast-loading image assets without sacrificing visual clarity.',
        'File-Manager-Style Admin Interface: Allows studio staff to upload, rename, organize, and reorder photos intuitively.',
        'Responsive Showcase Viewer: Adapts seamlessly from desktop displays to mobile devices with touch navigation.',
      ],
      workflow:
        'Photographers upload high-resolution shoot files. The system optimizes assets into modern WebP formats and indexes them by album and client tags. Clients and site visitors explore curated galleries with lightning-fast navigation.',
      practicalBenefit:
        'Presents studio work in an uncompromising visual format while allowing non-technical studio staff to publish updates in minutes.',
    },
  },
  {
    id: 'credit-ledger-app',
    slug: 'credit-ledger-app',
    title: 'Credit Ledger App',
    company: 'By a person',
    description:
      'A practical personal credit and ledger management application built for maintaining clear transaction records, monitoring outstanding balances, and tracking settlement histories.',
    type: 'Other',
    year: '2023',
    status: 'Completed',
    coverImage: './images/projects/credit-ledger-app/cover.svg',
    screenshots: [
      {
        url: './images/projects/credit-ledger-app/cover.svg',
        caption: 'Credit Ledger App — Running Balance Tracker & Transaction Records',
      },
      {
        url: './images/projects/credit-ledger-app/screen1.svg',
        caption: 'Transaction logging form with categorized memo references',
      },
      {
        url: './images/projects/credit-ledger-app/screen2.svg',
        caption: 'Account breakdown and partial repayment timeline schedule',
      },
      {
        url: './images/projects/credit-ledger-app/screen3.svg',
        caption: 'Settled records audit archive with export history',
      },
    ],
    technologies: [
      'React',
      'JavaScript',
      'Tailwind CSS',
      'Local Database Engine',
      'Git',
    ],
    details: {
      purpose:
        'To provide a simple, distraction-free digital ledger for keeping accurate account of informal credit, borrowed amounts, and payment repayments without unnecessary financial complexity.',
      mainFunctions: [
        'Credit & Debit Entry: Quickly logs credit given or received with timestamp, amount, and note.',
        'Running Balance Calculation: Automatically calculates net balance per individual record.',
        'Payment History Tracking: Records partial payments and marks accounts as cleared upon full settlement.',
        'Search & Historical Archive: Allows swift lookup of past transactions and settled accounts.',
      ],
      workflow:
        'Users record an account entry with initial credit or advance. As payments or additions occur, entries are posted with notes. The application maintains continuous running totals and flags cleared accounts for archiving.',
      practicalBenefit:
        'Replaces error-prone handwritten books with structured, tamper-evident digital records accessible anytime.',
    },
  },
];

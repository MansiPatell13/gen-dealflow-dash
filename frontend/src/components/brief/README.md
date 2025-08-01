# Brief Upload/Paste Interface

This directory contains the implementation of the Brief Upload/Paste Interface feature for the PitchForge application.

## Components

### 1. FileUploadZone.tsx
A comprehensive file upload and text paste component with the following features:

- **Drag & Drop File Upload**: Users can drag and drop files directly onto the upload zone
- **File Type Validation**: Supports PDF, DOC, DOCX, and TXT files
- **File Size Validation**: Maximum file size of 10MB
- **Text Paste Interface**: Alternative tab for pasting brief content directly
- **Visual Feedback**: Clear status indicators and error messages
- **Responsive Design**: Works on both desktop and mobile devices

**Features:**
- File validation with error messages
- Progress indicators
- File size formatting
- Character count for pasted text
- Clear and intuitive UI

### 2. BriefParser.tsx
An AI-powered brief parsing component that:

- **Extracts Key Information**: Automatically parses project briefs to extract:
  - Project title
  - Industry classification
  - Budget range
  - Timeline
  - Project objectives
  - Client details
- **Smart Parsing**: Uses keyword matching and pattern recognition
- **Editable Results**: Users can review and edit parsed information
- **Validation**: Ensures all required fields are properly extracted
- **Integration**: Seamlessly integrates with StructuredBriefDisplay

**Parsing Logic:**
- Industry detection based on keywords
- Budget extraction using regex patterns
- Timeline detection from text
- Objective extraction from bullet points and key phrases

### 3. StructuredBriefDisplay.tsx
A comprehensive display component for parsed briefs with multiple variants:

- **Multiple Display Modes**:
  - **Default**: Standard form-like layout with full editing capabilities
  - **Compact**: Condensed view for lists and overview displays
  - **Detailed**: Full-featured display with enhanced visual hierarchy
- **Interactive Features**:
  - Inline editing with form controls
  - Save/Cancel functionality
  - Read-only mode support
  - Responsive design for all screen sizes
- **Visual Elements**:
  - Icons for each field type
  - Badges for industry classification
  - Structured layout with proper spacing
  - Consistent styling with design system

**Usage Examples:**
```tsx
// Default view with editing
<StructuredBriefDisplay
  brief={parsedBrief}
  onSave={handleSave}
  variant="default"
/>

// Compact view for lists
<StructuredBriefDisplay
  brief={parsedBrief}
  variant="compact"
  showActions={false}
/>

// Detailed view for full display
<StructuredBriefDisplay
  brief={parsedBrief}
  onEdit={handleEdit}
  onSave={handleSave}
  variant="detailed"
/>
```

### 4. BriefWorkflow.tsx
A complete workflow component that orchestrates the entire brief submission process:

- **Step-by-Step Process**: Clear progression through upload → parse → review → submit
- **Progress Indicators**: Visual step indicators showing current progress
- **State Management**: Handles the complete workflow state
- **Integration**: Seamlessly integrates with existing dashboard

**Workflow Steps:**
1. **Upload**: File upload or text paste
2. **Parsing**: AI-powered content analysis
3. **Review**: User review and editing of parsed data
4. **Complete**: Submission to the system

## Integration

The components are integrated into the CustomerDashboard with:

- **New Upload Button**: "Upload Brief" button alongside the existing "Manual Form"
- **Seamless Integration**: Works alongside existing manual form without breaking functionality
- **Consistent UI**: Matches the existing design system and user experience
- **Error Handling**: Comprehensive error handling and user feedback
- **Structured Display**: Uses StructuredBriefDisplay for consistent brief presentation

## Component Architecture

The brief parsing system follows a modular architecture:

```
BriefWorkflow
├── FileUploadZone (Upload/Paste Interface)
├── BriefParser (AI Parsing Logic)
│   └── StructuredBriefDisplay (Display Component)
└── Integration with CustomerDashboard
```

**Data Flow:**
1. User uploads file or pastes text via FileUploadZone
2. BriefParser processes content and extracts structured data
3. StructuredBriefDisplay presents parsed data in editable format
4. User reviews and edits parsed information
5. Final brief is submitted to the system

## Usage

### For Customers:
1. Click "Upload Brief" button on the Customer Dashboard
2. Choose between file upload or text paste
3. Upload a file or paste brief content
4. Review and edit the parsed information
5. Submit the brief

### For Developers:
```tsx
import { BriefWorkflow } from '@/components/brief/BriefWorkflow';

<BriefWorkflow
  onBriefComplete={(parsedBrief) => {
    // Handle the completed brief
    console.log(parsedBrief);
  }}
  onCancel={() => {
    // Handle cancellation
  }}
/>
```

## File Types Supported

- **PDF** (.pdf)
- **Microsoft Word** (.doc, .docx)
- **Plain Text** (.txt)

## Validation Rules

- **File Size**: Maximum 10MB
- **File Types**: PDF, DOC, DOCX, TXT only
- **Content**: Must contain project-related information
- **Required Fields**: Title, industry, budget, objectives, timeline, client details

## Error Handling

- **File Type Errors**: Clear messages for unsupported file types
- **File Size Errors**: Warnings for files exceeding size limits
- **Parsing Errors**: Fallback options when parsing fails
- **Network Errors**: Retry mechanisms for upload failures

## Future Enhancements

1. **Advanced Parsing**: Integration with more sophisticated AI models
2. **Template Support**: Pre-defined brief templates
3. **Batch Upload**: Multiple file upload support
4. **OCR Support**: Image-based brief processing
5. **Real-time Validation**: Live validation as users type

## Technical Implementation

- **React Hooks**: Uses useState, useEffect, useCallback for state management
- **TypeScript**: Fully typed interfaces and props
- **shadcn/ui**: Consistent UI components
- **File API**: Modern browser file handling
- **Error Boundaries**: Graceful error handling
- **Responsive Design**: Mobile-first approach

## Implementation Status

### ✅ Completed Features

**Brief Upload/Paste Interface:**
- ✅ FileUploadZone component with drag & drop
- ✅ File type validation (PDF, DOC, DOCX, TXT)
- ✅ File size validation (10MB limit)
- ✅ Text paste interface with character count
- ✅ Visual feedback and error handling

**Brief Parsing & Structured Display:**
- ✅ BriefParser component with AI-powered parsing
- ✅ StructuredBriefDisplay component with multiple variants
- ✅ Mock brief parsing logic with smart extraction
- ✅ Display of all parsed fields (industry, budget, objectives, timeline, client details)
- ✅ Edit capabilities for all structured fields
- ✅ Brief confirmation step with review workflow

**Integration:**
- ✅ Seamless integration with CustomerDashboard
- ✅ Non-breaking implementation alongside existing manual form
- ✅ Consistent UI/UX with existing design system

## Testing

The implementation includes:
- File validation testing
- Parsing accuracy testing
- UI responsiveness testing
- Error handling testing
- Integration testing with existing dashboard
- Component variant testing (default, compact, detailed) 
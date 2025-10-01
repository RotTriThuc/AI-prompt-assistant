# 🧪 Testing Suite

## 📋 Overview

Testing infrastructure cho AI Prompt Assistant.

**Target Coverage**: 70%+ line coverage

---

## 🏗️ Structure

```
tests/
├── README.md                    # This file
├── setup.test.js                # Test configuration
├── unit/
│   ├── prompt-generation.test.js
│   ├── category-detection.test.js
│   ├── provider-fallback.test.js
│   └── utils.test.js
├── integration/
│   ├── api-endpoints.test.js
│   └── full-workflow.test.js
└── fixtures/
    ├── mock-responses.js
    └── test-inputs.js
```

---

## 🚀 Quick Start

### Installation

```bash
# Install testing dependencies
npm install --save-dev jest @testing-library/jest-dom node-fetch

# Optional: Coverage tools
npm install --save-dev @jest/globals
```

### Run Tests

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test prompt-generation

# Watch mode (re-run on changes)
npm test -- --watch
```

---

## ✅ Example Tests

### tests/unit/category-detection.test.js

```javascript
const { detectCategory } = require('../../script.js');

describe('Category Detection', () => {
    test('should detect code category correctly', () => {
        const inputs = [
            "Create a React component",
            "Build REST API with Node.js",
            "Write Python function to process CSV"
        ];
        
        inputs.forEach(input => {
            expect(detectCategory(input)).toBe('code');
        });
    });
    
    test('should detect creative category', () => {
        const inputs = [
            "Write Instagram content for coffee shop",
            "Create marketing campaign for startup",
            "Design brand story"
        ];
        
        inputs.forEach(input => {
            expect(detectCategory(input)).toBe('creative');
        });
    });
    
    test('should detect business category', () => {
        const inputs = [
            "Create business plan for restaurant",
            "Market analysis for SaaS product",
            "Strategy for customer acquisition"
        ];
        
        inputs.forEach(input => {
            expect(detectCategory(input)).toBe('business');
        });
    });
    
    test('should fallback to universal for ambiguous input', () => {
        const input = "Help me";
        expect(detectCategory(input)).toBe('universal');
    });
});
```

### tests/unit/utils.test.js

```javascript
const { 
    generateTitleFromInput,
    getTimeAgo 
} = require('../../script.js');

describe('Utility Functions', () => {
    describe('generateTitleFromInput', () => {
        test('should generate title from short input', () => {
            const input = "Create todo app";
            const title = generateTitleFromInput(input);
            expect(title).toBe("Create todo app");
        });
        
        test('should truncate long input', () => {
            const input = "Create a very long comprehensive full-stack e-commerce application with authentication payment processing and admin dashboard";
            const title = generateTitleFromInput(input);
            expect(title.length).toBeLessThanOrEqual(50);
            expect(title).toContain('...');
        });
    });
    
    describe('getTimeAgo', () => {
        test('should return "vừa xong" for recent time', () => {
            const now = new Date();
            expect(getTimeAgo(now)).toBe('vừa xong');
        });
        
        test('should return minutes ago', () => {
            const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
            expect(getTimeAgo(fiveMinutesAgo)).toBe('5 phút trước');
        });
        
        test('should return hours ago', () => {
            const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
            expect(getTimeAgo(twoHoursAgo)).toBe('2 giờ trước');
        });
    });
});
```

### tests/integration/api-endpoints.test.js

```javascript
const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3001';

describe('API Endpoints', () => {
    test('health endpoint should return OK', async () => {
        const response = await fetch(`${BASE_URL}/health`);
        const data = await response.json();
        
        expect(response.status).toBe(200);
        expect(data.status).toBe('OK');
    });
    
    test('test-all endpoint should check all providers', async () => {
        const response = await fetch(`${BASE_URL}/api/test-all`);
        const data = await response.json();
        
        expect(response.status).toBe(200);
        expect(data.results).toHaveProperty('openrouter');
        expect(data.results).toHaveProperty('groq');
        expect(data.results).toHaveProperty('gemini');
        expect(data.summary.total_providers).toBe(3);
    });
    
    test('openrouter chat should generate response', async () => {
        const payload = {
            systemPrompt: 'You are a helpful assistant.',
            userInput: 'What is 2+2?',
            model: 'deepseek-chat-v3.1'
        };
        
        const response = await fetch(`${BASE_URL}/api/openrouter/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        const data = await response.json();
        
        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
        expect(data.data.choices[0].message.content).toBeTruthy();
    }, 10000); // 10s timeout for API call
});
```

---

## 📊 Coverage Goals

| Component | Target Coverage | Current | Priority |
|-----------|----------------|---------|----------|
| Category Detection | 90% | TBD | 🔴 High |
| Prompt Generation | 80% | TBD | 🔴 High |
| Provider Fallback | 85% | TBD | 🟠 Medium |
| Utility Functions | 90% | TBD | 🟡 Low |
| UI Components | 60% | TBD | 🟡 Low |

---

## 🎯 Testing Best Practices

### 1. Test Naming Convention
```javascript
// Pattern: "should [expected behavior] when [condition]"
test('should detect code category when input contains programming keywords', () => {
    // ...
});
```

### 2. Arrange-Act-Assert Pattern
```javascript
test('should generate title from input', () => {
    // Arrange
    const input = "Create React app";
    
    // Act
    const result = generateTitleFromInput(input);
    
    // Assert
    expect(result).toBe("Create React app");
});
```

### 3. Test Edge Cases
```javascript
test('should handle empty input gracefully', () => {
    expect(detectCategory('')).toBe('universal');
});

test('should handle very long input', () => {
    const longInput = 'word '.repeat(1000);
    expect(() => generateTitleFromInput(longInput)).not.toThrow();
});
```

---

## 🚀 Next Steps

### Priority 1: Core Functionality Tests
- [ ] Category detection (all categories)
- [ ] Prompt generation (happy path)
- [ ] Provider fallback logic
- [ ] Error handling

### Priority 2: Integration Tests
- [ ] Full workflow (input → output)
- [ ] API endpoint testing
- [ ] Multi-provider scenarios

### Priority 3: Edge Cases
- [ ] Rate limiting behavior
- [ ] Network failures
- [ ] Invalid inputs
- [ ] Boundary conditions

---

## 📝 TODO

- [ ] Setup Jest configuration
- [ ] Create test fixtures
- [ ] Write unit tests (target: 70% coverage)
- [ ] Write integration tests
- [ ] Setup CI/CD testing
- [ ] Add performance benchmarks
- [ ] Document testing guidelines

---

**Status**: 🟡 In Progress  
**Target Date**: Week 3-4 (Phase 2)  
**Priority**: 🟠 HIGH


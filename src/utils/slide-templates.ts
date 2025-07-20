export const slideTemplates = {
  master: `# The Master Template
A showcase of all features in one place.
> Create slides with the speed of thought, powered by Markdown and Vim.

## The Core Essentials
This slide covers the basics of text and lists.

1.  **Styling**: *Italic*, **Bold**, ~~Strikethrough~~, and \`inline code\`.
2.  **Lists**:
    *   Unordered items for flexibility.
    *   Nesting is supported for sub-items.
3.  **Tasks**: A great way to track progress.
    * [x] Demonstrate all core features.
    * [ ] Add more creative examples.
    * [ ] Share with the world!

## Code & Data
Display syntax-highlighted code and structured tables.

\`\`\`javascript
// Fetch data and display it.
async function fetchData(url) {
  const response = await fetch(url);
  const data = await response.json();
  console.log('Data fetched:', data);
  return data;
}
\`\`\`

## Visuals & Quotes
Combine images, links, and nested blockquotes.

![A placeholder image](https://i.ibb.co/qMjBm5yx/M.png)

> This tool is **amazing**.
>> It simplifies the entire presentation workflow.
>> - A Happy User

## The Language of Math ($KaTeX$)
Render beautiful mathematical formulas, from simple to complex.

- **Inline**: The Pythagorean theorem is $a^2 + b^2 = c^2$.
- **Block**: The quadratic formula gives us the roots of $ax^2 + bx + c = 0$.
$$
x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}
$$
- **Matrices**: You can even render complex matrices.
$
A = \\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}
$

## Pro-Tips & Tricks
Master the editor with these handy commands.

*   **Vim Commands**:
    *   \`:w\` - Save as Markdown file.
    *   \`:ws\` - Save as HTML slides.
    *   \`:u\` - Upload a file.
    *   \`:p\` - Preview full slideshow.
    *   \`:t\` - Cycle to the next theme.
    *   \`:f\` - Cycle to the next font.
    *   \`:page\` - Toggle page numbers.
*   **Keyboard Shortcuts**:
    *   \`Ctrl+S\` to save, \`Ctrl+O\` to upload.
    *   Use \`i\` to focus the editor anytime.
`,
  basic: `# Presentation Template
    this is a presentation template

## Introduction

Welcome! This is a basic Markdown template for presentations.  It's designed to be simple, easy to use, and quick to customize.

*   Focus on clear, concise content.
*   Use Markdown for formatting.
*   Separate slides using \`#\` (H1) or \`##\` (H2).


# Core Markdown Elements

## Text Styling

*   **Bold:** \`**This is bold text.**\`
*   *Italic:* \`*This is italic text.*\`
*   \`Inline Code:\` \`This is inline code.\`
*   ~~Strikethrough:~~ \`This is ~~strikethrough text~~.\`


## Lists

### Unordered Lists
*   Item 1
*   Item 2
*   Item 3

### Ordered Lists
1.  First step
1.  Second step
1.  Third step


## Code Blocks

Showcase code snippets clearly.

\`\`\`python
def example_function(x):
  return x * 2

print(example_function(5))
\`\`\`

## Tables
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Item 1   | Item 2   | Item 3   |
| Item 4   | Item 5   | Item 6   |
## Thank you for your attention!
`,
  professional: `# Professional Presentation Template

## Introduction

Welcome! This template is designed for professional presentations, emphasizing clarity, conciseness, and impact. Deliver your message effectively and leave a lasting impression.

*   Focus on key takeaways and actionable insights.
*   Use data visualization to support your arguments.
*   Practice your delivery to project confidence and expertise.

## Agenda

*   [Topic 1]: Brief overview of the first topic.
*   [Topic 2]: Key points and supporting data.
*   [Topic 3]: Actionable recommendations and next steps.

## Problem Statement

Clearly define the problem or opportunity you are addressing.

*   What is the current situation?
*   Why is this a problem worth solving?
*   Quantify the impact with data or metrics.

## Proposed Solution

Present your proposed solution in a clear and compelling manner.

*   How does your solution address the problem?
*   What are the key benefits and advantages?
*   Provide a high-level overview of the implementation.

## Data & Evidence

Support your claims with data, evidence, and research.

| Metric        | Current State | Proposed Solution | Improvement |
|---------------|---------------|-------------------|-------------|
| [Key Metric]  | [Value]       | [Value]           | [Percentage] |
| [Another One] | [Value]       | [Value]           | [Percentage] |

Use charts, graphs, and tables to visually represent data.

## Case Studies & Examples

Illustrate your solution with real-world case studies and examples.

*   [Case Study 1]: Briefly describe the situation, solution, and results.
*   [Case Study 2]: Highlight a different application or benefit.

## Call to Action

Clearly state the next steps you want the audience to take.

*   [Action 1]: What specific action do you want them to take?
*   [Action 2]: Provide clear instructions and resources.

## Q & A

Be prepared to answer questions from the audience with confidence and expertise.

*   Anticipate common questions and prepare concise answers.

## Thank You & Contact Information

Thank the audience for their time and provide your contact information.

*   [Your Name]
*   [Your Title]
*   [Your Email](link)
*   [Your Phone Number](link)`,
};

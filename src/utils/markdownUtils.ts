// utils/markdownUtils.ts
export const markdownToPlainText = (markdown: string | undefined): string => {
  if (!markdown) return '';

  return markdown
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '')
    // Remove headers
    .replace(/#{1,6}\s/g, '')
    // Remove emphasis
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(\*|_)(.*?)\1/g, '$2')
    // Remove images and links, keep text
    .replace(/!\[(.*?)\]\(.*?\)/g, '$1')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    // Remove blockquotes
    .replace(/^\s*>\\s*/gm, '')
    // Remove horizontal rules
    .replace(/^\s*([-*_]\\s*){3,}\s*$/gm, '')
    // Clean up whitespace
    .replace(/\n\s*\n/g, '\n\n')
    .trim();
};
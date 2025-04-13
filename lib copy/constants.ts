// List of available email categories
export const EMAIL_CATEGORIES = ["personal", "work", "important", "spam", "newsletter"] as string[]

// Function to add a new category
export function addCategory(newCategory: string) {
  if (!EMAIL_CATEGORIES.includes(newCategory)) {
    EMAIL_CATEGORIES.push(newCategory)
  }
}

// Allow for string literal type or custom string
export type EmailCategory = (typeof EMAIL_CATEGORIES)[number] | string

# File Processor Skill

## Purpose
Process all files in the inbox/ folder and organize them.

## Instructions
1. Read every file in inbox/
2. Determine what each file is by reading its contents
3. Move to processed/ in appropriate subfolder:
   - processed/invoices/
   - processed/receipts/
   - processed/documents/
   - processed/images/
   - processed/other/
4. Rename files: YYYY-MM-DD-description.ext
5. Create outputs/processing-log-[date].md with all changes

## Constraints
- Never delete files
- Never modify files in reference/
- Ask before creating new category folders

## Naming Convention
YYYY-MM-DD-brief-description.ext
Example: 2026-01-15-amazon-receipt.pdf

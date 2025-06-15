const pdf = require('pdf-parse');
const fs = require('fs').promises;
const logger = require('../config/logger');

/**
 * Extracts text content from a PDF file.
 * @param {Buffer} pdfBuffer - The buffer of the PDF file.
 * @returns {Promise<string>} The extracted text content.
 */
async function extractTextFromPdf(pdfBuffer) {
  try {
    const data = await pdf(pdfBuffer);
    logger.info('Text extracted from PDF successfully.');
    return data.text;
  } catch (error) {
    logger.error('Error extracting text from PDF', { error: error.message });
    throw new Error(`Failed to extract text from PDF: ${error.message}`);
  }
}

/**
 * Extracts text content from a plain text file.
 * @param {Buffer} textBuffer - The buffer of the TXT file.
 * @returns {Promise<string>} The extracted text content.
 */
async function extractTextFromTxt(textBuffer) {
  try {
    logger.info('Text extracted from TXT successfully.');
    return textBuffer.toString('utf8');
  } catch (error) {
    logger.error('Error extracting text from TXT', { error: error.message });
    throw new Error(`Failed to extract text from TXT: ${error.message}`);
  }
}

/**
 * Processes a file to extract its text content based on file type.
 * @param {Buffer} fileBuffer - The buffer of the file.
 * @param {string} fileType - The type of the file (e.g., 'application/pdf', 'text/plain').
 * @returns {Promise<string>} The extracted text content.
 */
async function processFileForTextExtraction(fileBuffer, fileType) {
  switch (fileType) {
    case 'application/pdf':
      return extractTextFromPdf(fileBuffer);
    case 'text/plain':
      return extractTextFromTxt(fileBuffer);
    default:
      logger.warn('Unsupported file type for text extraction', { fileType });
      throw new Error(`Unsupported file type: ${fileType}. Only PDF and TXT are supported.`);
  }
}

module.exports = { processFileForTextExtraction }; 
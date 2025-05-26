/**
 * Comprehensive tests for MessageService
 * Tests both legacy 'to' and new 'recipient' properties
 */

const MessageService = require('./messageService');

describe('MessageService', () => {
  let messageService;

  beforeEach(() => {
    messageService = new MessageService();
  });

  describe('sendMessage', () => {
    const validMessageData = {
      type: 'email',
      to: 'test@example.com',
      subject: 'Test Subject',
      body: 'Test message body'
    };

    it('should send message with legacy "to" property', async () => {
      const result = await messageService.sendMessage(validMessageData);
      
      expect(result.success).toBe(true);
      expect(result.messageId).toBeDefined();
      expect(result.recipient).toBe('test@example.com');
    });

    it('should send message with new "recipient" property', async () => {
      const messageData = {
        type: 'email',
        recipient: 'test@example.com',
        subject: 'Test Subject',
        body: 'Test message body'
      };
      
      const result = await messageService.sendMessage(messageData);
      
      expect(result.success).toBe(true);
      expect(result.messageId).toBeDefined();
      expect(result.recipient).toBe('test@example.com');
    });

    it('should prioritize "recipient" over "to" when both are present', async () => {
      const messageData = {
        type: 'email',
        to: 'old@example.com',
        recipient: 'new@example.com',
        subject: 'Test Subject',
        body: 'Test message body'
      };
      
      const result = await messageService.sendMessage(messageData);
      
      expect(result.recipient).toBe('new@example.com');
    });

    it('should throw error when neither "to" nor "recipient" is provided', async () => {
      const messageData = {
        type: 'email',
        subject: 'Test Subject',
        body: 'Test message body'
      };
      
      await expect(messageService.sendMessage(messageData))
        .rejects
        .toThrow('Recipient is required. Please provide either "to" or "recipient" property.');
    });

    it('should throw error when messageData is null', async () => {
      await expect(messageService.sendMessage(null))
        .rejects
        .toThrow('Message data is required and must be an object');
    });

    it('should throw error when type is missing', async () => {
      const messageData = {
        to: 'test@example.com',
        body: 'Test message body'
      };
      
      await expect(messageService.sendMessage(messageData))
        .rejects
        .toThrow('Message type is required and must be a string');
    });

    it('should throw error when body is missing', async () => {
      const messageData = {
        type: 'email',
        to: 'test@example.com',
        subject: 'Test Subject'
      };
      
      await expect(messageService.sendMessage(messageData))
        .rejects
        .toThrow('Message body is required and must be a string');
    });

    it('should throw error for unsupported message type', async () => {
      const messageData = {
        type: 'carrier_pigeon',
        to: 'test@example.com',
        body: 'Test message body'
      };
      
      await expect(messageService.sendMessage(messageData))
        .rejects
        .toThrow('Unsupported message type: "carrier_pigeon". Supported types: email, sms, push');
    });
  });

  describe('extractRecipient', () => {
    it('should extract recipient from "recipient" property', () => {
      const messageData = { recipient: 'test@example.com' };
      const result = messageService.extractRecipient(messageData);
      expect(result).toBe('test@example.com');
    });

    it('should extract recipient from "to" property when "recipient" is not present', () => {
      const messageData = { to: 'test@example.com' };
      const result = messageService.extractRecipient(messageData);
      expect(result).toBe('test@example.com');
    });

    it('should prioritize "recipient" over "to"', () => {
      const messageData = { 
        to: 'old@example.com',
        recipient: 'new@example.com'
      };
      const result = messageService.extractRecipient(messageData);
      expect(result).toBe('new@example.com');
    });

    it('should return null when neither property is present', () => {
      const messageData = {};
      const result = messageService.extractRecipient(messageData);
      expect(result).toBeNull();
    });

    it('should trim whitespace from recipient', () => {
      const messageData = { recipient: '  test@example.com  ' };
      const result = messageService.extractRecipient(messageData);
      expect(result).toBe('test@example.com');
    });
  });

  describe('sanitizeForLogging', () => {
    it('should sanitize message data for logging', () => {
      const messageData = {
        type: 'email',
        recipient: 'test@example.com',
        subject: 'Test Subject',
        body: 'Test message body',
        metadata: { priority: 'high' }
      };
      
      const result = messageService.sanitizeForLogging(messageData);
      
      expect(result).toEqual({
        type: 'email',
        hasRecipient: true,
        hasBody: true,
        hasSubject: true,
        hasMetadata: true
      });
    });

    it('should handle null input', () => {
      const result = messageService.sanitizeForLogging(null);
      expect(result).toBeNull();
    });
  });
});
/**
 * MessageService - ROBUST VERSION with backward compatibility
 * Fixes the recipient validation issue with proper error handling
 */

class MessageService {
  constructor() {
    this.providers = {
      email: this.sendEmail.bind(this),
      sms: this.sendSMS.bind(this),
      push: this.sendPush.bind(this)
    };
  }

  /**
   * Send a message using the appropriate provider
   * @param {Object} messageData - Message data
   * @param {string} messageData.type - Message type (email, sms, push)
   * @param {string} [messageData.to] - Recipient address/phone (legacy)
   * @param {string} [messageData.recipient] - Recipient address/phone (new)
   * @param {string} messageData.subject - Message subject (for email)
   * @param {string} messageData.body - Message content
   * @param {Object} messageData.metadata - Additional metadata
   */
  async sendMessage(messageData) {
    try {
      // Validate input object
      if (!messageData || typeof messageData !== 'object') {
        throw new Error('Message data is required and must be an object');
      }

      // Validate message type
      if (!messageData.type || typeof messageData.type !== 'string') {
        throw new Error('Message type is required and must be a string');
      }

      // ✅ ROBUST RECIPIENT VALIDATION with backward compatibility
      const recipient = this.extractRecipient(messageData);
      
      if (!recipient) {
        throw new Error(
          'Recipient is required. Please provide either "to" or "recipient" property.'
        );
      }

      // Validate message body
      if (!messageData.body || typeof messageData.body !== 'string') {
        throw new Error('Message body is required and must be a string');
      }

      // Validate provider exists
      const provider = this.providers[messageData.type];
      if (!provider) {
        const supportedTypes = Object.keys(this.providers).join(', ');
        throw new Error(
          `Unsupported message type: "${messageData.type}". Supported types: ${supportedTypes}`
        );
      }

      // Normalize message data for provider
      const normalizedData = {
        ...messageData,
        to: recipient, // Always use 'to' internally
        recipient: recipient // Also provide 'recipient' for new consumers
      };

      // Send the message
      const result = await provider(normalizedData);
      
      console.log(`Message sent successfully via ${messageData.type}:`, {
        to: recipient,
        type: messageData.type,
        timestamp: new Date().toISOString(),
        messageId: result.messageId
      });

      return {
        success: true,
        messageId: result.messageId,
        timestamp: new Date().toISOString(),
        recipient: recipient,
        type: messageData.type
      };

    } catch (error) {
      console.error('Error sending message:', {
        error: error.message,
        messageData: this.sanitizeForLogging(messageData),
        timestamp: new Date().toISOString()
      });
      throw error;
    }
  }

  /**
   * Extract recipient from message data with backward compatibility
   * @param {Object} messageData - Message data object
   * @returns {string|null} - Recipient address or null if not found
   */
  extractRecipient(messageData) {
    // Priority: recipient > to (for backward compatibility)
    const recipient = messageData.recipient || messageData.to;
    
    // Validate recipient format if present
    if (recipient && typeof recipient === 'string' && recipient.trim()) {
      return recipient.trim();
    }
    
    return null;
  }

  /**
   * Sanitize message data for logging (remove sensitive info)
   * @param {Object} messageData - Message data
   * @returns {Object} - Sanitized data for logging
   */
  sanitizeForLogging(messageData) {
    if (!messageData) return null;
    
    return {
      type: messageData.type,
      hasRecipient: !!(messageData.recipient || messageData.to),
      hasBody: !!messageData.body,
      hasSubject: !!messageData.subject,
      hasMetadata: !!messageData.metadata
    };
  }

  async sendEmail(messageData) {
    // Validate email-specific requirements
    if (!messageData.subject) {
      throw new Error('Email messages require a subject');
    }
    
    await this.delay(100);
    return {
      messageId: `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      provider: 'email',
      status: 'sent',
      timestamp: new Date().toISOString()
    };
  }

  async sendSMS(messageData) {
    // Validate SMS-specific requirements
    if (messageData.body.length > 160) {
      console.warn('SMS message exceeds 160 characters, may be split into multiple messages');
    }
    
    await this.delay(150);
    return {
      messageId: `sms_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      provider: 'sms',
      status: 'sent',
      timestamp: new Date().toISOString()
    };
  }

  async sendPush(messageData) {
    await this.delay(80);
    return {
      messageId: `push_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      provider: 'push',
      status: 'sent',
      timestamp: new Date().toISOString()
    };
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = MessageService;
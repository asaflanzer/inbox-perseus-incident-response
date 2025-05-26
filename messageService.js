/**
 * MessageService - REVERTED VERSION
 * This restores the working code before the problematic recipient change
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
   * @param {string} messageData.to - Recipient address/phone (RESTORED)
   * @param {string} messageData.subject - Message subject (for email)
   * @param {string} messageData.body - Message content
   * @param {Object} messageData.metadata - Additional metadata
   */
  async sendMessage(messageData) {
    try {
      // Validate input
      if (!messageData) {
        throw new Error('Message data is required');
      }

      if (!messageData.type) {
        throw new Error('Message type is required');
      }

      // ✅ FIXED: Back to using messageData.to (the working version)
      if (!messageData.to) {
        throw new Error('Recipient is required');
      }

      if (!messageData.body) {
        throw new Error('Message body is required');
      }

      // Get the appropriate provider
      const provider = this.providers[messageData.type];
      if (!provider) {
        throw new Error(`Unsupported message type: ${messageData.type}`);
      }

      // Send the message
      const result = await provider(messageData);
      
      console.log(`Message sent successfully via ${messageData.type}:`, {
        to: messageData.to,
        type: messageData.type,
        timestamp: new Date().toISOString()
      });

      return {
        success: true,
        messageId: result.messageId,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  async sendEmail(messageData) {
    await this.delay(100);
    return {
      messageId: `email_${Date.now()}`,
      provider: 'email',
      status: 'sent'
    };
  }

  async sendSMS(messageData) {
    await this.delay(150);
    return {
      messageId: `sms_${Date.now()}`,
      provider: 'sms',
      status: 'sent'
    };
  }

  async sendPush(messageData) {
    await this.delay(80);
    return {
      messageId: `push_${Date.now()}`,
      provider: 'push',
      status: 'sent'
    };
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = MessageService;
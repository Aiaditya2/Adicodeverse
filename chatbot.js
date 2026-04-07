// Adi-CodeVerse Chatbot System

class ChatBot {
    constructor() {
        this.chatHistory = JSON.parse(localStorage.getItem('chatHistory') || '[]');
        this.responses = {
            greetings: [
                "Hi Developer! 👋 Welcome to Adi-CodeVerse!",
                "Hello there! Ready to code something amazing? 🚀",
                "Hey! How can I help you today? 💻"
            ],
            help: [
                "I can help you with:\n• Learning resources 📚\n• Code editor tips 💻\n• Project management 📁\n• Community features 🌍",
                "Here's what I can do:\n1. Guide you to learning resources\n2. Help with coding questions\n3. Assist with project management\n4. Connect you with the community",
                "I'm your coding assistant! Ask me about:\n- Learning paths\n- Code issues\n- Platform features\n- Best practices"
            ],
            learning: [
                "Great choice! Here are learning resources:\n• HTML: Start with tags and structure\n• CSS: Focus on styling and layouts\n• JavaScript: Learn variables and functions\n• Practice daily in our editor! 💪",
                "Learning path suggestion:\n1️⃣ Master HTML basics\n2️⃣ Add CSS styling\n3️⃣ Learn JavaScript fundamentals\n4️⃣ Build projects\n5️⃣ Join our community! 🌟",
                "For learning JavaScript, I recommend:\n• Start with variables and data types\n• Learn functions and scope\n• Practice DOM manipulation\n• Build small projects\n• Use our code editor! 🛠️"
            ],
            coding: [
                "Coding tip: Always write clean, readable code with proper comments! 📝\nNeed help? Try our code editor with live preview!",
                "Best practices:\n• Use meaningful variable names\n• Write modular functions\n• Test your code frequently\n• Don't forget to save projects! 💾",
                "Stuck on a problem?\n1. Break it down into smaller parts\n2. Use console.log() for debugging\n3. Check our learning resources\n4. Ask the community for help! 🤝"
            ],
            projects: [
                "Project management tips:\n• Save your work regularly 💾\n• Use descriptive names\n• Break large projects into small tasks\n• Track your progress! 📊",
                "To save a project:\n1. Write your code in the editor\n2. Click 'Save Project'\n3. Enter a name\n4. Access anytime from dashboard! 📁",
                "Project ideas for beginners:\n• Personal portfolio website\n• Todo list app\n• Calculator\n• Weather app\n• Blog platform 🚀"
            ],
            community: [
                "Join our community to:\n• Share your projects 📤\n• Get feedback on your code\n• Learn from other developers\n• Find collaborators! 🤝",
                "Community features:\n• Create posts to share your work\n• Like and comment on others' projects\n• Ask questions and help others\n• Build your network! 🌍",
                "Be a good community member:\n• Share helpful resources\n• Provide constructive feedback\n• Celebrate others' successes\n• Keep posts positive and supportive! 💙"
            ],
            jobs: [
                "Job hunting tips:\n• Build a strong portfolio 📁\n• Contribute to open source\n• Network in our community\n• Keep learning new skills! 📚",
                "Popular skills for developers:\n• JavaScript/TypeScript\n• React/Vue/Angular\n• Node.js/Python\n• Git/GitHub\n• Cloud platforms ☁️",
                "Find opportunities:\n• Check our jobs page regularly\n• Highlight your best projects\n• Network with other developers\n• Never stop learning! 🎯"
            ],
            default: [
                "That's interesting! Tell me more about what you'd like to know. 🤔",
                "I'm here to help! Try asking about learning, coding, projects, or community. 💻",
                "Great question! Explore our platform features or ask me for specific guidance. 🚀",
                "I'd love to help! You can ask me about:\n• Learning resources\n• Coding help\n• Project tips\n• Community features 🌟"
            ]
        };
    }

    init() {
        this.createChatWidget();
        this.loadChatHistory();
    }

    createChatWidget() {
        // Create floating chat button
        const chatButton = document.createElement('div');
        chatButton.className = 'chatbot-button';
        chatButton.innerHTML = '💬';
        chatButton.onclick = () => this.toggleChat();
        document.body.appendChild(chatButton);

        // Create chat window
        const chatWindow = document.createElement('div');
        chatWindow.className = 'chatbot-window';
        chatWindow.innerHTML = `
            <div class="chatbot-header">
                <h4>🤖 CodeBot Assistant</h4>
                <button class="chatbot-close" onclick="chatBot.toggleChat()">×</button>
            </div>
            <div class="chatbot-messages" id="chatMessages"></div>
            <div class="chatbot-input-container">
                <input type="text" id="chatInput" placeholder="Ask me anything about coding..." onkeypress="if(event.key==='Enter') chatBot.sendMessage()">
                <button onclick="chatBot.sendMessage()">Send</button>
            </div>
        `;
        document.body.appendChild(chatWindow);

        this.chatWindow = chatWindow;
        this.messagesContainer = document.getElementById('chatMessages');
        this.chatInput = document.getElementById('chatInput');
    }

    toggleChat() {
        this.chatWindow.style.display = this.chatWindow.style.display === 'flex' ? 'none' : 'flex';
        if (this.chatWindow.style.display === 'flex') {
            this.chatInput.focus();
        }
    }

    sendMessage() {
        const message = this.chatInput.value.trim();
        if (!message) return;

        // Add user message
        this.addMessage(message, 'user');
        this.chatInput.value = '';

        // Generate bot response
        setTimeout(() => {
            const response = this.generateResponse(message);
            this.addMessage(response, 'bot');
        }, 500);
    }

    addMessage(message, sender) {
        const messageElement = document.createElement('div');
        messageElement.className = `chat-message ${sender}`;
        messageElement.innerHTML = `
            <div class="message-content">${this.formatMessage(message)}</div>
            <div class="message-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
        `;
        this.messagesContainer.appendChild(messageElement);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;

        // Save to history
        this.chatHistory.push({
            message,
            sender,
            timestamp: new Date().toISOString()
        });
        this.saveChatHistory();
    }

    generateResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase();

        // Check for keywords and return appropriate response
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
            return this.getRandomResponse('greetings');
        } else if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
            return this.getRandomResponse('help');
        } else if (lowerMessage.includes('learn') || lowerMessage.includes('study') || lowerMessage.includes('tutorial')) {
            return this.getRandomResponse('learning');
        } else if (lowerMessage.includes('code') || lowerMessage.includes('coding') || lowerMessage.includes('program')) {
            return this.getRandomResponse('coding');
        } else if (lowerMessage.includes('project') || lowerMessage.includes('save')) {
            return this.getRandomResponse('projects');
        } else if (lowerMessage.includes('community') || lowerMessage.includes('social') || lowerMessage.includes('post')) {
            return this.getRandomResponse('community');
        } else if (lowerMessage.includes('job') || lowerMessage.includes('career') || lowerMessage.includes('work')) {
            return this.getRandomResponse('jobs');
        } else {
            return this.getRandomResponse('default');
        }
    }

    getRandomResponse(category) {
        const responses = this.responses[category];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    formatMessage(message) {
        // Convert newlines to <br> and basic formatting
        return message.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    }

    loadChatHistory() {
        if (this.chatHistory.length > 0) {
            this.chatHistory.forEach(msg => {
                this.addMessage(msg.message, msg.sender);
            });
        }
    }

    saveChatHistory() {
        // Keep only last 50 messages
        const recentHistory = this.chatHistory.slice(-50);
        localStorage.setItem('chatHistory', JSON.stringify(recentHistory));
    }
}

// Initialize chatbot when DOM is loaded
let chatBot;
document.addEventListener('DOMContentLoaded', function() {
    chatBot = new ChatBot();
    chatBot.init();
});

class HelpdeskChatbot {
    constructor() {
        this.state = 'IDLE'; // IDLE, CHECK_STATUS_INPUT, CREATE_TICKET_AUTH, CREATE_TICKET_SUBJECT, CREATE_TICKET_DESC, CREATE_TICKET_DEPT, CREATE_TICKET_PRIORITY
        this.ticketData = {};
        this.isOpen = false;
        this.render();
    }

    render() {
        // 1. Inject Styles
        const style = document.createElement('style');
        style.textContent = `
            #chatbot-btn {
                position: fixed;
                bottom: 24px;
                right: 24px;
                width: 60px;
                height: 60px;
                background-color: #254798;
                color: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 4px 12px rgba(37, 71, 152, 0.3);
                cursor: pointer;
                transition: transform 0.2s, box-shadow 0.2s;
                z-index: 9999;
            }
            #chatbot-btn:hover {
                transform: scale(1.05);
                box-shadow: 0 6px 16px rgba(37, 71, 152, 0.4);
            }
            #chatbot-window {
                position: fixed;
                bottom: 100px;
                right: 24px;
                width: 350px;
                height: 500px;
                background-color: white;
                border-radius: 12px;
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
                display: flex;
                flex-direction: column;
                z-index: 9999;
                opacity: 0;
                pointer-events: none;
                transform: translateY(20px);
                transition: opacity 0.3s, transform 0.3s;
                overflow: hidden;
            }
            #chatbot-window.open {
                opacity: 1;
                pointer-events: all;
                transform: translateY(0);
            }
            .dark #chatbot-window {
                background-color: #1E293B;
                border: 1px solid #334155;
            }
            #chatbot-header {
                background-color: #254798;
                color: white;
                padding: 16px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-weight: 600;
            }
            #chatbot-messages {
                flex: 1;
                padding: 16px;
                overflow-y: auto;
                display: flex;
                flex-direction: column;
                gap: 12px;
                background-color: #F8FAFC;
            }
            .dark #chatbot-messages {
                background-color: #0F172A;
            }
            .chat-msg {
                max-width: 80%;
                padding: 10px 14px;
                border-radius: 12px;
                font-size: 14px;
                line-height: 1.4;
            }
            .chat-msg.bot {
                background-color: white;
                border: 1px solid #E2E8F0;
                color: #1E293B;
                align-self: flex-start;
                border-bottom-left-radius: 2px;
            }
            .dark .chat-msg.bot {
                background-color: #1E293B;
                border-color: #334155;
                color: #F1F5F9;
            }
            .chat-msg.user {
                background-color: #254798;
                color: white;
                align-self: flex-end;
                border-bottom-right-radius: 2px;
            }
            .chat-options {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                margin-top: 4px;
            }
            .chat-option-btn {
                background-color: white;
                border: 1px solid #254798;
                color: #254798;
                padding: 6px 12px;
                border-radius: 16px;
                font-size: 12px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s;
            }
            .chat-option-btn:hover {
                background-color: #254798;
                color: white;
            }
            .dark .chat-option-btn {
                background-color: #1E293B;
                border-color: #60A5FA;
                color: #60A5FA;
            }
            .dark .chat-option-btn:hover {
                background-color: #60A5FA;
                color: #1E293B;
            }
            #chatbot-input-area {
                padding: 12px;
                border-top: 1px solid #E2E8F0;
                display: flex;
                gap: 8px;
                background-color: white;
            }
            .dark #chatbot-input-area {
                background-color: #1E293B;
                border-color: #334155;
            }
            #chatbot-input {
                flex: 1;
                border: 1px solid #CBD5E1;
                border-radius: 20px;
                padding: 8px 16px;
                font-size: 14px;
                outline: none;
                background-color: #F8FAFC;
            }
            .dark #chatbot-input {
                background-color: #0F172A;
                border-color: #334155;
                color: white;
            }
            #chatbot-input:focus {
                border-color: #254798;
            }
            #chatbot-send {
                color: #254798;
                background: none;
                border: none;
                cursor: pointer;
                padding: 4px;
            }
            .dark #chatbot-send {
                color: #60A5FA;
            }
            /* Markdown-like simple formatting */
            .chat-msg b { font-weight: 600; }
        `;
        document.head.appendChild(style);

        // 2. Inject HTML
        const container = document.createElement('div');
        container.innerHTML = `
            <div id="chatbot-btn">
                <span class="material-icons-outlined" style="font-size: 28px;">smart_toy</span>
            </div>
            <div id="chatbot-window">
                <div id="chatbot-header">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span class="material-icons-outlined">support_agent</span>
                        <span>Shubham Support</span>
                    </div>
                    <button id="chatbot-close" style="background: none; border: none; color: white; cursor: pointer;">
                        <span class="material-icons-outlined">close</span>
                    </button>
                </div>
                <div id="chatbot-messages"></div>
                <div id="chatbot-input-area">
                    <input type="text" id="chatbot-input" placeholder="Type a message...">
                    <button id="chatbot-send">
                        <span class="material-icons-outlined">send</span>
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(container);

        // 3. Elements
        this.btn = document.getElementById('chatbot-btn');
        this.window = document.getElementById('chatbot-window');
        this.messages = document.getElementById('chatbot-messages');
        this.input = document.getElementById('chatbot-input');
        this.sendBtn = document.getElementById('chatbot-send');
        this.closeBtn = document.getElementById('chatbot-close');

        // 4. Events
        this.btn.addEventListener('click', () => this.toggle());
        this.closeBtn.addEventListener('click', () => this.toggle(false));
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });

        // 5. Initial Greeting
        this.addBotMessage('Hi! I\'m your Shubham Support Assistant. How can I help you today?', [
            { text: 'Create Ticket', value: 'create_ticket' },
            { text: 'Check Status', value: 'check_status' }
        ]);
    }

    toggle(force) {
        this.isOpen = force !== undefined ? force : !this.isOpen;
        if (this.isOpen) {
            this.window.classList.add('open');
            this.input.focus();
        } else {
            this.window.classList.remove('open');
        }
    }

    sendMessage(text) {
        const msg = text || this.input.value.trim();
        if (!msg) return;

        this.addUserMessage(msg);
        this.input.value = '';
        this.handleCommand(msg);
    }

    addUserMessage(text) {
        const div = document.createElement('div');
        div.className = 'chat-msg user';
        div.textContent = text;
        this.messages.appendChild(div);
        this.scrollToBottom();
    }

    addBotMessage(text, options = []) {
        const div = document.createElement('div');
        div.className = 'chat-msg bot';

        // Basic HTML formatting
        div.innerHTML = text.replace(/\n/g, '<br>');

        if (options.length > 0) {
            const optsDiv = document.createElement('div');
            optsDiv.className = 'chat-options';
            options.forEach(opt => {
                const btn = document.createElement('button');
                btn.className = 'chat-option-btn';
                btn.textContent = opt.text;
                btn.onclick = () => this.handleOptionClick(opt.value, opt.text);
                optsDiv.appendChild(btn);
            });
            div.appendChild(optsDiv);
        }

        this.messages.appendChild(div);
        this.scrollToBottom();
    }

    scrollToBottom() {
        this.messages.scrollTop = this.messages.scrollHeight;
    }

    handleOptionClick(value, text) {
        this.addUserMessage(text);
        this.handleCommand(value, true); // true = isOption
    }

    async handleCommand(text, isOption = false) {
        // Normalize
        const cmd = isOption ? text : text.toLowerCase();

        // Global Cancel
        if (cmd === 'cancel' || cmd === 'reset') {
            this.state = 'IDLE';
            this.ticketData = {};
            this.addBotMessage('Cancelled. How can I help?', [
                { text: 'Create Ticket', value: 'create_ticket' },
                { text: 'Check Status', value: 'check_status' }
            ]);
            return;
        }

        // Logic based on state
        switch (this.state) {
            case 'IDLE':
                if (cmd === 'create_ticket' || text.includes('create')) {
                    this.startCreateTicket();
                } else if (cmd === 'check_status' || text.includes('status') || text.includes('track')) {
                    this.state = 'CHECK_STATUS_INPUT';
                    this.addBotMessage('Sure! Please enter your <b>Ticket ID</b> to check its status.');
                } else {
                    this.addBotMessage('I didn\'t quite get that. Please select an option:', [
                        { text: 'Create Ticket', value: 'create_ticket' },
                        { text: 'Check Status', value: 'check_status' }
                    ]);
                }
                break;

            case 'CHECK_STATUS_INPUT':
                await this.checkStatus(text);
                break;

            case 'CREATE_TICKET_AUTH': // Just asking for Employee ID if not logged in
                this.ticketData.employeeId = text;
                // Verify employee logic could go here, for now trust input or check local
                this.state = 'CREATE_TICKET_SUBJECT';
                this.addBotMessage('Thanks. What is the <b>Subject</b> of your issue?');
                break;

            case 'CREATE_TICKET_SUBJECT':
                this.ticketData.subject = text;
                this.state = 'CREATE_TICKET_DEPT';
                this.addBotMessage('Select a <b>Department</b>:', [
                    { text: 'IT Support', value: 'IT Support' },
                    { text: 'ERP Support', value: 'ERP Support' }
                ]);
                break;

            case 'CREATE_TICKET_DEPT':
                if (['IT Support', 'ERP Support'].includes(text)) {
                    this.ticketData.category = text;
                    this.state = 'CREATE_TICKET_PRIORITY';
                    this.addBotMessage('Select <b>Priority</b>:', [
                        { text: 'Low', value: 'Low' },
                        { text: 'Medium', value: 'Medium' },
                        { text: 'High', value: 'High' },
                        { text: 'Urgent', value: 'Urgent' }
                    ]);
                } else {
                    this.addBotMessage('Please select a valid department:', [
                        { text: 'IT Support', value: 'IT Support' },
                        { text: 'ERP Support', value: 'ERP Support' }
                    ]);
                }
                break;

            case 'CREATE_TICKET_PRIORITY':
                if (['Low', 'Medium', 'High', 'Urgent'].includes(text)) {
                    this.ticketData.priority = text;
                    this.state = 'CREATE_TICKET_DESC';
                    this.addBotMessage('Please describe your issue in detail.');
                } else {
                    this.addBotMessage('Please select a valid priority:', [
                        { text: 'Low', value: 'Low' },
                        { text: 'Medium', value: 'Medium' }
                    ]);
                }
                break;

            case 'CREATE_TICKET_DESC':
                this.ticketData.description = text;
                await this.submitTicket();
                break;
        }
    }

    async checkStatus(ticketId) {
        this.addBotMessage('Checking status...');
        try {
            // Using existing API helper or fetch directly if needed
            // Assuming TicketAPI is available globally via api.js
            const response = await TicketAPI.getByTicketId(ticketId); // This might return a promise
            // TicketAPI returns data directly typically based on api.js implementation:
            // return data; 

            if (response.success && response.data) {
                const t = response.data;
                this.addBotMessage(`
                    <b>Ticket Found!</b><br>
                    ID: ${t.ticketId || t._id}<br>
                    Subject: ${t.subject}<br>
                    Status: <b>${t.status}</b><br>
                    Priority: ${t.priority}
                `);
                this.state = 'IDLE';
                setTimeout(() => {
                    this.addBotMessage('Anything else?', [
                        { text: 'Create Ticket', value: 'create_ticket' },
                        { text: 'Check Status', value: 'check_status' }
                    ]);
                }, 1000);
            } else {
                this.addBotMessage('Ticket not found. Please check the ID and try again, or type "cancel".');
            }
        } catch (error) {
            console.error(error);
            // Show specific error message from API (e.g., "Ticket not found")
            const errorMsg = error.message || 'Error fetching ticket';
            this.addBotMessage(`${errorMsg}. Please try again or type "cancel".`);
        }
    }

    startCreateTicket() {
        this.ticketData = {};

        // Check if logged in
        const employee = localStorage.getItem('employee') ? JSON.parse(localStorage.getItem('employee')) : null;

        if (employee) {
            this.ticketData.employeeId = employee.employeeId;
            this.state = 'CREATE_TICKET_SUBJECT';
            this.addBotMessage('Let\'s create a ticket. What is the <b>Subject</b>?');
        } else {
            this.state = 'CREATE_TICKET_AUTH';
            this.addBotMessage('To create a ticket, I need your <b>Employee ID</b> first.');
        }
    }

    async submitTicket() {
        this.addBotMessage('Creating ticket...');
        try {
            // Prepare FormData as expected by backend
            const formData = new FormData();
            formData.append('subject', this.ticketData.subject);
            formData.append('category', this.ticketData.category); // 'Department' in UI, 'category' in backend often?
            formData.append('priority', this.ticketData.priority);
            formData.append('description', this.ticketData.description);
            formData.append('employeeId', this.ticketData.employeeId);

            // Backend often requires project, default if missing? 
            // In api.js/ticketController, if project is missing, handled?
            // Let's assume creating without project is fine OR fetch public projects.
            // For now, let's try sending minimal.

            // Note: TicketAPI.create uses formData
            const response = await TicketAPI.create(formData);

            if (response.success) {
                this.addBotMessage(`
                    <b>Ticket Created Successfully!</b><br>
                    ID: <b>${response.data.ticketId}</b><br>
                    We'll look into it shortly.
                `);
            } else {
                this.addBotMessage('Failed to create ticket: ' + (response.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('Chatbot submit ticket error:', error);
            const errorMsg = error.message || 'Unknown error';
            this.addBotMessage(`Error creating ticket: ${errorMsg}. Please try via the main form if this persists.`);
        }

        this.state = 'IDLE';
        this.ticketData = {};
        setTimeout(() => {
            this.addBotMessage('Can I help with anything else?', [
                { text: 'Create Ticket', value: 'create_ticket' },
                { text: 'Check Status', value: 'check_status' }
            ]);
        }, 1500);
    }
}

// Init
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.chatbot = new HelpdeskChatbot());
} else {
    window.chatbot = new HelpdeskChatbot();
}

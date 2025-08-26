import { isConnected, phraseList, publicKey, data } from "./connectWallet";

export let currentUserPublicKey: string = "";
let currentChatBuddyPublicId: string = "";

// Set current user public key (called when wallet connects)
export function setCurrentUserPublicKey(pubKey: string): void {
  currentUserPublicKey = pubKey;
  console.log("Current user public key set in chat:", pubKey);
}

document.addEventListener("DOMContentLoaded", () => {
  const contactListView = document.getElementById(
    "contact-list-view",
  ) as HTMLElement | null;
  const chatInterface = document.getElementById(
    "chat-interface",
  ) as HTMLElement | null;
  const contactItems = document.querySelectorAll(".contact-item");
  const chatBackBtn = document.querySelector(".chat-back-container");
  const contactsBackBtn = document.getElementById("contacts-back-btn");
  const chatUsername = document.getElementById("chat-username");
  const chatLastSeen = document.getElementById("chat-last-seen");

  // Check if chat interface is initially active
  if (chatInterface && chatInterface.style.display === "flex") {
    document.body.classList.add("chat-active");
  }

  // Function to go back to contacts
  const goBackToContacts = (): void => {
    console.log("Going back to contact list");
    if (contactListView && chatInterface) {
      contactListView.style.display = "block";
      chatInterface.style.display = "none";
      // Remove chat-active class when leaving chat
      document.body.classList.remove("chat-active");
    }
  };

  contactItems.forEach((item) => {
    item.addEventListener("click", function (this: HTMLElement) {
      const username = this.getAttribute("data-username") || "";
      const lastSeen = this.getAttribute("data-lastseen") || "";

      if (chatUsername) chatUsername.textContent = username;
      if (chatLastSeen) chatLastSeen.textContent = lastSeen;

      if (contactListView && chatInterface) {
        contactListView.style.display = "none";
        chatInterface.style.display = "flex";
        // Add chat-active class when entering chat
        document.body.classList.add("chat-active");
      }
    });
  });

  if (chatBackBtn) {
    chatBackBtn.addEventListener("click", (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      goBackToContacts();
    });

    chatBackBtn.addEventListener("touchstart", (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      goBackToContacts();
    });
  }

  if (contactsBackBtn) {
    contactsBackBtn.addEventListener("click", () => {
      if (typeof (window as any).currentWindowIndex !== "undefined") {
        (window as any).currentWindowIndex = 1;
        if (typeof (window as any).refresh === "function") {
          (window as any).refresh();
        }
      }
    });
  }

  const chatMenuToggle = document.getElementById("chat-menu-toggle");
  let chatDropdown: HTMLElement | null = null;

  // Create dropdown portal element
  const createDropdownPortal = (): HTMLElement => {
    const dropdown = document.createElement('div');
    dropdown.id = 'chat-dropdown-portal';
    dropdown.className = 'modern-chat-dropdown';
    dropdown.innerHTML = `
      <div class="dropdown-content">
        <div class="dropdown-item" data-action="back">
          <svg class="dropdown-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="m15 18-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="dropdown-label">Back</span>
        </div>
        <div class="dropdown-divider"></div>
        <div class="dropdown-item" data-action="profile">
          <svg class="dropdown-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
          </svg>
          <span class="dropdown-label">View Profile</span>
        </div>
        <div class="dropdown-item" data-action="clear">
          <svg class="dropdown-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M3 6h18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <line x1="10" y1="11" x2="10" y2="17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <line x1="14" y1="11" x2="14" y2="17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <span class="dropdown-label">Clear Chat</span>
        </div>
        <div class="dropdown-divider"></div>
        <div class="dropdown-item danger" data-action="block">
          <svg class="dropdown-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
            <path d="m4.9 4.9 14.2 14.2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="dropdown-label">Block User</span>
        </div>
      </div>
    `;
    return dropdown;
  };

  // Show dropdown function
  const showDropdown = () => {
    // Remove existing dropdown if present
    const existingDropdown = document.getElementById('chat-dropdown-portal');
    if (existingDropdown) {
      existingDropdown.remove();
    }

    // Create new dropdown and append to body
    chatDropdown = createDropdownPortal();
    document.body.appendChild(chatDropdown);
    chatDropdown.classList.add('show');
  };

  // Hide dropdown function
  const hideDropdown = () => {
    if (chatDropdown) {
      chatDropdown.classList.remove('show');
      setTimeout(() => {
        if (chatDropdown && chatDropdown.parentNode) {
          chatDropdown.parentNode.removeChild(chatDropdown);
        }
        chatDropdown = null;
      }, 300); // Wait for animation to complete
    }
  };

  if (chatMenuToggle) {
    chatMenuToggle.addEventListener("click", (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (chatDropdown && chatDropdown.classList.contains('show')) {
        hideDropdown();
      } else {
        showDropdown();
      }
    });

    // Global click handler for closing dropdown
    document.addEventListener("click", (e: MouseEvent) => {
      if (chatDropdown && chatDropdown.classList.contains('show')) {
        const target = e.target as HTMLElement;
        const dropdownContent = target.closest('.dropdown-content') as HTMLElement;
        
        // If clicking outside dropdown content or on menu toggle, close dropdown
        if (!dropdownContent || chatMenuToggle.contains(target)) {
          hideDropdown();
        }
      }
    });

    // Global event delegation for dropdown actions
    document.addEventListener("click", (e: MouseEvent) => {
      if (chatDropdown && chatDropdown.classList.contains('show')) {
        const target = e.target as HTMLElement;
        const dropdownItem = target.closest('[data-action]') as HTMLElement;
        
        if (dropdownItem && chatDropdown.contains(dropdownItem)) {
          const action = dropdownItem.getAttribute('data-action');
          e.preventDefault();
          e.stopPropagation();
          
          switch (action) {
            case 'back':
              goBackToContacts();
              break;
            case 'profile':
              // Handle profile view
              console.log('View profile clicked');
              break;
            case 'clear':
              // Handle clear chat
              if (messagesContainer) {
                messagesContainer.innerHTML = '';
              }
              console.log('Clear chat clicked');
              break;
            case 'block':
              // Handle block user
              console.log('Block user clicked');
              break;
          }
          
          hideDropdown();
        }
      }
    });
  }

  const messageInput = document.getElementById(
    "chat-message-input",
  ) as HTMLTextAreaElement | null;
  const sendBtn = document.getElementById("chat-send-btn");
  const messagesContainer = document.getElementById("chat-messages");

  // Auto-resize textarea function
  const resizeTextarea = (): void => {
    if (messageInput) {
      // Reset height to auto to get accurate scrollHeight
      messageInput.style.height = 'auto';
      
      // Check if input is empty and reset to minimum if so
      if (!messageInput.value.trim()) {
        messageInput.style.height = '20px';
        const container = messageInput.parentElement;
        if (container) {
          container.style.height = '44px'; // Reset to original min-height
        }
        return;
      }
      
      // Get the actual content height
      const scrollHeight = messageInput.scrollHeight;
      
      // Set minimum height based on single line (around 24px) and max height
      const minHeight = 20;
      const maxHeight = 100;
      const newHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight);
      
      messageInput.style.height = newHeight + 'px';
      
      // Update container height to match with padding
      const container = messageInput.parentElement;
      if (container) {
        // Container needs extra padding space
        const containerMinHeight = 44;
        const containerMaxHeight = 120;
        const containerHeight = Math.min(Math.max(newHeight + 20, containerMinHeight), containerMaxHeight);
        container.style.height = containerHeight + 'px';
      }
    }
  };

  // Send message function
  const sendMessage = async (): Promise<void> => {
    if (!messageInput || !messagesContainer) return;
    
    const messageText = messageInput.value.trim();
    if (messageText) {
      const messageDiv = document.createElement("div");
      messageDiv.className = "message sent";

      const messageContent = document.createElement("div");
      messageContent.className = "message-content";
      messageContent.textContent = messageText;

      const messageTime = document.createElement("div");
      messageTime.className = "message-time";
      messageTime.textContent = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      messageDiv.appendChild(messageContent);
      messageDiv.appendChild(messageTime);
      messagesContainer.appendChild(messageDiv);

      messageInput.value = "";
      resizeTextarea(); // Reset textarea height
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    const bodyJson = {
      PhraseList: phraseList,
      Data: data,
      profileID: (data as any).id, // adjust this if you define `data` type
      senderID: currentChatBuddyPublicId,
      message: messageText,
    };
/*
    const response = await fetch("/sendMessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyJson),
    });

    const results = await response.json();

    if (results._res === "success") {
      // Optional: handle success case
    }
    */
  };

  if (messageInput && sendBtn && messagesContainer) {
    sendBtn.addEventListener("click", sendMessage);

    // Auto-resize on input and paste
    messageInput.addEventListener("input", resizeTextarea);
    messageInput.addEventListener("paste", () => {
      // Delay resize to allow paste content to be processed
      setTimeout(resizeTextarea, 10);
    });
    
    // Also resize on keyup to handle deletions properly
    messageInput.addEventListener("keyup", resizeTextarea);
    
    // Handle Enter key (send on Enter, new line on Shift+Enter)
    messageInput.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
    
    // Initial resize and focus handling
    resizeTextarea();
    
    // Reset size when input is cleared or on focus
    messageInput.addEventListener("focus", resizeTextarea);
  }
});

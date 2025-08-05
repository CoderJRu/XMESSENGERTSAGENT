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

  // Function to go back to contacts
  const goBackToContacts = (): void => {
    console.log("Going back to contact list");
    if (contactListView && chatInterface) {
      contactListView.style.display = "block";
      chatInterface.style.display = "none";
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
  const chatDropdown = document.getElementById("chat-dropdown");
  const mobileBackOption = document.getElementById("mobile-back-option");

  if (chatMenuToggle && chatDropdown) {
    chatMenuToggle.addEventListener("click", (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      chatDropdown.classList.toggle("show");
    });

    document.addEventListener("click", (e: MouseEvent) => {
      if (
        !chatMenuToggle.contains(e.target as Node) &&
        !chatDropdown.contains(e.target as Node)
      ) {
        chatDropdown.classList.remove("show");
      }
    });
  }

  if (mobileBackOption) {
    mobileBackOption.addEventListener("click", (e: MouseEvent) => {
      e.preventDefault();
      console.log("Mobile back option clicked");
      if (chatDropdown) chatDropdown.classList.remove("show");
      if (contactListView && chatInterface) {
        contactListView.style.display = "block";
        chatInterface.style.display = "none";
      }
    });
  }

  const messageInput = document.getElementById(
    "chat-message-input",
  ) as HTMLTextAreaElement | null;
  const sendBtn = document.getElementById("chat-send-btn");
  const messagesContainer = document.getElementById("chat-messages");

  // WhatsApp-style auto-resize textarea function
  const resizeTextarea = (): void => {
    if (messageInput) {
      // Reset height to get accurate scrollHeight
      messageInput.style.height = 'auto';
      
      // Get the actual content height
      const scrollHeight = messageInput.scrollHeight;
      
      // WhatsApp-style sizing: 20px base + content, max 100px
      const minHeight = 20;
      const maxHeight = 100;
      const newHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight);
      
      messageInput.style.height = newHeight + 'px';
      
      // Update the input wrapper container
      const wrapper = messageInput.closest('.message-input-wrapper');
      if (wrapper) {
        const wrapperHeight = Math.min(Math.max(newHeight + 14, 34), 114);
        (wrapper as HTMLElement).style.minHeight = wrapperHeight + 'px';
      }
      
      // Update the main input section
      const inputSection = messageInput.closest('.input-section');
      if (inputSection) {
        const sectionHeight = Math.min(Math.max(newHeight + 24, 44), 124);
        (inputSection as HTMLElement).style.minHeight = sectionHeight + 'px';
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

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
      
      // Calculate button position
      const buttonRect = chatMenuToggle.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const dropdownWidth = 160; // min-width from CSS
      
      // Position dropdown to avoid overlap
      let rightPosition = viewportWidth - buttonRect.right + 8;
      let topPosition = buttonRect.bottom + 8;
      
      // Ensure dropdown doesn't go off-screen
      if (rightPosition + dropdownWidth > viewportWidth) {
        rightPosition = viewportWidth - dropdownWidth - 8;
      }
      
      // Apply calculated position
      chatDropdown.style.right = rightPosition + 'px';
      chatDropdown.style.top = topPosition + 'px';
      
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
  ) as HTMLInputElement | null;
  const sendBtn = document.getElementById("chat-send-btn");
  const messagesContainer = document.getElementById("chat-messages");

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

    messageInput.addEventListener("keypress", (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        sendMessage();
      }
    });
  }
});

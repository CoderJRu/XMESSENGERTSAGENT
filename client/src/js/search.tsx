import { currentUserPublicKey } from "./chat";
import { publicKey } from "./connectWallet";

interface UserData {
  public_key: string;
  last_seen?: string;
}

declare global {
  interface Window {
    setCurrentUserPublicKey: (key: string) => void;
  }
}

const searchBar = document.getElementById("seacrh-bar-id");
var uiContainer = [];
//
const buildUserContainer = async (
  address: any,
  last_seen: any,
  last_msg: any,
) => {
  //build a container for each similar user
  //create upper limit dash holder
  //reset the containers
  uiContainer = [];
  var upperDash = document.createElement("div");
  upperDash.classList.add("dsh-items-upper");
  upperDash.classList.add("offsetmod");
  //create contact item
  var contactItem = document.createElement("div");
  contactItem.classList.add("names-disp");
  contactItem.classList.add("contact-item");
  //add contactItem to upperDash as a child
  upperDash.appendChild(contactItem);
  //
  var namesdisp_ul = document.createElement("ul");
  namesdisp_ul.classList.add("namesdisp-ul");
  contactItem.appendChild(namesdisp_ul);
  var userimg_disp = document.createElement("img");
  userimg_disp.classList.add("userimg-disp");
  namesdisp_ul.appendChild(userimg_disp);
  //
  var screen_li = document.createElement("div");
  namesdisp_ul.appendChild(screen_li);
  var disp_items = document.createElement("li");
  screen_li.appendChild(disp_items);
  var disp_items2 = document.createElement("li");
  screen_li.appendChild(disp_items2);
  //
  var msg_timer_text = document.createElement("p");
  //child this to the name-disp component
  contactItem.appendChild(msg_timer_text);
  uiContainer.push(upperDash);
  //
};
//

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.querySelector<HTMLInputElement>(".search-msgs");
  const contactListContainer = document.querySelector<HTMLElement>(
    ".offsetmod.dsh-items-upper",
  );
  const chatInterface = document.getElementById(
    "chat-interface",
  ) as HTMLElement | null;
  const contactListView = document.getElementById(
    "contact-list-view",
  ) as HTMLElement | null;

  let searchTimeout: number | undefined;

  async function searchUsers(query: string): Promise<UserData[]> {
    try {
      const response = await fetch("/api/search-users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) throw new Error("Search failed");
      return await response.json();
    } catch (error) {
      console.error("Search error:", error);
      return [];
    }
  }

  async function updateChatBuddy(
    targetPublicKey: string,
  ): Promise<unknown | null> {
    try {
      const currentUser = publicKey || currentUserPublicKey;
      if (!currentUser) {
        console.error("No current user public key available");
        return null;
      }

      const response = await fetch("/api/update-chat-buddy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentUser,
          targetUser: targetPublicKey,
        }),
      });

      if (!response.ok) throw new Error("Failed to update chat buddy");
      return await response.json();
    } catch (error) {
      console.error("Update chat buddy error:", error);
      return null;
    }
  }

  function createContactItem(userData: UserData): HTMLElement {
    const contactDiv = document.createElement("div");
    contactDiv.className = "names-disp contact-item";
    contactDiv.setAttribute("data-username", userData.public_key);
    contactDiv.setAttribute("data-lastseen", userData.last_seen || "Never");

    const displayKey =
      userData.public_key.length > 8
        ? `${userData.public_key.slice(0, 4)}...${userData.public_key.slice(-4)}`
        : userData.public_key;

    let timeDisplay = "Now";
    if (
      userData.last_seen &&
      userData.last_seen !== "Never online" &&
      userData.last_seen !== "Never"
    ) {
      const now = new Date();
      timeDisplay = now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    }

    contactDiv.innerHTML = `
      <ul class="namesdisp-ul">
        <img class="userimg-disp" />
        <div class="screen-li">
          <li class="disp-items">${displayKey}</li>
          <li class="disp-items">Ready to start chatting</li>
        </div>
      </ul>
      <p class="msg-timer-text">${timeDisplay}</p>
    `;

    contactDiv.addEventListener("click", async () => {
      console.log("Contact clicked:", userData.public_key);
      await updateChatBuddy(userData.public_key);

      const chatUsername = document.getElementById("chat-username");
      const chatLastSeen = document.getElementById("chat-last-seen");

      if (chatUsername) chatUsername.textContent = displayKey;
      if (chatLastSeen)
        chatLastSeen.textContent = userData.last_seen || "Never";

      if (contactListView) contactListView.style.display = "none";
      if (chatInterface) chatInterface.style.display = "flex";
    });

    return contactDiv;
  }

  function clearSearchResults(): void {
    if (!contactListContainer) return;
    const dynamicContacts = contactListContainer.querySelectorAll(
      ".contact-item.search-result",
    );
    dynamicContacts.forEach((contact) => contact.remove());
  }

  function displaySearchResults(users: UserData[]): void {
    clearSearchResults();

    if (!contactListContainer) return;

    if (users.length === 0) {
      // Don't show "No users found" message, just keep it clean
      return;
    }

    users.forEach((user) => {
      const contactItem = createContactItem(user);
      contactItem.classList.add("search-result");
      contactListContainer.appendChild(contactItem);
    });
  }

  function performSearch(query: string): void {
    if (!query || query.length < 3) {
      clearSearchResults();
      return;
    }

    if (searchTimeout !== undefined) {
      clearTimeout(searchTimeout);
    }

    searchTimeout = window.setTimeout(async () => {
      console.log("Searching for:", query);
      const results = await searchUsers(query);
      displaySearchResults(results);
    }, 300);
  }

  if (searchInput) {
    searchInput.addEventListener("input", (e: Event) => {
      const target = e.target as HTMLInputElement;
      const query = target.value.trim();
      performSearch(query);
    });

    searchInput.addEventListener("keyup", (e: KeyboardEvent) => {
      const target = e.target as HTMLInputElement;
      if (e.key === "Escape" || !target.value) {
        clearSearchResults();
      }
    });
  }

  // Make available globally
  window.setCurrentUserPublicKey = (pk: string) => {
    (globalThis as any).currentUserPublicKey = pk;
    console.log("Current user public key set:", pk);
  };
});

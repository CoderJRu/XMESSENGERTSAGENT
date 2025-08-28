import React, { useEffect, useState, useRef } from "react";
import { createRoot } from "react-dom/client";
import { isConnected, data, updateUserData } from "./connectWallet";
import { getBalances } from "../utils/balances";
import { usePrivy, useWallets } from "@privy-io/react-auth";

// Profile state
let currentProfileImage = "src/img/person-img.png";
let currentUsername = "";
var currentConnectedAddress: string = ""; 
// Create the profile popup container
const profilePopup = document.createElement("div");
profilePopup.className = "profile-popup";
document.body.appendChild(profilePopup);

// Create React root for the popup
const root = createRoot(profilePopup);

// React Profile Settings Component
interface ProfileSettingsProps {
  onClose: () => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ onClose }) => {
  // Privy authentication hooks
  const { user, login, logout, ready, authenticated } = usePrivy();
  const { wallets } = useWallets();
  
  // Get connected wallet address
  const address = wallets.length > 0 ? wallets[0].address : null;
  const [profileImage, setProfileImage] = useState(currentProfileImage);
  const [username, setUsername] = useState(currentUsername);
  const [copying, setCopying] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  console.log("Opened Profile Settings and connected eth address is ", address);
  console.log("Privy ready:", ready, "authenticated:", authenticated, "user:", user);
  
  // Update global connected address
  useEffect(() => {
    if (address) {
      console.log("🔑 ProfileSettings address updated:", address);
      currentConnectedAddress = address;
    }
  }, [address]);

  const handleImageUpload = (file: File): void => {
    // Validate file size (3MB max)
    const maxSize = 3 * 1024 * 1024; // 3MB in bytes
    if (file.size > maxSize) {
      alert("Image size must be less than 3MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Create canvas to resize image
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Set canvas size to 1024x1024
        canvas.width = 1024;
        canvas.height = 1024;

        // Draw and resize image
        ctx?.drawImage(img, 0, 0, 1024, 1024);

        // Get resized image as data URL
        const newImage = canvas.toDataURL("image/jpeg", 0.8);
        currentProfileImage = newImage;
        setProfileImage(newImage);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const copyWalletAddress = (address: string, type: string): void => {
    navigator.clipboard
      .writeText(address)
      .then(() => {
        setCopying(type);
        setTimeout(() => setCopying(null), 2000);
      })
      .catch(() => {
        alert("Failed to copy address");
      });
  };

  const saveProfile = (): void => {
    const newUsername = username.trim();
    if (newUsername && newUsername !== currentUsername) {
      currentUsername = newUsername;
      updateUserData(newUsername, data.publicKey);
    }
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="profile-content" onClick={(e) => e.stopPropagation()}>
      <div className="profile-header">
        <h3>Profile Settings</h3>
        <div className="auth-status">
          {ready ? (
            authenticated ? (
              <span style={{color: "#4ade80", fontSize: "12px"}}>
                ✓ Connected {address ? `(${address.slice(0,6)}...)` : ""}
              </span>
            ) : (
              <span style={{color: "#f59e0b", fontSize: "12px"}}>
                ⚠ Not authenticated
              </span>
            )
          ) : (
            <span style={{color: "#6b7280", fontSize: "12px"}}>
              Loading...
            </span>
          )}
        </div>
        <button className="close-profile" onClick={onClose}>
          &times;
        </button>
      </div>

      <div className="profile-avatar-section">
        <div
          className="profile-image-container"
          onClick={() => fileInputRef.current?.click()}
        >
          <img src={profileImage} alt="Profile" className="profile-image" />
          <div className="profile-image-overlay">
            <div>
              <div className="upload-icon">📷</div>
              <div className="upload-text">Change Photo</div>
            </div>
          </div>
        </div>
        <input
          type="file"
          className="profile-upload-input"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        <div className="image-upload-note">
          Click to upload image
          <br />
          Max 3MB • 1024×1024px recommended
        </div>
      </div>

      <div className="profile-form">
        <div className="profile-field">
          <label className="profile-label">Username</label>
          <input
            type="text"
            className="profile-input username-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
          />
        </div>

        <div className="wallet-section">
          <div className="wallet-type-label">
            <div className="wallet-type-icon demos-icon">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                <circle cx="12" cy="12" r="10"></circle>
              </svg>
            </div>
            Demos Wallet
          </div>
          <div className="wallet-address-container">
            <div className="wallet-address">
              {data.publicKey || "Not Connected"}
            </div>
            <button
              className="copy-wallet-btn copy-demos-btn"
              onClick={() => copyWalletAddress(data.publicKey || "", "demos")}
              style={{
                background:
                  copying === "demos"
                    ? "rgba(76, 175, 80, 0.4)"
                    : "rgba(76, 175, 80, 0.2)",
              }}
            >
              {copying === "demos" ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

        <div className="wallet-section">
          <div className="wallet-type-label">
            <div className="wallet-type-icon">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                <path d="M11.944 17.97L4.58 13.62L11.943 24L19.31 13.62L11.944 17.97ZM12.056 0L4.69 12.22L12.056 16.57L19.42 12.22L12.056 0Z" />
              </svg>
            </div>
            Ethereum Wallet
          </div>
          <div className="wallet-address-container">
            <div className="wallet-address">
              {address || "Not Connected"}
            </div>
            <button
              className="copy-wallet-btn eth-connect-btn"
              onClick={() => {
                if (address && authenticated) {
                  copyWalletAddress(address, "ethereum");
                } else {
                  console.log("🔵 Starting Privy login...");
                  login();
                }
              }}
              style={{
                background: address
                  ? copying === "ethereum"
                    ? "rgba(76, 175, 80, 0.4)"
                    : "rgba(76, 175, 80, 0.2)"
                  : "rgba(59, 130, 246, 0.2)",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              {address && authenticated ? (
                copying === "ethereum" ? (
                  "Copied!"
                ) : (
                  "Copy"
                )
              ) : (
                <>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M11.944 17.97L4.58 13.62L11.943 24L19.31 13.62L11.944 17.97ZM12.056 0L4.69 12.22L12.056 16.57L19.42 12.22L12.056 0Z" />
                  </svg>
                  Connect
                </>
              )}
            </button>
          </div>
        </div>

        <div className="profile-actions">
          <button
            className="profile-btn profile-btn-primary"
            onClick={saveProfile}
          >
            Save Changes
          </button>
          {authenticated && (
            <button
              className="profile-btn profile-btn-warning"
              onClick={() => {
                logout();
                console.log("🔴 User logged out");
                onClose();
              }}
              style={{
                background: "rgba(239, 68, 68, 0.2)",
                color: "#ef4444",
                border: "1px solid rgba(239, 68, 68, 0.3)"
              }}
            >
              Logout
            </button>
          )}
          <button
            className="profile-btn profile-btn-secondary"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// Show the profile settings popup
function showProfileSettings(): void {
  console.log("Showing profile settings, connected:", isConnected);

  if (!isConnected) {
    alert("Please connect your wallet to view profile settings");
    return;
  }

  // Initialize current values
  currentUsername = data.username || "";

  const hideProfile = () => {
    profilePopup.classList.remove("show");
    setTimeout(() => {
      profilePopup.style.display = "none";
      root.render(<div></div>);
    }, 300);
  };

  // Show the popup container
  profilePopup.style.display = "flex";

  // Render the React component
  root.render(<ProfileSettings onClose={hideProfile} />);

  // Add backdrop click handler
  profilePopup.onclick = (event) => {
    if (event.target === profilePopup) {
      hideProfile();
    }
  };

  // Add the show class after a brief delay for animation
  setTimeout(() => {
    profilePopup.classList.add("show");
  }, 10);
}

// Attach event to dropdown trigger
document.addEventListener("DOMContentLoaded", () => {
  const accountDropdown = document.querySelector(
    ".account-drop-down-window",
  ) as HTMLElement | null;
  if (accountDropdown) {
    accountDropdown.addEventListener("click", () => {
      showProfileSettings();
    });
  }
});

// Listen for custom profile event from mobile menu
document.addEventListener("showProfileSettings", () => {
  showProfileSettings();
});

export default ProfileSettings;

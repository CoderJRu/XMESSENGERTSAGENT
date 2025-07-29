import { isConnected, data, updateUserData } from './connectWallet';

// Create and style the profile popup
const profilePopup = document.createElement('div');
profilePopup.className = 'profile-popup';
document.body.appendChild(profilePopup);

// Profile state
let currentProfileImage = 'src/img/person-img.png';
let currentUsername = '';

// Image upload functionality
function handleImageUpload(file: File): void {
  // Validate file size (3MB max)
  const maxSize = 3 * 1024 * 1024; // 3MB in bytes
  if (file.size > maxSize) {
    alert('Image size must be less than 3MB');
    return;
  }

  // Validate file type
  if (!file.type.startsWith('image/')) {
    alert('Please select a valid image file');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    if (!e.target?.result) {
      alert('Failed to read image file');
      return;
    }

    const img = new Image();
    img.onload = () => {
      try {
        // Create canvas to resize image
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          alert('Canvas not supported on this device');
          return;
        }
        
        // Set canvas size to 1024x1024
        canvas.width = 1024;
        canvas.height = 1024;
        
        // Draw and resize image
        ctx.drawImage(img, 0, 0, 1024, 1024);
        
        // Get resized image as data URL
        currentProfileImage = canvas.toDataURL('image/jpeg', 0.8);
        
        // Update the displayed image
        const profileImg = document.querySelector('.profile-image') as HTMLImageElement;
        if (profileImg) {
          profileImg.src = currentProfileImage;
        }
      } catch (error) {
        console.error('Error processing image:', error);
        alert('Failed to process image. Please try a different image.');
      }
    };
    
    img.onerror = () => {
      alert('Failed to load image. Please try a different file.');
    };
    
    img.src = e.target.result as string;
  };
  
  reader.onerror = () => {
    alert('Failed to read file. Please try again.');
  };
  
  reader.readAsDataURL(file);
}

// Copy public key to clipboard
function copyPublicKey(): void {
  const publicKey = data.publicKey || '';
  
  // Check if clipboard API is available
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(publicKey).then(() => {
      showCopySuccess();
    }).catch(() => {
      fallbackCopy(publicKey);
    });
  } else {
    fallbackCopy(publicKey);
  }
}

// Fallback copy method for older browsers/mobile
function fallbackCopy(text: string): void {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.opacity = '0';
  document.body.appendChild(textArea);
  textArea.select();
  
  try {
    document.execCommand('copy');
    showCopySuccess();
  } catch (err) {
    alert('Failed to copy public key. Please copy manually.');
  }
  
  document.body.removeChild(textArea);
}

// Show copy success feedback
function showCopySuccess(): void {
  const copyBtn = document.querySelector('.copy-key-btn') as HTMLElement;
  if (copyBtn) {
    const originalText = copyBtn.textContent;
    copyBtn.textContent = 'Copied!';
    copyBtn.style.background = 'rgba(76, 175, 80, 0.4)';
    setTimeout(() => {
      copyBtn.textContent = originalText;
      copyBtn.style.background = 'rgba(76, 175, 80, 0.2)';
    }, 2000);
  }
}

// Save profile changes
function saveProfile(): void {
  const usernameInput = document.querySelector('.username-input') as HTMLInputElement;
  if (usernameInput) {
    const newUsername = usernameInput.value.trim();
    if (newUsername && newUsername !== currentUsername) {
      currentUsername = newUsername;
      updateUserData(newUsername, data.publicKey);
      
      // Show success feedback
      const saveBtn = document.querySelector('.profile-btn-primary') as HTMLElement;
      if (saveBtn) {
        const originalText = saveBtn.textContent;
        saveBtn.textContent = 'Saved!';
        saveBtn.style.background = 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';
        setTimeout(() => {
          saveBtn.textContent = originalText;
        }, 2000);
      }
    }
  }
}

// Show the profile settings popup
function showProfileSettings(): void {
  console.log("Showing profile settings, connected:", isConnected);

  if (!isConnected) {
    alert("Please connect your wallet to view profile settings");
    return;
  }

  // Initialize current values
  currentUsername = data.username || '';
  
  profilePopup.innerHTML = `
    <div class="profile-content">
      <div class="profile-header">
        <h3>Profile Settings</h3>
        <button class="close-profile">&times;</button>
      </div>
      
      <div class="profile-avatar-section">
        <div class="profile-image-container">
          <img src="${currentProfileImage}" alt="Profile" class="profile-image">
          <div class="profile-image-overlay">
            <div>
              <div class="upload-icon">📷</div>
              <div class="upload-text">Change Photo</div>
            </div>
          </div>
        </div>
        <input type="file" class="profile-upload-input" accept="image/*">
        <div class="image-upload-note">
          Click to upload image<br>
          Max 3MB • 1024×1024px recommended
        </div>
      </div>

      <div class="profile-form">
        <div class="profile-field">
          <label class="profile-label">Username</label>
          <input type="text" class="profile-input username-input" value="${currentUsername}" placeholder="Enter your username">
        </div>

        <div class="profile-field">
          <label class="profile-label">Public Key</label>
          <div class="public-key-field">
            <div class="public-key-display">${data.publicKey || 'Not Connected'}</div>
            <button class="copy-key-btn">Copy</button>
          </div>
        </div>

        <div class="profile-actions">
          <button class="profile-btn profile-btn-primary">Save Changes</button>
          <button class="profile-btn profile-btn-secondary">Cancel</button>
        </div>
      </div>
    </div>
  `;

  profilePopup.style.display = 'flex';
  setTimeout(() => profilePopup.classList.add('show'), 10);

  // Event listeners
  const closeButton = profilePopup.querySelector('.close-profile') as HTMLElement;
  const cancelButton = profilePopup.querySelector('.profile-btn-secondary') as HTMLElement;
  const saveButton = profilePopup.querySelector('.profile-btn-primary') as HTMLElement;
  const imageContainer = profilePopup.querySelector('.profile-image-container') as HTMLElement;
  const fileInput = profilePopup.querySelector('.profile-upload-input') as HTMLInputElement;
  const copyButton = profilePopup.querySelector('.copy-key-btn') as HTMLElement;

  const hideProfile = () => {
    profilePopup.classList.remove('show');
    setTimeout(() => {
      profilePopup.style.display = 'none';
    }, 300);
  };

  closeButton?.addEventListener('click', hideProfile);
  cancelButton?.addEventListener('click', hideProfile);
  saveButton?.addEventListener('click', saveProfile);
  copyButton?.addEventListener('click', copyPublicKey);

  imageContainer?.addEventListener('click', () => {
    fileInput?.click();
  });

  fileInput?.addEventListener('change', (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  });

  profilePopup.addEventListener('click', (event: MouseEvent) => {
    if (event.target === profilePopup) {
      hideProfile();
    }
  });
}

// Attach event to dropdown trigger
document.addEventListener('DOMContentLoaded', () => {
  const accountDropdown = document.querySelector('.account-drop-down-window') as HTMLElement | null;
  if (accountDropdown) {
    accountDropdown.addEventListener('click', () => {
      showProfileSettings();
    });
  }
});

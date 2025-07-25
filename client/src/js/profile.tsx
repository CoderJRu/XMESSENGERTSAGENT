import { isConnected, data } from './connectWallet';

// Create and style the profile popup
const profilePopup = document.createElement('div');
profilePopup.className = 'profile-popup';
document.body.appendChild(profilePopup);

// Show the profile settings popup
function showProfileSettings(): void {
  console.log("Showing profile settings, connected:", isConnected);

  if (!isConnected) {
    alert("Please connect your wallet to view profile settings");
    return;
  }

  profilePopup.innerHTML = `
    <div class="profile-content">
      <div class="profile-header">
        <h3>Profile Settings</h3>
        <span class="close-profile">&times;</span>
      </div>
      <div class="profile-details">
        <div class="profile-image-container">
          <img src="img/person-img.png" alt="Profile" class="profile-image">
        </div>
        <div class="profile-info">
          <p><strong>Username:</strong> <span class="username">${data.username || 'Not Set'}</span></p>
          <p class="address"><strong>Public Key:</strong> <span class="public-key">${data.publicKey || 'Not Connected'}</span></p>
        </div>
      </div>
    </div>
  `;

  profilePopup.style.display = 'flex';

  const closeButton = profilePopup.querySelector('.close-profile') as HTMLElement | null;
  if (closeButton) {
    closeButton.addEventListener('click', () => {
      profilePopup.style.display = 'none';
    });
  }

  profilePopup.addEventListener('click', (event: MouseEvent) => {
    if (event.target === profilePopup) {
      profilePopup.style.display = 'none';
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

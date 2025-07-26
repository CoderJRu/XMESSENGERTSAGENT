import { useEffect } from 'react';

const processTest = import.meta.env.VITE_SUPABASE_URL;
console.log("processTest is ", processTest);

export default function App() {
  useEffect(() => {
    // Import your scripts after the component mounts and DOM is ready
    const loadScripts = async () => {
      try {
        // Import your modules
        await import('./js/connectWallet');
        await import('./js/harmburger');
        await import('./js/windowNav');
        await import('./js/loading');
      } catch (error) {
        console.warn('Some scripts failed to load:', error);
      }
    };

    loadScripts();
  }, []);

  return (
    <>
      <section className="desktop-blocker">
        <h2>Figma design not avialable</h2>
      </section>

      <section className="home-contents">
        <div className="home-div">
           <div className="home-div-content"></div>
        </div>

        <div hidden id="grey-background-id" className="greyedBackground">
        <div className="create-wallet-section">
          <p className="greyedBackground-header">Create Wallet</p>
          <div className="phrase-div grid">
            <div className="grid-item" ><p className="phrase-para">cloth</p></div>
            <div className="grid-item" ><p className="phrase-para">table</p></div>
            <div className="grid-item" ><p className="phrase-para">horse</p></div>
            <div className="grid-item" ><p className="phrase-para">clown</p></div>
            <div className="grid-item" ><p className="phrase-para">cup</p></div>
            <div className="grid-item" ><p className="phrase-para">pencil</p></div>
            <div className="grid-item" ><p className="phrase-para">motor</p></div>
            <div className="grid-item" ><p className="phrase-para">house</p></div>
            <div className="grid-item" ><p className="phrase-para">roof</p></div>
            <div className="grid-item" ><p className="phrase-para">marble</p></div>
            <div className="grid-item" ><p className="phrase-para">ripple</p></div>
            <div className="grid-item" ><p className="phrase-para">effect</p></div>
          </div>
          <p className="mid-para">keep this phrase safe as this would be required to retrieve your accounts</p>
          <div className="button-group-0">
            <button id="create-wallet-button-id" className="connect-wallet">Create Account</button>
            <button id="cancel-wallet-button-id" className="connect-wallet">Cancel</button>
          </div>
        </div>
        </div>

        <div hidden id="grey-background-id-connect" className="greyedBackground">
          <div className="create-wallet-section">
            <p className="greyedBackground-header">Connect Wallet</p>
            <div className="phrase-div">
              <textarea className="phrase-input" placeholder="Enter all 12 recovery phrases separated by spaces"></textarea>
            </div>
            <p className="mid-para">input the phrases accurately and orderly to retrieve your accounts</p>
            <div className="button-group-0">
              <button id="connect-wallet-button-id" className="connect-wallet">Connect Account</button>
              <button id="cancel-connect-wallet-button-id" className="connect-wallet">Cancel</button>
            </div>
          </div>
        </div>

        <div className="home-content-group">
         <img className="union" src="src/img/Union.png" /> 
          <h1 className="xm-para">XMESSENGER</h1>
          <p className="sig-para">By CruxDecussata</p>
          <p className="connect-para">Connect your wallet to continue.</p>
          <button id="connect-button-id" className="connect-wallet">Connect Wallet</button>
           <button id="create-button-id" className="create-wallet">Create Wallet</button>
        </div>
      </section>

      {/* Dashboard Frame */}
      <section className="dashboard-plane">
        <div className="dsh-items">
          <div className="dash-parent-div">
             <p className="wel-xchain-para0">Welcome to</p>
             <p className="wel-xchain-para1">XCHAIN</p>
           </div>
          <hr className="hori" />
          <div className="dash-parent-div1">
             <p className="rewards-para">Rewards</p>
             <p className="rewards-val-para">$10k</p>
             <div className="pending-rewards-div">
                <p className="pending-rewards-para">Pending rewards • $500</p>
                <p className="claim-para">Claim</p>
             </div>
           </div>
           <hr className="hori" />

           {/* Send and Swap Section - Side by Side */}
           <div className="dash-parent-div1">
             <div className="dual-section-container">
               {/* Send Section */}
               <div className="dual-section-left">
                 <p className="rewards-para">Send</p>
                 <div className="dashboard-stats">
                   <div className="stat-item">
                     <p className="stat-label">Total Transactions:</p>
                     <p className="stat-value">2.49k</p>
                   </div>
                   <div className="stat-item">
                     <p className="stat-label">24hr Volume:</p>
                     <p className="stat-value">$19k</p>
                   </div>
                   <div className="stat-item">
                     <p className="stat-label">Total Amount:</p>
                     <p className="stat-value">$10k</p>
                   </div>
                 </div>
               </div>

               {/* Vertical Divider */}
               <div className="vertical-divider"></div>

               {/* Swap Section */}
               <div className="dual-section-right">
                 <p className="rewards-para">Swap</p>
                 <div className="dashboard-stats">
                   <div className="stat-item">
                     <p className="stat-label">Total Transactions:</p>
                     <p className="stat-value">2.48k</p>
                   </div>
                   <div className="stat-item">
                     <p className="stat-label">24hr Volume:</p>
                     <p className="stat-value">$19k</p>
                   </div>
                   <div className="stat-item">
                     <p className="stat-label">Total Amount:</p>
                     <p className="stat-value">$10k</p>
                   </div>
                 </div>
               </div>
             </div>
           </div>
           <hr className="hori" />

           {/* Tokens and NFTs Section - Side by Side */}
           <div className="dash-parent-div1">
             <div className="dual-section-container">
               {/* Tokens Section */}
               <div className="dual-section-left">
                 <p className="rewards-para">Total Tokens Owned</p>
                 <p className="rewards-val-para">13.5k</p>
               </div>

               {/* Vertical Divider */}
               <div className="vertical-divider"></div>

               {/* NFTs Section */}
               <div className="dual-section-right">
                 <p className="rewards-para">Total NFTs Owned</p>
                 <p className="rewards-val-para">50</p>
               </div>
             </div>
           </div>
           <hr className="hori" />

           <div className="footer-boxes-div">
              <div className="sand-box">
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                <path d="M4.1665 19.25V4.75L21.378 12L4.1665 19.25ZM5.6665 17L17.5165 12L5.6665 7V10.6923L11.0895 12L5.6665 13.3077V17Z" fill="white"/>
                </svg>
                <p className="sand-box-txt">Send</p>
              </div>
              <div className="sand-box">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M8.404 12.6538V5.373L5.56925 8.20775L4.5 7.15375L9.15375 2.5L13.8077 7.15375L12.7385 8.20775L9.90375 5.373V12.6538H8.404ZM14.8365 21.5L10.1828 16.8462L11.252 15.7923L14.0865 18.627V11.3463H15.5865V18.627L18.4212 15.7923L19.4902 16.8462L14.8365 21.5Z" fill="white"/>
                </svg>
                <p className="sand-box-txt">Swap</p>
              </div>
              <div className="sand-box">
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                <path d="M2.83301 21.0385V4.30775C2.83301 3.80258 3.00801 3.375 3.35801 3.025C3.70801 2.675 4.13559 2.5 4.64076 2.5H20.0253C20.5304 2.5 20.958 2.675 21.308 3.025C21.658 3.375 21.833 3.80258 21.833 4.30775V15.6923C21.833 16.1974 21.658 16.625 21.308 16.975C20.958 17.325 20.5304 17.5 20.0253 17.5H6.37151L2.83301 21.0385ZM5.73301 16H20.0253C20.1023 16 20.1728 15.9679 20.2368 15.9038C20.3009 15.8398 20.333 15.7692 20.333 15.6923V4.30775C20.333 4.23075 20.3009 4.16025 20.2368 4.09625C20.1728 4.03208 20.1023 4 20.0253 4H4.64076C4.56376 4 4.49326 4.03208 4.42926 4.09625C4.36509 4.16025 4.33301 4.23075 4.33301 4.30775V17.3848L5.73301 16Z" fill="white"/>
                </svg>
                 <p className="sand-box-txt">Message</p>
              </div>
           </div>
        </div>
      </section>  

      {/* Swap and Send Frame */}
      <section className="swap-plane">
        <div id="swap-reg" className="dsh-items-upper">
          {/* Control Header with Toggle and Settings */}
          <div className="control-header">
            <div className="toggle-container">
              <span className="toggle-label">Swap</span>
              <label className="toggle-switch">
                <input type="checkbox" id="swap-send-toggle" />
                <span className="toggle-slider"></span>
              </label>
              <span className="toggle-label">Send</span>
            </div>
            <button className="settings-icon-button">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
            </button>
          </div>

        <div className="dsh-items">
            {/* swap area0 */}
            <section className="swap0">
            <div className="swap-parent-div1">
               <p className="swap-send-info-para">
                 Sell
               </p>
            </div>

            <div className="swap-div-height-mod swap-parent-div1">
               <div className="nodes-flex-div">
                 <div className="swap-parent-div">
                   <p className="sell-buy-value">0</p>
                 </div>
                 <button className="sell-buy-button">
                   <img className="sell-buy-img" src="src/img/Ellipse.png" />
                   ETH
                   <img className="sell-buy-img" src="src/img/down_arrow.png" />
                 </button>
               </div>
            </div>

            <div className="sell-div-height-mod swap-parent-div1">
               <div className="nodes-flex-div">
                 <div className="swap-parent-div">
                   <p className="sell-buy-dollar-value">$0</p>
                 </div>
                 <p className="sell-buy-dollar-balance">Balance: 0</p>
               </div>
                <hr className="hori" />
              <button className="vertswap-button">
                <img src="src/img/swap-vert.png" />
              </button>
            </div>
            </section>
            {/* swap area1 */}
            <section className="swap1">
              <div className="swap-parent-div1">
                 <p className="swap-send-info-para">
                   Buy
                 </p>
              </div>

              <div className="swap-div-height-mod swap-parent-div1">
                 <div className="nodes-flex-div">
                   <div className="swap-parent-div">
                     <p className="sell-buy-value">0</p>
                   </div>
                   <button className="sell-buy-button">
                     <img className="sell-buy-img" src="src/img/Ellipse.png" />
                     USDT
                     <img className="sell-buy-img" src="src/img/down_arrow.png" />
                   </button>
                 </div>
              </div>

              <div className="sell-div-height-mod swap-parent-div1">
                 <div className="nodes-flex-div">
                   <div className="swap-parent-div">
                     <p className="sell-buy-dollar-value">$0</p>
                   </div>
                   <p className="sell-buy-dollar-balance">Balance: 0</p>
                 </div>
              </div>
              </section>
        </div> 
           <button className="swap-button">Swap</button>   
        </div>

         {/* send region */}
        <div hidden id="send-reg" className="dsh-items-upper">
          {/* Control Header with Toggle and Settings */}
          <div className="control-header">
            <div className="toggle-container">
              <span className="toggle-label">Swap</span>
              <label className="toggle-switch">
                <input type="checkbox" id="swap-send-toggle-send" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
              <span className="toggle-label">Send</span>
            </div>
            <button className="settings-icon-button">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
            </button>
          </div>

        <div className="dsh-items">
            {/* send area0 */}
            <section className="swap0">
            <div className="swap-parent-div1">
               <p className="swap-send-info-para">
                 Amount
               </p>
            </div>

            <div className="swap-div-height-mod swap-parent-div1">
               <div className="nodes-flex-div">
                 <div className="swap-parent-div">
                   <p className="sell-buy-value">0</p>
                 </div>
                 <button className="sell-buy-button">
                   <img className="sell-buy-img" src="src/img/Ellipse.png" />
                   ETH
                   <img className="sell-buy-img" src="src/img/down_arrow.png" />
                 </button>
               </div>
            </div>

            <div className="sell-div-height-mod swap-parent-div1">
               <div className="nodes-flex-div">
                 <div className="swap-parent-div">
                   <p className="sell-buy-dollar-value">$0</p>
                 </div>
                 <p className="sell-buy-dollar-balance">Balance: 0</p>
               </div>
                <hr className="hori" />
            </div>
            </section>
        </div> 
           <button className="send-button">Send</button>   
        </div>
      </section>
    </>
  );
}

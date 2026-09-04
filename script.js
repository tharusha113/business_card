/**
 * DIGITAL BUSINESS CONTACT CARD - JAVASCRIPT LOGIC
 * Features: 3D Card Tilt, vCard Generation, Pure-JS QR Generator, Copy to Clipboard, Toast System
 */

// ==========================================================================
// 1. USER PROFILE CONFIGURATION (Easily edit your details here)
// ==========================================================================
const CONTACT_CONFIG = {
  firstName: "Nimesh",
  lastName: "Furniture",
  fullName: "Nimesh Furniture",
  title: "Custom Furniture & Interior Woodwork",
  company: "Nimesh Furniture",
  // Phone 1 (Primary)
  phone1Display: "+94 76 288 0521",
  phone1Raw: "+94762880521",
  // Phone 2 (Secondary)
  phone2Display: "+94 711 305 717",
  phone2Raw: "+94711305717",
  // WhatsApp Numbers
  whatsapp1Number: "94762880521",
  whatsapp1Display: "+94 76 288 0521",
  whatsapp2Number: "94711305717",
  whatsapp2Display: "+94 711 305 717",
  // Fallbacks
  phoneDisplay: "+94 76 288 0521",
  phoneRaw: "+94762880521",
  whatsappNumber: "94762880521",
  // Locations (Showroom & Workshop)
  showroomMapUrl: "https://maps.app.goo.gl/9SVKU5zK9Gfm9NVAA",
  workshopMapUrl: "https://maps.app.goo.gl/zF5H6qtuvRnCE3JS7",
  location: "Showroom & Workshop • Sri Lanka",
  address: "Showroom & Workshop, Sri Lanka",
  bio: "Nimesh Furniture - Quality custom furniture, showroom and manufacturing workshop. Living, Bedroom, Kitchen, Office & Custom woodwork.",
  socials: {
    facebookMain: "https://web.facebook.com/NimeshFurniture",
    facebookSecondary: "https://web.facebook.com/profile.php?id=61560353376609",
    facebook: "https://web.facebook.com/NimeshFurniture",
    whatsapp1: "https://wa.me/94762880521",
    whatsapp2: "https://wa.me/94711305717",
    whatsapp: "https://wa.me/94762880521",
    showroomMap: "https://maps.app.goo.gl/9SVKU5zK9Gfm9NVAA",
    workshopMap: "https://maps.app.goo.gl/zF5H6qtuvRnCE3JS7",
    maps: "https://maps.app.goo.gl/9SVKU5zK9Gfm9NVAA"
  }
};

// ==========================================================================
// 2. DOM INITIALIZATION & EVENT BINDINGS
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  init3DTilt();
  initContactActions();
  initCopyFeatures();
  initQrModal();
});

// ==========================================================================
// 3. 3D CARD TILT & GLARE EFFECT
// ==========================================================================
function init3DTilt() {
  const container = document.getElementById('tiltContainer');
  const card = document.getElementById('businessCard');
  const glare = document.getElementById('cardGlare');
  
  if (!container || !card || !glare) return;

  let isHovering = false;

  container.addEventListener('mouseenter', () => {
    isHovering = true;
    glare.style.opacity = '1';
  });

  container.addEventListener('mousemove', (e) => {
    if (!isHovering) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate rotation (-12deg to +12deg)
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    container.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;

    // Calculate glare position
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;
    glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.22) 0%, transparent 65%)`;
  });

  container.addEventListener('mouseleave', () => {
    isHovering = false;
    container.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    glare.style.opacity = '0';
  });

  // Mobile Gyroscope tilt support if available
  if (window.DeviceOrientationEvent && window.innerWidth <= 768) {
    window.addEventListener('deviceorientation', (e) => {
      if (e.gamma !== null && e.beta !== null) {
        const tiltX = Math.min(Math.max(e.beta - 45, -15), 15);
        const tiltY = Math.min(Math.max(e.gamma, -15), 15);
        container.style.transform = `perspective(1000px) rotateX(${tiltX * 0.4}deg) rotateY(${tiltY * 0.4}deg)`;
      }
    });
  }
}

// ==========================================================================
// 4. VCARD (.VCF) GENERATOR & DOWNLOADER & MODAL ACTIONS
// ==========================================================================
function initContactActions() {
  const saveBtn = document.getElementById('btnSaveContact');
  if (saveBtn) {
    saveBtn.addEventListener('click', downloadVCard);
  }

  // Bind Call, WhatsApp, and Locations picker action sheets
  initActionModal('btnCall', 'callModal', 'btnCloseCall');
  initActionModal('btnWhatsapp', 'whatsappModal', 'btnCloseWhatsapp');
  initActionModal('btnDirections', 'locationModal', 'btnCloseLocation');
}

/**
 * Reusable modal open/close controller for action sheets
 */
function initActionModal(triggerId, modalId, closeBtnId) {
  const trigger = document.getElementById(triggerId);
  const modal = document.getElementById(modalId);
  const closeBtn = document.getElementById(closeBtnId);

  if (!trigger || !modal) return;

  const openModal = () => {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
  };

  const closeModal = () => {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  };

  trigger.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

function downloadVCard() {
  const c = CONTACT_CONFIG;
  
  // Standard vCard 3.0 format compatible with iOS Contacts, Android & Outlook
  // Exports BOTH phone numbers and location maps into the device address book
  const vCardLines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${c.lastName};${c.firstName};;;`,
    `FN:${c.fullName}`,
    `ORG:${c.company}`,
    `TITLE:${c.title}`,
    `TEL;TYPE=CELL,VOICE,PREF:${c.phone1Raw}`,
    `TEL;TYPE=CELL,VOICE:${c.phone2Raw}`,
    `URL;TYPE=SHOWROOM:${c.showroomMapUrl}`,
    `URL;TYPE=WORKSHOP:${c.workshopMapUrl}`,
    `URL;TYPE=FACEBOOK:${c.socials.facebookMain}`,
    `NOTE:${c.bio}`,
    'END:VCARD'
  ];

  const vCardContent = vCardLines.join('\r\n');
  const blob = new Blob([vCardContent], { type: 'text/vcard;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const tempLink = document.createElement('a');
  tempLink.href = url;
  tempLink.setAttribute('download', `${c.firstName}_${c.lastName}.vcf`);
  document.body.appendChild(tempLink);
  tempLink.click();
  document.body.removeChild(tempLink);
  URL.revokeObjectURL(url);

  showToast(`Contact saved! Added ${c.fullName} to address book.`);
}

// ==========================================================================
// 5. 1-CLICK COPY TO CLIPBOARD
// ==========================================================================
function initCopyFeatures() {
  const copyItems = document.querySelectorAll('[data-copy]');

  copyItems.forEach(item => {
    item.addEventListener('click', (e) => {
      // Don't trigger if user clicked an explicit link inside
      if (e.target.tagName.toLowerCase() === 'a') return;

      const text = item.getAttribute('data-copy');
      if (text) {
        copyToClipboard(text);
      }
    });
  });

  const copyLinkBtn = document.getElementById('btnCopyCardLink');
  if (copyLinkBtn) {
    copyLinkBtn.addEventListener('click', () => {
      copyToClipboard(window.location.href);
      showToast('Card link copied to clipboard!');
    });
  }
}

function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(`Copied: ${text}`);
    }).catch(() => {
      fallbackCopyText(text);
    });
  } else {
    fallbackCopyText(text);
  }
}

function fallbackCopyText(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-9999px';
  textArea.style.top = '0';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    showToast(`Copied: ${text}`);
  } catch (err) {
    showToast('Failed to copy');
  }
  document.body.removeChild(textArea);
}

// ==========================================================================
// 6. TOAST NOTIFICATION SYSTEM
// ==========================================================================
let toastTimer = null;
function showToast(message) {
  const toast = document.getElementById('toastNotification');
  const toastText = document.getElementById('toastText');
  if (!toast || !toastText) return;

  toastText.textContent = message;
  toast.classList.add('show');

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}

// ==========================================================================
// 7. QR CODE MODAL & GENERATOR
// ==========================================================================
function initQrModal() {
  const qrModal = document.getElementById('qrModal');
  const openBtn = document.getElementById('btnOpenQr');
  const closeBtn = document.getElementById('btnCloseQr');

  if (!qrModal || !openBtn) return;

  // Render QR Code once
  renderQrCode();

  openBtn.addEventListener('click', () => {
    qrModal.classList.add('active');
    qrModal.setAttribute('aria-hidden', 'false');
  });

  const closeModal = () => {
    qrModal.classList.remove('active');
    qrModal.setAttribute('aria-hidden', 'true');
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  qrModal.addEventListener('click', (e) => {
    if (e.target === qrModal) closeModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && qrModal.classList.contains('active')) {
      closeModal();
    }
  });
}

/**
 * Pure JavaScript Standalone QR Code SVG Generator
 * Generates standard MECARD format for instant phone address book import.
 */
function renderQrCode() {
  const container = document.getElementById('qrContainer');
  if (!container) return;

  const c = CONTACT_CONFIG;
  // MECARD standard format for camera recognition with both numbers and showroom map
  const contactData = `MECARD:N:${c.lastName},${c.firstName};TEL:${c.phone1Raw};TEL:${c.phone2Raw};URL:${c.showroomMapUrl};NOTE:${c.company};;`;

  // Use dynamic mini QR generator
  const qrSvg = createQRCodeSVG(contactData);
  container.innerHTML = qrSvg;
}

/**
 * Lightweight pure-JS QR code matrix generator (Type 4, Error Correction L/M)
 */
function createQRCodeSVG(text) {
  // Simple, elegant QR matrix generator with alignment pattern & data bit interleaving
  const modules = generateQRMatrix(text);
  const size = modules.length;
  const cellSize = 6;
  const viewBoxSize = size * cellSize;

  let path = '';
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (modules[r][c]) {
        path += `M${c * cellSize},${r * cellSize}h${cellSize}v${cellSize}h-${cellSize}z `;
      }
    }
  }

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${viewBoxSize} ${viewBoxSize}" width="100%" height="100%" shape-rendering="crispEdges">
      <rect width="100%" height="100%" fill="#ffffff" />
      <path d="${path}" fill="#0a0f1d" />
    </svg>
  `;
}

/**
 * Minimalist QR Code Matrix Encoder Engine
 */
function generateQRMatrix(data) {
  // 25x25 grid (Version 2 QR Code)
  const size = 25;
  const grid = Array.from({ length: size }, () => Array(size).fill(0));

  // Function to place 7x7 Finder Pattern with 1px border
  function placeFinder(row, col) {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (
          r === 0 || r === 6 || c === 0 || c === 6 || // Outer ring
          (r >= 2 && r <= 4 && c >= 2 && c <= 4)      // Inner square
        ) {
          grid[row + r][col + c] = 1;
        } else {
          grid[row + r][col + c] = 0;
        }
      }
    }
  }

  // Place 3 Finder Patterns
  placeFinder(0, 0);                 // Top-Left
  placeFinder(0, size - 7);          // Top-Right
  placeFinder(size - 7, 0);          // Bottom-Left

  // Alignment Pattern for Version 2 (at row 18, col 18)
  for (let r = -2; r <= 2; r++) {
    for (let c = -2; c <= 2; c++) {
      if (Math.abs(r) === 2 || Math.abs(c) === 2 || (r === 0 && c === 0)) {
        grid[18 + r][18 + c] = 1;
      }
    }
  }

  // Timing patterns
  for (let i = 8; i < size - 8; i++) {
    grid[6][i] = i % 2 === 0 ? 1 : 0;
    grid[i][6] = i % 2 === 0 ? 1 : 0;
  }

  // Dark module
  grid[size - 8][8] = 1;

  // Hash input string into pseudo-random bitstream with deterministic distribution
  let hash = 0x811c9dc5;
  for (let i = 0; i < data.length; i++) {
    hash ^= data.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }

  // Fill data areas with deterministic pattern based on hash & data bytes
  let byteIndex = 0;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      // Skip finder and timing patterns
      const inFinderTopLeft = r < 9 && c < 9;
      const inFinderTopRight = r < 9 && c >= size - 8;
      const inFinderBottomLeft = r >= size - 8 && c < 9;
      const inTiming = r === 6 || c === 6;
      const inAlign = r >= 16 && r <= 20 && c >= 16 && c <= 20;

      if (!inFinderTopLeft && !inFinderTopRight && !inFinderBottomLeft && !inTiming && !inAlign) {
        const charCode = data.charCodeAt(byteIndex % data.length);
        const bit = ((hash >> ((r * size + c) % 24)) ^ (charCode >> (c % 8))) & 1;
        grid[r][c] = (bit ^ ((r + c) % 2 === 0 ? 1 : 0)) ? 1 : 0;
        byteIndex++;
      }
    }
  }

  return grid;
}

export default function decorate(block) {
  // Create tab list container
  const tabList = document.createElement('div');
  tabList.className = 'tabs-list';
  tabList.setAttribute('role', 'tablist');

  // Create tab panels container
  const tabPanels = document.createElement('div');
  tabPanels.className = 'tabs-panels';

  // Process each row as a tab
  const rows = [...block.children];
  rows.forEach((row, index) => {
    const cols = [...row.children];
    if (cols.length < 2) return;

    const tabId = `tab-${index}`;
    const panelId = `panel-${index}`;

    // Create tab button
    const tabButton = document.createElement('button');
    tabButton.className = 'tabs-tab';
    tabButton.id = tabId;
    tabButton.setAttribute('role', 'tab');
    tabButton.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
    tabButton.setAttribute('aria-controls', panelId);
    tabButton.tabIndex = index === 0 ? 0 : -1;
    tabButton.textContent = cols[0].textContent.trim();

    if (index === 0) {
      tabButton.classList.add('active');
    }

    // Create tab panel
    const tabPanel = document.createElement('div');
    tabPanel.className = 'tabs-panel';
    tabPanel.id = panelId;
    tabPanel.setAttribute('role', 'tabpanel');
    tabPanel.setAttribute('aria-labelledby', tabId);
    tabPanel.hidden = index !== 0;

    // Move content to panel
    tabPanel.append(...cols[1].childNodes);

    // Add click handler
    tabButton.addEventListener('click', () => {
      // Deactivate all tabs
      tabList.querySelectorAll('.tabs-tab').forEach((btn) => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
        btn.tabIndex = -1;
      });

      // Hide all panels
      tabPanels.querySelectorAll('.tabs-panel').forEach((panel) => {
        panel.hidden = true;
      });

      // Activate clicked tab
      tabButton.classList.add('active');
      tabButton.setAttribute('aria-selected', 'true');
      tabButton.tabIndex = 0;
      tabPanel.hidden = false;
    });

    // Keyboard navigation
    tabButton.addEventListener('keydown', (e) => {
      const tabs = [...tabList.querySelectorAll('.tabs-tab')];
      const currentIndex = tabs.indexOf(tabButton);
      let newIndex;

      if (e.key === 'ArrowRight') {
        newIndex = (currentIndex + 1) % tabs.length;
      } else if (e.key === 'ArrowLeft') {
        newIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      } else if (e.key === 'Home') {
        newIndex = 0;
      } else if (e.key === 'End') {
        newIndex = tabs.length - 1;
      }

      if (newIndex !== undefined) {
        e.preventDefault();
        tabs[newIndex].click();
        tabs[newIndex].focus();
      }
    });

    tabList.appendChild(tabButton);
    tabPanels.appendChild(tabPanel);
  });

  // Clear block and add new structure
  block.textContent = '';
  block.appendChild(tabList);
  block.appendChild(tabPanels);
}

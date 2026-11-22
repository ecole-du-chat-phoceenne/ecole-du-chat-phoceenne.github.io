const copyButton = document.querySelector('#copy-address');
const copyStatus = document.querySelector('#copy-status');

if (navigator.clipboard) {
  copyButton.hidden = false;
  copyButton.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(document.querySelector('#delivery-address').innerText);
      copyStatus.textContent = 'Adresse copiée.';
    } catch {
      copyStatus.textContent = 'Vous pouvez sélectionner et copier l’adresse ci-dessus.';
    }
  });
}

async function showProducts() {
  const container = document.querySelector('#gift-groups');
  const status = document.querySelector('#gift-status');
  try {
    const response = await fetch('produits.txt', { cache: 'no-cache' });
    if (!response.ok) throw new Error('Impossible de charger la liste.');
    const rows = (await response.text()).split(/\r?\n/);
    const groups = new Map([['Croquettes', []], ['Sachets', []], ['Autres produits', []]]);
    for (const row of rows) {
      if (!row.trim() || row.trimStart().startsWith('#')) continue;
      const [name, shop, link, category] = row.split('|').map(value => value.trim());
      if (!name || !shop || !link) continue;
      let url;
      try {
        url = new URL(link);
      } catch {
        continue;
      }
      if (url.protocol !== 'https:') continue;
      const item = document.createElement('li');
      const label = document.createElement('strong');
      label.textContent = name;
      const button = document.createElement('a');
      button.className = 'button secondary';
      button.href = url.href;
      button.textContent = 'Voir sur ' + shop;
      item.append(label, button);
      (groups.get(category) ?? groups.get('Autres produits')).push(item);
    }
    const products = document.createDocumentFragment();
    for (const [category, items] of groups) {
      if (!items.length) continue;
      const title = document.createElement('h2');
      title.textContent = category;
      const list = document.createElement('ul');
      list.className = 'gift-list';
      list.append(...items);
      products.append(title, list);
    }
    if (products.childElementCount) {
      container.replaceChildren(products);
      status.hidden = true;
    }
  } catch {
    status.textContent = 'La sélection détaillée est momentanément indisponible.';
  }
}

showProducts();

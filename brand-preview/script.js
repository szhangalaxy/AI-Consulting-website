(() => {
  const assets = JSON.parse(document.getElementById('brand-preview-assets').textContent);
  const choices = [...document.querySelectorAll('[data-logo-choice]')];
  function selectLogo(key, announce = true) {
    const asset = assets[key];
    if (!asset) return;
    const [x, y, width, height] = asset.bounds;
    document.querySelectorAll('.brand-art').forEach(frame => {
      // Display-crop transparent padding without altering the generated asset.
      frame.style.setProperty('--art-width', `${asset.width / width * 100}%`);
      frame.style.setProperty('--art-left', `${-x / width * 100}%`);
      frame.style.setProperty('--art-top', `${50 - (y + height / 2) / width * 400}%`);
      const image = frame.querySelector('img');
      image.src = asset.lockup;
      image.alt = `Noviqa ${asset.name} logo`;
    });
    document.querySelectorAll('[data-logo-symbol]').forEach(image => {
      image.src = asset.symbol;
      image.alt = `Noviqa ${asset.name} symbol`;
    });
    choices.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.logoChoice === key)));
    document.querySelectorAll('[data-logo-name]').forEach(label => { label.textContent = asset.name; });
    document.querySelector('link[rel="icon"]').href = asset.symbol;
    document.title = `Noviqa | ${asset.name} logo comparison`;
    document.documentElement.dataset.logo = key;
    if (announce) document.getElementById('logo-review-status').textContent = `${asset.name} selected. Header, footer and icon samples updated.`;
  }
  choices.forEach(button => button.addEventListener('click', () => selectLogo(button.dataset.logoChoice)));
  selectLogo('current', false);
})();

(function() {
  const loggedIn = localStorage.getItem("lls__isLoggedIn");

  const nav = document.getElementById('menu-english-language-switcher');

  let addedMenuItems = [];
  const addItem = (href, text) => {
    const loginMenuLink = document.createElement('li');
    loginMenuLink.id = 'menu-item-9999-da';
    loginMenuLink.classList.add('menu-item', 'menu-item-type-custom', 'menu-item-object-custom', 'menu-item-9999-da');
    loginMenuLink.innerHTML = `<a href="${href}" tabindex="0">${text}</a>`;

    nav.insertBefore(loginMenuLink, null);

    addedMenuItems.push(loginMenuLink);
  };

  window.lls__onLoginChanged = (loggedIn) => {
    if(loggedIn) {
      localStorage.setItem('lls__isLoggedIn', 'true');
    }
    else {
      localStorage.removeItem('lls__isLoggedIn');
    }

    addedMenuItems.forEach((menuItem) => menuItem.remove());
    addedMenuItems = [];

    // TODO: path prefixes
    if(loggedIn) {
      addItem('/my-page', 'Min side');
      addItem('/logout', 'Log ud');
      return;
    }
    addItem('/login', 'Log ind');
  };

  window.lls__onLoginChanged(loggedIn);
})();

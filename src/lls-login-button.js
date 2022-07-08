(function() {
  let pathPrefix = '';
  let excludePaths = '';
  try {
    pathPrefix = process.env.PATH_PREFIX;
    excludePaths = process.env.EXCLUDE_PATHS;
  }
  catch(error) {
    // Failed to load env vars, that's ok.
  }

  if(excludePaths && new RexExp(excludePaths).test(window.location.pathname)) {
    return;
  }

  const loggedIn = localStorage.getItem("lls__isLoggedIn");

  const nav = document.getElementById('menu-dansk-language-switcher');
  const languageMenuItem = document.getElementById('menu-item-74-en');

  let addedMenuItems = [];
  const addItem = (href, text) => {
    const loginMenuLink = document.createElement('li');
    loginMenuLink.classList.add('menu-item', 'menu-item-type-custom', 'menu-item-object-custom', 'menu-item-9999-da');
    loginMenuLink.innerHTML = `<a href="${pathPrefix + href}" tabindex="0">${text}</a>`;

    nav.insertBefore(loginMenuLink, languageMenuItem);

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

# TopIcons Redux

## Notice

TopIcons Redux is a fork of [TopIcons Plus](https://github.com/phocean/TopIcons-plus). We have taken over maintaining this extension since TopIcons Plus is no longer being maintained. That said, the reason it is no longer maintained may well be valid. Recently, the GNOME project chose to drop support for status icons and any kind of legacy tray in favor of the newer status icon system. Unfortunately, this means that many apps don't have a way of displaying icons until they are updated upstream. As such, we will continue to maintain this until it is no longer needed.

## Introduction

Many applications, such as chat clients, downloaders, and some media players, are meant to run long-term in the background even after you close their window. These applications remain accessible by adding an icon to the GNOME Shell Legacy Tray. However, the Legacy Tray was removed in GNOME 3.26. TopIcons Redux brings those icons back into the top panel so that it's easier to keep track of apps running in the backround.

Enjoy!

## Installation

__NOTE:__ TopIcons Redux requires GNOME Shell 3.16 or newer.

### Recommended: GNOME Shell Extensions website

TopIcons Redux is available on the [GNOME Shell Extensions website](https://extensions.gnome.org/extension/1497/topicons-redux/).

To install extensions through this website, you will need the GNOME Shell integration browser extension which is available for both [Chrome/Chromium](https://chrome.google.com/webstore/detail/gnome-shell-integration/gphhapmejobijbbhgpjhcjognlahblep) and [Firefox](https://addons.mozilla.org/en-US/firefox/addon/gnome-shell-integration/). The first time you visit the Extensions website you will be prompted to install or enable this addon.

Once you have the GNOME Shell integration extension, all you have to do is click the switch on the extension page to the "on" position.

![Toggle Switch](https://gitlab.com/pop-planet/TopIcons-Redux/raw/master/media/toggle-switch.png)

GNOME Shell will display a prompt asking you to confirm that you want to download and install this extension. Select "Install" and you're done! You can find the available settings by going to the [Installed Extensions](https://extensions.gnome.org/local/) page and selecting the wrench-and-screwdriver button for TopIcons Redux.

Be sure to revisit the [Installed Extensions](https://extensions.gnome.org/local/) page occasionally to check for updates (look for a green update button).

### Advanced: Build it yourself

__NOTE:__ The `make` utility is necessary to build TopIcons Redux:

```bash
# Debian, Ubuntu
sudo apt-get install make

# Red Hat, Fedora
sudo dnf install make
```

#### Download a zip

Stable versions can be downloaded from the [tags page](https://gitlab.com/pop-planet/TopIcons-Redux/tags/). Download and extract the zip to a location of your choice.

Using your preferred terminal emulator, navigate to the extracted directory and `make` it.

```bash
cd TopIcons-Redux
make install
```

This will compile the glib schemas and copy all the necessary files to the GNOME Shell extensions directory for your user account (you don't need to use `sudo` since it installs for your user). By default, TopIcons Redux is installed to `$HOME/.local/share/gnome-shell/extensions/topicons-redux@pop-planet.info/`.

If you want to install the extension so that it will be usable system-wide, you will have to change the `INSTALL_PATH` variable, and run the installation using `sudo`.

```bash
sudo make install INSTALL_PATH=/usr/share/gnome-shell/extensions
```

Once installed, reload GNOME Shell by hitting <kbd>Alt</kbd>+<kbd>F2</kbd>, typing `r`, and hitting enter, or by logging out and back in.

Finally, launch the `gnome-tweak-tool` utility to manage extensions. There, you can enable TopIcons Redux and tweak its look and feel.

#### Clone from git

You can pull the latest development version by cloning this repo.

```bash
git clone https://gitlab.com/pop-planet/TopIcons-Redux.git
```

Using your preferred terminal emulator, navigate to the cloned directory and `make` it.

```bash
cd TopIcons-Redux
make install
```

This will compile the glib schemas and copy all the necessary files to the GNOME Shell extensions directory for your user account (you don't need to use `sudo` since it installs for your user). By default, TopIcons Redux is installed to `$HOME/.local/share/gnome-shell/extensions/topicons-redux@pop-planet.info/`.

If you want to install the extension so that it will be usable system-wide, you will have to change the `INSTALL_PATH` variable, and run the installation using `sudo`.

```bash
sudo make install INSTALL_PATH=/usr/share/gnome-shell/extensions
```

Once installed, reload GNOME Shell by hitting <kbd>Alt</kbd>+<kbd>F2</kbd>, typing `r`, and hitting enter, or by logging out and back in.

Finally, launch the `gnome-tweak-tool` utility to manage extensions. There, you can enable TopIcons Redux and tweak its look and feel.

## Credits

TopIcons Redux is a fork of TopIcons Plus, which is itself a fork of TopIcons. Our thanks go out to the following people who helped make TopIcons Redux what it is today:

* [petres](https://github.com/petres/gnome-shell-extension-extensions) - Author of TopIcons Plus
* [Mjnaderi](https://github.com/mjnaderi/TopTray) - Author of the Toptray fork
* Adel Gaddlah - Author of the original TopIcons extension

Additional thanks to the following contributors:

* [nevesnunes](https://github.com/nevesnunes)
* [terrycloth](https://github.com/terrycloth)

INSTALL_PATH = ~/.local/share/gnome-shell/extensions
INSTALL_NAME = topicons-redux@pop-planet.info

install: build
	rm -rf $(INSTALL_PATH)/$(INSTALL_NAME)
	mkdir -p $(INSTALL_PATH)/$(INSTALL_NAME)
	cp -r --preserve=timestamps _build/* $(INSTALL_PATH)/$(INSTALL_NAME)
	rm -rf _build
	echo Installed in $(INSTALL_PATH)/$(INSTALL_NAME)

build: compile-schema
	rm -rf _build
	mkdir _build
	cp -r --preserve=timestamps locale schemas media extension.js metadata.json prefs.js README.md Settings.ui utils.js _build
	rm _build/media/toggle-switch.png
	echo Build was successful

compile-schema: ./schemas/org.gnome.shell.extensions.topicons-redux.gschema.xml
	glib-compile-schemas schemas

clean:
	rm -rf _build

uninstall:
	rm -rf $(INSTALL_PATH)/$(INSTALL_NAME)

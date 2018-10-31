INSTALL_PATH = ~/.local/share/gnome-shell/extensions
INSTALL_NAME = topicons-redux@pop-planet.info

# FreeBSD is special
ifeq ($(shell uname), FreeBSD)
	COPY_CMD = cp -R -p
else
	COPY_CMD = cp -r --preserve=timestamps
endif

install: build
	rm -rf $(INSTALL_PATH)/$(INSTALL_NAME)
	mkdir -p $(INSTALL_PATH)/$(INSTALL_NAME)
	$(COPY_CMD) _build/* $(INSTALL_PATH)/$(INSTALL_NAME)
	rm -rf _build
	echo Installed in $(INSTALL_PATH)/$(INSTALL_NAME)

build: compile-schema
	rm -rf _build
	mkdir _build
	$(COPY_CMD) media schemas CHANGELOG.md extension.js metadata.json prefs.js README.md Settings.ui utils.js _build
	echo Build was successful

compile-schema: ./schemas/org.gnome.shell.extensions.topicons-redux.gschema.xml
	glib-compile-schemas schemas

clean:
	rm -rf _build

uninstall:
	rm -rf $(INSTALL_PATH)/$(INSTALL_NAME)

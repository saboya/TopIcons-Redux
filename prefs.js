/* -*- mode: js; indent-tabs-mode: nil -*- */
/**
 * Copyright (c) 2018 Pop!_Planet Team
 *
 * Original TopIcons Plus extension:
 * Copyright (C) phocean <jc@phocean.net>
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 * - Redistributions of source code must retain the above copyright
 *   notice, this list of conditions and the following disclaimer.
 * - Redistributions in binary form must reproduce the above copyright
 *   notice, this list of conditions and the following disclaimer in the
 *   documentation and/or other materials provided with the distribution.
 * - Neither the name of the GNOME nor the names of its contributors may
 *   be used to endorse or promote products derived from this software
 *   without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */


const GObject        = imports.gi.GObject;
const Gtk            = imports.gi.Gtk;
const Gio            = imports.gi.Gio;
const Lang           = imports.lang;
const Me             = imports.misc.extensionUtils.getCurrentExtension();
const Utils          = Me.imports.utils;

const Gettext = imports.gettext.domain( 'topicons-redux' );
const _       = Gettext.gettext;

let settings;


/**
 * init:
 *
 * Initialize preferences and boostrap translations
 */
function init() {
  settings = Utils.getSettings();
  Utils.initTranslations( 'topicons-redux' );
}


/**
 * buildPrefsWidget:
 */
function buildPrefsWidget() {
  // Setup Builder
  let buildable = new Gtk.Builder();
  buildable.add_from_file( Me.dir.get_path() + '/Settings.ui' );
  let box = buildable.get_object( 'prefs_widget' );

  // Append version
  buildable.get_object( 'extension_version' ).set_text( Me.metadata.version.toString() );

  // Tray Position tab
  buildable.get_object( 'alignment_combo' ).connect( 'changed', function( widget ) {
    settings.set_enum( 'alignment', widget.get_active() );
  } );
  buildable.get_object( 'alignment_combo' ).set_active( settings.get_enum( 'alignment' ) );

  settings.bind( 'offset', buildable.get_object( 'offset' ), 'value', Gio.SettingsBindFlags.DEFAULT );

  // Icon Appearance tab
  settings.bind( 'brightness', buildable.get_object( 'brightness' ), 'value', Gio.SettingsBindFlags.DEFAULT );
  settings.bind( 'contrast', buildable.get_object( 'contrast' ), 'value', Gio.SettingsBindFlags.DEFAULT );
  settings.bind( 'desaturation', buildable.get_object( 'desaturation' ), 'value', Gio.SettingsBindFlags.DEFAULT );
  settings.bind( 'opacity', buildable.get_object( 'opacity' ), 'value', Gio.SettingsBindFlags.DEFAULT );
  settings.bind( 'icon-size', buildable.get_object( 'icon_size' ), 'value', Gio.SettingsBindFlags.DEFAULT );
  settings.bind( 'spacing', buildable.get_object( 'spacing' ), 'value', Gio.SettingsBindFlags.DEFAULT );

  box.show_all();

  return box;
}

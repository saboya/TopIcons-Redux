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


const GObject = imports.gi.GObject;
const Gtk     = imports.gi.Gtk;
const Lang    = imports.lang;
const Gio     = imports.gi.Gio;

const ExtensionUtils = imports.misc.extensionUtils;
const Me             = ExtensionUtils.getCurrentExtension();
const Convenience    = Me.imports.convenience;
const Gettext        = imports.gettext.domain( Me.metadata['gettext-domain'] );
const _              = Gettext.gettext;


/**
 * init:
 *
 * Initialize preferences and boostrap translations
 */
function init() {
    Convenience.initTranslations();
}

const TopIconsReduxSettings = new GObject.Class( {
  Name: 'TopIconsReduxPrefs',
  Extends: Gtk.Grid,

  _init: function( params ) {
    this.parent(params);
    this.margin      = 24;
    this.spacing     = 30;
    this.row_spacing = 10;
    this._settings   = Convenience.getSettings();

    let label           = null;
    let widget          = null;
    let value           = null;
    let positionSetting = null;
    let positionButton  = null;
    let radio           = null;

    // Icon opacity
    label = new Gtk.Label( {
      label  : _( 'Opacity (min: 0, max: 255)' ),
      hexpand: true,
      halign : Gtk.Align.START
    } );

    widget = new Gtk.SpinButton( { halign: Gtk.Align.END } );
    widget.set_sensitive( true );
    widget.set_range( 0, 255 );
    widget.set_value( this._settings.get_int( 'icon-opacity' ) );
    widget.set_increments( 1, 2 );
    widget.connect( 'value-changed', Lang.bind( this, function( w ) {
      value = w.get_value_as_int();
      this._settings.set_int( 'icon-opacity', value );
    } ) );

    this.attach( label, 0, 1, 1, 1 );
    this.attach( widget, 1, 1, 1, 1 );

    // Icon saturation
    label = new Gtk.Label( {
      label  : _( 'Desaturation (min: 0.0, max: 1.0)' ),
      hexpand: true,
      halign : Gtk.Align.START
    } );

    widget = new Gtk.SpinButton( { halign:Gtk.Align.END, digits:1 } );
    widget.set_sensitive( true );
    widget.set_range( 0.0, 1.0 );
    widget.set_value( this._settings.get_double( 'icon-saturation' ) );
    widget.set_increments( 0.1, 0.2 );
    widget.connect( 'value-changed', Lang.bind( this, function( w ) {
      value = w.get_value();
      this._settings.set_double( 'icon-saturation', value );
    } ) );

    this.attach( label, 0, 2, 1, 1 );
    this.attach( widget, 1, 2, 1, 1 );

    // Icon brightness
    label = new Gtk.Label( {
      label  : _( 'Brightness (min: -1.0, max: 1.0)' ),
      hexpand: true,
      halign : Gtk.Align.START
    } );

    widget = new Gtk.SpinButton( { halign:Gtk.Align.END, digits:1 } );
    widget.set_sensitive( true );
    widget.set_range( -1.0, 1.0 );
    widget.set_value( this._settings.get_double( 'icon-brightness' ) );
    widget.set_increments( 0.1, 0.2 );
    widget.connect( 'value-changed', Lang.bind( this, function( w ) {
      value = w.get_value();
      this._settings.set_double( 'icon-brightness', value );
    } ) );

    this.attach( label, 0, 3, 1, 1 );
    this.attach( widget, 1, 3, 1, 1 );

    // Icon contrast
    label = new Gtk.Label( {
      label  : _( 'Contrast (min: -1.0, max: 1.0)' ),
      hexpand: true,
      halign : Gtk.Align.START
    } );

    widget = new Gtk.SpinButton( { halign:Gtk.Align.END, digits:1 } );
      widget.set_sensitive( true );
      widget.set_range( -1.0, 1.0 );
      widget.set_value( this._settings.get_double( 'icon-contrast' ) );
      widget.set_increments( 0.1, 0.2 );
      widget.connect( 'value-changed', Lang.bind( this, function( w ) {
        value = w.get_value();
        this._settings.set_double( 'icon-contrast', value );
      } ) );

      this.attach( label, 0, 4, 1, 1 );
      this.attach( widget, 1, 4, 1, 1 );

      // Icon size
      label = new Gtk.Label( {
        label  : _( 'Icon size (min: 0, max: 96)' ),
        hexpand: true,
        halign : Gtk.Align.START
      } );

      widget = new Gtk.SpinButton( { halign:Gtk.Align.END } );
      widget.set_sensitive( true );
      widget.set_range( 0, 96 );
      widget.set_value( this._settings.get_int( 'icon-size' ) );
      widget.set_increments( 1, 2 );
      widget.connect( 'value-changed', Lang.bind( this, function( w ) {
        value = w.get_value_as_int();
        this._settings.set_int( 'icon-size', value );
      } ) );

      this.attach( label, 0, 5, 1, 1 );
      this.attach( widget, 1, 5, 1, 1 );

      // Icon tray spacing
      label = new Gtk.Label( {
        label  : _( 'Spacing between icons (min: 0, max: 20)' ),
        hexpand: true,
        halign : Gtk.Align.START
      } );

      widget = new Gtk.SpinButton( { halign:Gtk.Align.END } );
      widget.set_sensitive( true );
      widget.set_range( 0, 20 );
      widget.set_value( this._settings.get_int( 'icon-spacing' ) );
      widget.set_increments( 1, 2 );
      widget.connect( 'value-changed', Lang.bind( this, function( w ) {
        value = w.get_value_as_int();
        this._settings.set_int( 'icon-spacing', value );
      } ) );

      this.attach( label, 0, 6, 1, 1 );
      this.attach( widget, 1, 6, 1, 1 );

      // Tray position in panel
      label = new Gtk.Label( {
        label  : _('Tray horizontal alignment'),
        hexpand: true,
        halign : Gtk.Align.START
      } );

      widget = new Gtk.ComboBoxText();
      widget.append( 'center', _( 'Center' ) );
      widget.append( 'left', _( 'Left' ) );
      widget.append( 'right', _( 'Right' ) );
      this._settings.bind( 'tray-pos', widget, 'active-id', Gio.SettingsBindFlags.DEFAULT );
      this.attach( label, 0, 7, 1, 1 );
      this.attach( widget, 1, 7, 1, 1 );

      // Tray order in panel
      label = new Gtk.Label( {
        label  : _('Tray offset'),
        hexpand: true,
        halign : Gtk.Align.START
      } );

      widget = new Gtk.SpinButton({halign:Gtk.Align.END});
      widget.set_sensitive( true );
      widget.set_range( 0, 20 );
      widget.set_value( this._settings.get_int( 'tray-order' ) );
      widget.set_increments( 1, 2 );
      widget.connect( 'value-changed', Lang.bind( this, function( w ) {
        value = w.get_value_as_int();
        this._settings.set_int( 'tray-order', value );
      } ) );

      this.attach( label, 0, 8, 1, 1 );
      this.attach( widget, 1, 8, 1, 1 );

      //this._changedPermitted = true;
    }
} );


/**
 * buildPrefsWidget:
 */
function buildPrefsWidget() {
  let widget = new TopIconsReduxSettings();
  widget.show_all();

  return widget;
}

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


const Shell          = imports.gi.Shell;
const St             = imports.gi.St;
const Main           = imports.ui.main;
const GLib           = imports.gi.GLib;
const Lang           = imports.lang;
const System         = imports.system;
const Clutter        = imports.gi.Clutter;
const PanelMenu      = imports.ui.panelMenu;
const ExtensionUtils = imports.misc.extensionUtils;
const Me             = ExtensionUtils.getCurrentExtension();
const Utils          = Me.imports.utils;

let settings                = null;
let tray                    = null;
let trayIconImplementations = null;
let trayAddedId             = 0;
let trayRemovedId           = 0;
let icons                   = [];
let iconsBoxLayout          = null;
let iconsContainer          = null;
let panelChildSignals       = {};
let blacklist               = [["skype"]];


/**
 * init:
 *
 * Initialize the extension and boostrap translations
 */
function init() {
  Utils.initTranslations( 'topicons-redux' );
}


/**
 * enable:
 *
 * Setup the extension and load all the things!
 */
function enable() {
  tray = Main.legacyTray;

  if (tray) {
      GLib.idle_add( GLib.PRIORITY_LOW, moveToTop );
  } else {
      GLib.idle_add( GLib.PRIORITY_LOW, createTray );
  }

  settings = Utils.getSettings();
  settings.connect( 'changed::alignment', Lang.bind( this, placeTray ) );
  settings.connect( 'changed::offset', Lang.bind( this, placeTray ) );
  settings.connect( 'changed::brightness', Lang.bind( this, setBrightnessContrast ) );
  settings.connect( 'changed::contrast', Lang.bind( this, setBrightnessContrast ) );
  settings.connect( 'changed::desaturation', Lang.bind( this, setDesaturation ) );
  settings.connect( 'changed::opacity', Lang.bind( this, setOpacity ) );
  settings.connect( 'changed::icon-size', Lang.bind( this, setSize ) );
  settings.connect( 'changed::spacing', Lang.bind( this, setSpacing ) );

  connectPanelChildSignals();
}


/**
 * disable:
 *
 * Disable and remove the tray
 */
function disable() {
  if ( Main.legacyTray ) {
    moveToTray();
  } else {
    destroyTray();
  }

  settings.run_dispose();

  disconnectPanelChildSignals();
}


/**
 * onTrayIconAdded:
 *
 * Runs when a tray icon is added
 */
function onTrayIconAdded( o, icon, role, delay=1000 ) {
  // Loop through the array and hide the extension if it is enabled and corresponding application is running
  let iconWmClass = icon.wm_class ? icon.wm_class.toLowerCase() : '';

  for ( let [wmClass, uuid] of blacklist ) {
    if ( ExtensionUtils.extensions[uuid] !== undefined && ExtensionUtils.extensions[uuid].state === 1 && iconWmClass === wmClass) {
      return;
    }
  }

  let iconContainer = new St.Button( { child: icon, visible: false } );

  icon.connect( "destroy", function() {
    icon.clear_effects();
    iconContainer.destroy();
  } );

  iconContainer.connect( 'button-release-event', function( actor, event ) {
    icon.click(event);
  } );

  GLib.timeout_add( GLib.PRIORITY_DEFAULT, delay, Lang.bind( this, function() {
    iconContainer.visible        = true;
    iconsContainer.actor.visible = true;

    return GLib.SOURCE_REMOVE;
  } ) );

  iconsBoxLayout.insert_child_at_index( iconContainer, 0 );
  setIcon( icon );
  icons.push( icon );
}


/**
 * onTrayIconRemoved:
 *
 * Runs when a tray icon is removed
 */
function onTrayIconRemoved( o, icon ) {
  if ( icons.indexOf( icon ) == -1 ) {
    return;
  }

  let parent = icon.get_parent();

  if (parent) {
    parent.destroy();
  }

  icon.destroy();
  icons.splice( icons.indexOf( icon ), 1 );

  if ( icons.length === 0 ) {
    iconsContainer.actor.visible = false;
  }
}


/**
 * onPanelChange:
 *
 * Runs whenever the panel itself is changed
 */
function onPanelChange(actor, child) {
  if ( ! iconsBoxLayout || iconsBoxLayout.get_parent() === child ) {
    return;
  }

  // Refresh position on panel left/center/right
  // Box add/remove child event
  placeTray();
}


/**
 * connectPanelChildSignals:
 */
function connectPanelChildSignals() {
  panelChildSignals = {
    left: {
      add: Main.panel._leftBox.connect( 'actor_added', Lang.bind( this, onPanelChange ) ),
      del: Main.panel._leftBox.connect( 'actor_removed', Lang.bind( this, onPanelChange ) )
    },
    center: {
      add: Main.panel._centerBox.connect( 'actor_added', Lang.bind( this, onPanelChange ) ),
      del: Main.panel._centerBox.connect( 'actor_removed', Lang.bind( this, onPanelChange ) )
    },
    right: {
      add: Main.panel._rightBox.connect( 'actor_added', Lang.bind( this, onPanelChange ) ),
      del: Main.panel._rightBox.connect( 'actor_removed', Lang.bind( this, onPanelChange ) )
    }
  };
}


/**
 * disconnectPanelChildSignals:
 */
function disconnectPanelChildSignals() {
  Main.panel._leftBox.disconnect( panelChildSignals.left.add );
  Main.panel._leftBox.disconnect( panelChildSignals.left.del );
  Main.panel._centerBox.disconnect( panelChildSignals.center.add );
  Main.panel._centerBox.disconnect( panelChildSignals.center.del );
  Main.panel._rightBox.disconnect( panelChildSignals.right.add );
  Main.panel._rightBox.disconnect( panelChildSignals.right.del );
}


/**
 * createIconsContainer:
 */
function createIconsContainer() {
  // Create box layout for icon containers
  iconsBoxLayout = new St.BoxLayout();
  setSpacing();

  // An empty ButtonBox will still display padding,therefore create it without visibility.
  iconsContainer = new PanelMenu.ButtonBox( { visible: false } );
  iconsContainer.actor.add_actor( iconsBoxLayout );
}


/**
 * createTray:
 */
function createTray() {
  createIconsContainer();

  tray = new Shell.TrayManager();
  tray.connect( 'tray-icon-added', onTrayIconAdded );
  tray.connect( 'tray-icon-removed', onTrayIconRemoved );
  if (global.hasOwnProperty( 'screen' ) ) {
    // GNOME 3.28 or older
    tray.manage_screen( global.screen, Main.panel.actor );
  } else {
    // GNOME 3.30+
    tray.manage_screen( Main.panel.actor );
  }
  placeTray();
}


/**
 * destroyTray:
 */
function destroyTray() {
  iconsContainer.actor.destroy();
  iconsContainer = null;
  iconsBoxLayout = null;
  icons          = [];

  tray = null;
  System.gc(); // force finalizing tray to unmanage screen
}


/**
 * moveToTop:
 */
function moveToTop() {
  // Replace signal handlers
  if ( tray._trayIconAddedId ) {
    tray._trayManager.disconnect( tray._trayIconAddedId );
  }

  if ( tray._trayIconRemovedId ) {
      tray._trayManager.disconnect( tray._trayIconRemovedId );
  }

  trayAddedId   = tray._trayManager.connect( 'tray-icon-added', onTrayIconAdded );
  trayRemovedId = tray._trayManager.connect( 'tray-icon-removed', onTrayIconRemoved );

  createIconsContainer();
  placeTray();

  // Move each tray icon to the top
  let length = tray._iconBox.get_n_children();

  for ( let i = 0; i < length; i++ ) {
    let button = tray._iconBox.get_child_at_index( 0 );
    let icon   = button.child;

    button.remove_actor( icon );
    button.destroy();

    // Icon already loaded, no need to delay insertion
    onTrayIconAdded( this, icon, '', 0 );
  }
}


/**
 * moveToTray:
 */
function moveToTray() {
  // Replace signal handlers
  if ( trayAddedId ) {
    tray._trayManager.disconnect( trayAddedId );
    trayAddedId = 0;
  }

  if ( trayRemovedId ) {
    tray._trayManager.disconnect( trayRemovedId );
    trayRemovedId = 0;
  }

  tray._trayIconAddedId = tray._trayManager.connect( 'tray-icon-added', Lang.bind( tray, tray._onTrayIconAdded ) );
  tray._trayIconRemovedId = tray._trayManager.connect( 'tray-icon-removed', Lang.bind( tray, tray._onTrayIconRemoved ) );

  // Clean and move each icon back to the Legacy Tray;
  for ( let i = 0; i < icons.length; i++ ) {
    let icon = icons[i];

    icon.opacity = 255;
    icon.clear_effects();

    let parent = icon.get_parent();

    if ( parent ) {
      parent.remove_actor( icon );
      parent.destroy();
    }

    tray._onTrayIconAdded( tray, icon );
  }

  // Clean containers
  icons = [];

  if ( iconsBoxLayout ) {
    iconsBoxLayout.destroy();
    iconsBoxLayout = null;
  }

  if ( iconsContainer ) {
    if ( iconsContainer.actor ) {
      iconsContainer.actor.destroy();
      iconsContainer.actor = null;
    }

    iconsContainer = null;
  }
}


// Settings

/**
 * placeTray:
 */
function placeTray() {
  let trayPosition = settings.get_enum( 'alignment' );
  let trayOrder    = settings.get_int( 'offset' );

  let parent = iconsContainer.actor.get_parent();

  if ( parent ) {
    parent.remove_actor( iconsContainer.actor );
  }

  // Panel box
  let box;

  if ( trayPosition == 0 ) {
    box = Main.panel._centerBox;
  } else if ( trayPosition == 1 ) {
    box = Main.panel._leftBox;
  } else {
    box = Main.panel._rightBox;
  }

  // Fix index (trayOrder larger than length)
  let length = box.get_n_children();
  let index  = length - Math.min( trayOrder, length );

  box.insert_child_at_index( iconsContainer.actor, index );
}


/**
 * setIcon:
 */
function setIcon( icon ) {
  icon.reactive = true;

  setSize( icon );
  setOpacity( icon );
  setDesaturation( icon );
  setBrightnessContrast( icon );
}


/**
 * setOpacity:
 */
function setOpacity( icon ) {
  let opacityValue = settings.get_int( 'opacity' );

  if ( arguments.length == 1 ) {
    icon.opacityEnterId = icon.get_parent().connect( 'enter-event', function( actor, event ) { icon.opacity = 255; } );
    icon.opacityLeaveId = icon.get_parent().connect( 'leave-event', function( actor, event ) { icon.opacity = opacityValue; } );
    icon.opacity        = opacityValue;
  } else {
    for ( let i = 0; i < icons.length; i++ ) {
      let icon = icons[i];

      icon.opacityEnterId = icon.get_parent().connect( 'enter-event', function( actor, event ) { icon.opacity = 255; } );
      icon.opacityLeaveId = icon.get_parent().connect( 'leave-event', function( actor, event ) { icon.opacity = opacityValue; } );
      icon.opacity        = opacityValue;
    }
  }
}


/**
 * setDesaturation:
 */
function setDesaturation( icon ) {
  let desaturationValue = settings.get_double( 'desaturation' );

  if ( arguments.length == 1 ) {
    let sat_effect = new Clutter.DesaturateEffect( { factor : desaturationValue } );

    // TODO: Is this a duplicate??
    sat_effect.set_factor( desaturationValue );
    sat_effect.set_factor( desaturationValue );
    icon.add_effect_with_name( 'desaturate', sat_effect );
  } else {
    for ( let i = 0; i < icons.length; i++ ) {
      let icon   = icons[i];
      let effect = icon.get_effect( 'desaturate' );

      if (effect) {
        effect.set_factor( desaturationValue );
      }
    }
  }
}


/**
 * setBrightnessContrast:
 */
function setBrightnessContrast( icon ) {
  let brightnessValue = settings.get_double( 'brightness' );
  let contrastValue   = settings.get_double( 'contrast' );

  if ( arguments.length == 1 ) {
    let bright_effect = new Clutter.BrightnessContrastEffect( {} );

    bright_effect.set_brightness( brightnessValue );
    bright_effect.set_contrast( contrastValue );
    icon.add_effect_with_name( 'brightness-contrast', bright_effect );
  } else {
    for ( let i = 0; i < icons.length; i++ ) {
      let icon   = icons[i];
      let effect = icon.get_effect('brightness-contrast');

      effect.set_brightness( brightnessValue );
      effect.set_contrast( contrastValue );
    }
  }
}


/**
 * setSize:
 */
function setSize( icon ) {
  let iconSize    = settings.get_int( 'icon-size' );
  let scaleFactor = St.ThemeContext.get_for_stage( global.stage ).scale_factor;

  if ( arguments.length == 1 ) {
    icon.get_parent().set_size( iconSize * scaleFactor, iconSize * scaleFactor );
    icon.set_size( iconSize * scaleFactor, iconSize * scaleFactor );
  } else {
    for ( let i = 0; i < icons.length; i++ ) {
      let icon = icons[i];

      icon.get_parent().set_size( iconSize * scaleFactor, iconSize * scaleFactor );
      icon.set_size( iconSize * scaleFactor, iconSize * scaleFactor );
    }
  }
}


/**
 * setSpacing:
 */
function setSpacing() {
  let boxLayoutSpacing = settings.get_int( 'spacing' );

  iconsBoxLayout.set_style( 'spacing: ' + boxLayoutSpacing + 'px; margin_top: 2px; margin_bottom: 2px;' );
}

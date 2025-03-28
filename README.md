# FindQC URL Converter Firefox Extension

This Firefox extension automatically converts FindQC URLs to use the `frm=1` parameter.

## Features

- Automatically converts URLs like `https://findqc.com/detail/TB/684275673353?knb=jadeShip` to `https://findqc.com/detail/TB/684275673353?frm=1`
- Works on all FindQC detail pages

## Installation

1. Open Firefox and go to `about:debugging`
2. Click on "This Firefox" in the left sidebar
3. Click on "Load Temporary Add-on"
4. Navigate to the directory containing these files and select `manifest.json`

## Development

The extension consists of:

- `manifest.json`: Extension configuration
- `background.js`: URL modification logic

## How it Works

The extension listens for requests to FindQC detail pages and automatically modifies the URL parameters to use `frm=1` instead of any other parameters.
